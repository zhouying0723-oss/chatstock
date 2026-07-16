<template>
  <div class="settings-page">
    <h1 class="page-title">AI 设置</h1>
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
        <input v-model="settings.aiModel" placeholder="doubao-seed-2-0-mini-260428" />
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
        {{ testResult.ok ? '连接成功' : testResult.error }}
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
  max-width: 540px;
  margin: 0 auto;
  padding: 64px 24px 80px;
}
.page-title {
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.003em;
  line-height: 1.1;
  margin-bottom: 40px;
}
.form-card {
  background: var(--cs-sidebar);
  border-radius: var(--cs-radius-lg);
  padding: 32px;
}
.field { margin-bottom: 24px; }
label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--cs-ink-soft);
  letter-spacing: .011em;
  text-transform: uppercase;
}
input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: var(--cs-radius-md);
  font-size: 17px;
  color: var(--cs-ink);
  background: var(--cs-bg);
  outline: none;
  transition: box-shadow 0.3s var(--cs-ease);
}
input:focus { box-shadow: var(--cs-focus-ring); }
.actions { display: flex; gap: 12px; margin-top: 28px; }
.btn {
  padding: 10px 24px;
  border-radius: var(--cs-pill-radius);
  border: none;
  background: var(--cs-border);
  color: var(--cs-ink);
  font-size: 15px;
  font-weight: 400;
  transition: all 0.2s var(--cs-ease);
}
.btn:hover { background: var(--cs-hover); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn.primary { background: var(--cs-ink); color: var(--cs-bg); }
.btn.primary:hover { opacity: 0.85; }
.test-result {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: var(--cs-radius-md);
  font-size: 15px;
}
.test-result.success { background: rgba(48,209,88,0.1); color: #30d158; }
.test-result.error { background: rgba(var(--cs-danger-rgb), 0.06); color: var(--cs-danger); }
</style>
