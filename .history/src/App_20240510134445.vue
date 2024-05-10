<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { UploadFilled, Tools, DeleteFilled, Plus } from '@element-plus/icons-vue';
const onChange = (file: any) => {
    window.XlsxPopulate.fromDataAsync(file.raw).then((workbook) => {
        const value = workbook.sheet(0).usedRange().value();
        console.log(value);
    });
};
const show = ref(false);
const handleSet = () => {
    show.value = true;
};
interface IFormItem {
    key: number;
    value: string;
}
const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{
    formItemCfg: IFormItem[];
}>({
    formItemCfg: [
        {
            key: 1,
            value: '',
        },
    ],
});

const removeFormIten = (item: IFormItem) => {
    const index = dynamicValidateForm.formItemCfg.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.formItemCfg.splice(index, 1);
    }
};

const addFormIten = () => {
    dynamicValidateForm.formItemCfg.push({
        key: Date.now(),
        value: '',
    });
};

const confirmClick = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
        if (valid) {
            console.log('submit!');
            show.value = false;
        } else {
            console.log('error submit!');
            return false;
        }
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
                            trigger: 'blur',
                        }"
                    >
                        <div class="item-wrapper">
                            <el-input class="input-left item" v-model="item.value" />
                            <el-input class="input-right item" v-model="item.value" />
                            <el-icon v-if="index === dynamicValidateForm.formItemCfg.length - 1" class="input-add" title="新增类目" @click.prevent="addFormIten"><Plus /></el-icon>
                            <el-icon class="input-del" color="#d24545a3" title="删除类目" @click.prevent="removeFormIten(item)"><DeleteFilled /></el-icon>
                        </div>
                    </el-form-item>
                    
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary" @click="confirmClick">确认</el-button>
                </div>
            </template>
        </el-drawer>
        <el-upload :on-change="onChange" accept=".xlsx" class="upload-demo" drag :auto-upload="false" multiple>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        </el-upload>
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
    .item-wrapper{
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        flex: 1;
        .input-left{
            flex: 1;
            margin-right: 10px;
        }
        .input-right{
            flex: 2;
        }
        .input-add{
            flex-basis: 40px;
        }
        .input-del{
            flex-basis: 40px;
        }
    }
}
</style>
>
