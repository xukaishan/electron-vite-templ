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
</script>

<template>
    <div class="app-main">
        <div class="app-header">
            <el-icon @click="handleSet" class="header-icon"><tools /></el-icon>
        </div>
        <el-drawer v-model="show" title="设置" direction="ltr">
            <template #default>
                <div>
                    <el-radio v-model="radio1" value="Option 1" size="large"> Option 1 </el-radio>
                    <el-radio v-model="radio1" value="Option 2" size="large"> Option 2 </el-radio>
                </div>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancelClick">取消</el-button>
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
