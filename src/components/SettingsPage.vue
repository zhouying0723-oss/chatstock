<template>
  <div class="settings-page">
    <header class="header">
      <router-link to="/" class="back">← 返回</router-link>
      <h1>AI 设置</h1>
    </header>

    <div class="form-card">
      <div class="field">
        <label>API Endpoint</label>
        <input v-model="settings.aiEndpoint" placeholder="https://ark.cn-beijing.volces.com/api/v3/chat/completions" />
      </div>
      <div class="field">
        <label>API Key</label>
        <input v-model="settings.aiApiKey" type="password" placeholder="输入 API Key" />
      </div>
      <div class="field">
        <label>Model</label>
        <input v-model="settings.aiModel" placeholder="doubao-1.5-pro-32k" />
      </div>

      <div class="actions">
        <button class="btn primary" :disabled="saving" @click="save">
          {{ saving ? '保存中…' : '保存' }}
        </button>
        <button class="btn" :disabled="testing" @click="test">
          {{ testing ? '测试中…' : '测试连接' }}
        </button>
      </div>

      <div v-if="testResult" class="test-result" :class="testResult.ok ? 'success' : 'error'">
        {{ testResult.ok ? '连接成功！' : testResult.error }}
      </div>
    </div>

    <SnackBar :message="snackMsg" :type="snackType" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'
import SnackBar from './common/SnackBar.vue'

const settings = useSettingsStore()
const saving = ref(false)
const testing = ref(false)
const testResult = ref(null)
const snackMsg = ref('')
const snackType = ref('info')

onMounted(() => settings.load())

async function save() {
  saving.value = true
  try {
    await settings.save()
    snackMsg.value = '保存成功'
    snackType.value = 'success'
  } catch (e) {
    snackMsg.value = e.message
    snackType.value = 'error'
  } finally {
    saving.value = false
  }
}

async function test() {
  testing.value = true
  testResult.value = null
  try {
    testResult.value = await settings.test()
  } catch (e) {
    testResult.value = { ok: false, error: e.message }
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.back {
  color: var(--cs-accent);
  font-size: 14px;
  text-decoration: none;
}
h1 { font-size: 20px; font-weight: 600; }
.form-card {
  background: var(--cs-bg);
  border: 1px solid var(--cs-border);
  border-radius: var(--cs-radius-md);
  padding: 20px;
}
.field { margin-bottom: 16px; }
label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: var(--cs-ink-soft); }
input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--cs-border);
  border-radius: var(--cs-radius-sm);
  font-size: 14px;
  color: var(--cs-ink);
  background: var(--cs-bg);
  outline: none;
  transition: border-color 0.2s;
}
input:focus { border-color: var(--cs-accent); }
.actions { display: flex; gap: 10px; margin-top: 20px; }
.btn {
  padding: 8px 20px;
  border-radius: var(--cs-radius-sm);
  border: 1px solid var(--cs-border);
  background: var(--cs-bg);
  color: var(--cs-ink);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s;
}
.btn:hover { background: var(--cs-hover); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn.primary { background: var(--cs-accent); color: #fff; border-color: var(--cs-accent); }
.btn.primary:hover { opacity: 0.9; }
.test-result {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: var(--cs-radius-sm);
  font-size: 14px;
}
.test-result.success { background: #f0fdf4; color: #16a34a; }
.test-result.error { background: rgba(var(--cs-danger-rgb), 0.06); color: var(--cs-danger); }
[data-theme="dark"] .test-result.success { background: #052e16; }
</style>
