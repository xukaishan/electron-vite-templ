<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
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
const formRef = ref<FormInstance>()
const dynamicValidateForm = reactive<{
  domains: DomainItem[]
  email: string
}>({
  domains: [
    {
      key: 1,
      value: '',
    },
  ],
  email: '',
})

interface DomainItem {
  key: number
  value: string
}

const removeDomain = (item: DomainItem) => {
  const index = dynamicValidateForm.domains.indexOf(item)
  if (index !== -1) {
    dynamicValidateForm.domains.splice(index, 1)
  }
}

const addDomain = () => {
  dynamicValidateForm.domains.push({
    key: Date.now(),
    value: '',
  })
}

const confirmClick = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<template>
    <div class="app-main">
        <div class="app-header">
            <el-icon @click="handleSet" class="header-icon"><tools /></el-icon>
        </div>
        <el-drawer v-model="show" title="设置" direction="ltr" size="50%">
            <template #default>
                <el-form ref="formRef" :model="dynamicValidateForm" label-width="auto" class="demo-dynamic">
                    <el-form-item
                        v-for="(domain, index) in dynamicValidateForm.domains"
                        :key="domain.key"
                        :label="'Domain' + index"
                        :prop="'domains.' + index + '.value'"
                        :rules="{
                            required: true,
                            message: '该项不能为空',
                            trigger: 'blur',
                        }"
                    >
                        <el-input v-model="domain.value" />
                        <el-button class="mt-2" @click.prevent="removeDomain(domain)">删除类目</el-button>
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
