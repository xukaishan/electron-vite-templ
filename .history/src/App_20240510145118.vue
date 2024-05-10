<script setup lang="ts">
import { reactive, ref, unref, computed } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import { UploadFilled, Tools, DeleteFilled, CirclePlus } from '@element-plus/icons-vue';
import { useStorage } from '@vueuse/core';

const show = ref(false);
const handleSet = () => {
    show.value = true;
};
interface IFormItem {
    key: number;
    value: string;
}
const formRef = ref<FormInstance>();
const curColumnIndex = ref(2)

const dynamicValidateForm = useStorage('cfg', {
    formItemCfg: [
        {
            key: Date.now(),
            valueKey: '',
            value: '',
        },
    ],
});

const removeFormIten = (item: IFormItem) => {
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
const tableInfo = ref({
    showData: [],
    tableItems: [
        {
            label: '其他',
            value: 'other',
        },
    ],
});

const cptableInfo = computed(() => {
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
            ]),
    });
});
const confirmClick = (formEl: FormInstance | undefined) => {
    unref(formRef).validate((valid: any) => {
        if (valid) {
            console.log('submit!', dynamicValidateForm.value.formItemCfg);

            show.value = false;
        } else {
            console.log('error submit!');
            return false;
        }
    });
};

const onChange = (file: any) => {
    (window.XlsxPopulate).fromDataAsync(file.raw).then((workbook: any) => {
        const value = workbook.sheet(0).usedRange().value();
        console.log(value);
        const data = value

        const res = tableInfo.value.tableItems.reduce((pre: any, cur: any) => {
            pre[cur.value] = ''
            return pre
        }, {})
        tableInfo.value.showData = [res]
    });
};
</script>

<template>
    <div class="app-main">
        <div class="app-header">
            <el-icon @click="handleSet" class="header-icon"><tools /></el-icon>
        </div>
        <el-drawer v-model="show" title="设置" direction="ltr" size="70%">
            <template #default>
                <el-form ref="formRef" :model="dynamicValidateForm" label-width="auto" class="demo-dynamic">
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
                            <el-input type="textarea" class="input-right item" v-model="item.value" />
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
            <el-upload :on-change="onChange" accept=".xlsx" class="upload-comp" drag :auto-upload="false" multiple>
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
    width: 100%;
    .el-icon {
        cursor: pointer;
    }
    .app-header {
        display: flex;
        height: 30px;
        .header-icon {
            margin-left: auto;
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
    }
    .table-res {
        width: 100%;
        margin-top: 20px;
    }
}
</style>
>
