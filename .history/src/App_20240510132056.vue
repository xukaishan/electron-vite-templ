<script setup lang="ts">
import { ref } from 'vue';
import { UploadFilled, Tools } from '@element-plus/icons-vue';
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
const confirmClick = () => {
    show.value = false;
};
</script>

<template>
    <div class="app-main">
        <div class="app-header">
            <el-icon @click="handleSet" class="header-icon"><tools /></el-icon>
        </div>
        <el-drawer v-model="show" title="设置" direction="ltr" size="50%">
            <template #default>
                <el-form ref="formRef" style="max-width: 600px" :model="dynamicValidateForm" label-width="auto" class="demo-dynamic">
                    <el-form-item
                        prop="email"
                        label="Email"
                        :rules="[
                            {
                                required: true,
                                message: 'Please input email address',
                                trigger: 'blur',
                            },
                            {
                                type: 'email',
                                message: 'Please input correct email address',
                                trigger: ['blur', 'change'],
                            },
                        ]"
                    >
                        <el-input v-model="dynamicValidateForm.email" />
                    </el-form-item>
                    <el-form-item
                        v-for="(domain, index) in dynamicValidateForm.domains"
                        :key="domain.key"
                        :label="'Domain' + index"
                        :prop="'domains.' + index + '.value'"
                        :rules="{
                            required: true,
                            message: 'domain can not be null',
                            trigger: 'blur',
                        }"
                    >
                        <el-input v-model="domain.value" />
                        <el-button class="mt-2" @click.prevent="removeDomain(domain)"> 删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="addDomain">新增类目</el-button>
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
    .app-header {
        display: flex;
        height: 30px;
        .header-icon {
            cursor: pointer;
            margin-left: auto;
        }
    }
}
</style>
>
