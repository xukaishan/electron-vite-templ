<script setup lang="ts">
import XlsxPopulate from 'xlsx-populate'
import { UploadFilled } from '@element-plus/icons-vue';
const onChange = (files: any) => {
    console.log('files=>', files);
    const [file] = files
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
