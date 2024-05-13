<script setup lang="ts">
import { ref, unref, computed, watch } from 'vue';
import type { Ref } from 'vue'
import type { FormInstance, UploadInstance } from 'element-plus';
import { UploadFilled, Tools, DeleteFilled, CirclePlus } from '@element-plus/icons-vue';
import { useStorage } from '@vueuse/core';

const show = ref<any>(false);
const handleSet = () => {
    show.value = true;
};

const formRef = ref<FormInstance>();
const upload = ref<UploadInstance>();

type formItemCfg = {
    key: number | string,
    valueKey?: string,
    value: string
}
type formCfg = {
    curColumnIndex: number,
    formItemCfg: formItemCfg[]
}

const dynamicValidateForm: Ref<formCfg> = useStorage('cfg', {
    curColumnIndex: 0,
    formItemCfg: [
        {
            key: Date.now(),
            valueKey: '',
            value: '',
        },
    ],
});

const removeFormIten = (item: formItemCfg) => {
    const index = dynamicValidateForm.value.formItemCfg.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.value.formItemCfg.splice(index, 1);
    }
};

const addFormIten = () => {
    dynamicValidateForm.value.formItemCfg.push({
        key: Date.now(),
        valueKey: '',
        value: '',
    });
};
const tableInfo: any = ref({
    showData: [],
    tableItems: [
        {
            label: '其他',
            value: 'other',
        },
        {
            label: '文件名称',
            value: 'fileName',
        },
    ],
});

const cptableInfo: any = computed(() => {
    return Object.assign(tableInfo.value, {
        tableItems: dynamicValidateForm.value.formItemCfg
            .map((v: any) => {
                return {
                    label: v.valueKey,
                    value: v.valueKey,
                };
            })
            .concat([
                {
                    label: '其他',
                    value: 'other',
                },
                {
                    label: '文件名称',
                    value: 'fileName',
                },
            ]),
    });
});
const confirmClick = () => {
    unref(formRef)?.validate((valid: boolean | undefined | any) => {
        if (valid) {
            console.log('submit!', dynamicValidateForm.value.formItemCfg);
            show.value = false;
        } else {
            console.log('error submit!');
        }
    });
};

const fileList = ref<any>([]);

const calcRes = (value: any, fileName: string) => {
    const data = value.map((v: any) => {
        return `${v[dynamicValidateForm.value.curColumnIndex]}`;
    });

    const res = dynamicValidateForm.value.formItemCfg.reduce((pre: any, cur: any) => {
        if (cur.valueKey !== 'other') {
            const includesVal = cur.value.split(',').map((v: any) => `${v}`.trim());
            const len = data.filter((it: any) => includesVal.includes(`${it}`.trim())).length;
            pre[cur.valueKey] = len;
        } else {
            pre[cur.valueKey] = 0;
        }
        return pre;
    }, {});
    res.other = data.length - Object.keys(res).reduce((p: any, c: any) => p + res[c], 0);
    res.fileName = fileName;
    tableInfo.value.showData.push(res);
};

declare var XlsxPopulate: any;

watch(
    [() => fileList.value, () => dynamicValidateForm.value],
    ([val, valForm]: any[]) => {
        console.log('val=>', val, valForm);
        tableInfo.value.showData = [];
        if (val && val.length) {
            val.map((file: any) => {
                return new Promise((r: any, j: any) => {
                    XlsxPopulate?.fromDataAsync(file.raw).then((workbook: any) => {
                        const value = workbook.sheet(0).usedRange().value();
                        calcRes(value, file.name);
                        r(true);
                    }).catch(j)
                });
            });
        }
    },
    {
        deep: true
    }
);

</script>

<template>
    <div class="app-main">
        <div class="app-header">
            <el-icon @click="handleSet" class="header-icon"><tools /></el-icon>
        </div>
        <el-drawer v-model="show" title="设置" direction="ltr" size="70%">
            <template #default>
                <el-form ref="formRef" :model="dynamicValidateForm" label-width="auto" class="demo-dynamic">
                    <el-form-item :label="'统计的列数'">
                        <el-input class="header-select" style="width: 140px" v-model="dynamicValidateForm.curColumnIndex" />
                    </el-form-item>
                    <el-form-item>
                        <em class="em">类目为你需要统计的大类名称（随便取）例如: A类; &nbsp;类目项为用英文逗号分隔开的项目, 例如：a1,a2,a3</em>
                    </el-form-item>
                    <el-form-item
                        v-for="(item, index) in dynamicValidateForm.formItemCfg"
                        :key="item.key"
                        :label="'类目' + index"
                        :prop="'formItemCfg.' + index + '.value'"
                        :rules="{
                            required: true,
                            message: '该项不能为空',
                            trigger: 'change',
                        }"
                    >
                        <div class="item-wrapper">
                            <el-input class="input-left item" v-model="item.valueKey" />
                            <el-input type="textarea" class="input-right item" v-model.trim="item.value" />
                            <el-icon v-if="index === dynamicValidateForm.formItemCfg.length - 1" class="input-add" title="新增类目" @click.prevent="addFormIten"><CirclePlus /></el-icon>
                            <el-icon class="input-del" color="#d24545a3" title="删除类目" @click.prevent="removeFormIten(item)"><DeleteFilled /></el-icon>
                        </div>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary" @click="confirmClick">保存配置</el-button>
                </div>
            </template>
        </el-drawer>
        <div class="tools-main">
            <el-upload v-model:file-list="fileList" ref="upload" accept=".xlsx" class="upload-comp" drag :auto-upload="false" multiple>
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            </el-upload>
        </div>
        <el-table class="table-res" :data="cptableInfo.showData" border style="width: 100%">
            <el-table-column :prop="it.value" :label="it.label" v-for="it in cptableInfo.tableItems" :key="it.label" />
        </el-table>
    </div>
</template>

<style lang="scss" scoped>
.app-main {
    .em {
        color: #409eff;
        font-size: 12px;
    }
    width: 100%;
    .el-icon {
        cursor: pointer;
    }
    .app-header {
        display: flex;
        flex: 1;
        align-items: center;
        height: 30px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
        margin-bottom: 4px;
        .header-icon {
            margin: 0 20px 0 auto;
        }
    }
    .item-wrapper {
        display: flex;
        flex-wrap: nowrap;
        // align-items: center;
        flex: 1;
        .input-left {
            flex: 1;
            margin-right: 10px;
            max-height: 32px;
        }
        .input-right {
            flex: 2;
        }
        .input-add {
            margin-left: 10px;
            flex-basis: 30px;
        }
        .input-del {
            flex-basis: 30px;
        }
    }
    .tools-main {
        width: 100%;
        display: flex;
        .upload-comp {
            width: 50%;
        }
        .calc {
            margin: 20px;
        }
    }
    .table-res {
        width: 100%;
        margin-top: 20px;
    }
}
</style>
>
