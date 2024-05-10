<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue';
const onChange = (file: any) => {
    window.XlsxPopulate.fromDataAsync(file.raw).then(workbook => {
        const value = workbook.sheet(0).usedRange().value();
        console.log(value);
    });
};
</script>

<template>
    <div class="app-main">
        <el-upload :on-change="onChange" accept=".xlsx" class="upload-demo" drag :auto-upload="false" multiple>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        </el-upload>
    </div>
</template>

<style lang="scss" scoped>
.app-main {
    width: 100%;
}
</style>
>
