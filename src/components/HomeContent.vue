<template>
  <div class="home-main">
    <p class="level-tip">{{ gameStore.level }}</p>
    <img :src="homeLogo" alt="Logo" class="home-logo-img">
    <button class="start-btn" @click="startQuiz">开始答题</button>
    <p v-if="hintMessage" class="hint">{{ hintMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import homeLogo from '@/assets/hero.png'

const router = useRouter()
const gameStore = useGameStore()

const hintMessage = ref('')

const emit = defineEmits(['openDrawer']);

async function startQuiz() {
  if (!gameStore.hasQuestions) {
    hintMessage.value = '请先在右上角上传题库文件。'
    emit('openDrawer')
    return
  }
  hintMessage.value = ''
  await router.push('/item')
}
</script>

<style scoped>
.home-main {
  min-height: calc(100vh - 48px);
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.level-tip {
  font-size: 20px;
  color: #a57c50;
  margin: 0 0 12px;
}

.home-logo-img {
  margin: 0 auto;
  width: 360px;
  max-width: 90%;
  height: 200px;
  object-fit: contain;
}

.start-btn {
  margin-top: 20px;
  border: none;
  border-radius: 8px;
  background: #f59e0b;
  color: #fff;
  padding: 12px 24px;
  font-size: 18px;
  cursor: pointer;
}

.hint {
  margin-top: 12px;
  color: #b45309;
}
</style>
