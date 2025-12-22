<template>
  <div class="flex items-center justify-between p-3 md:p-4 bg-sky-400 shadow-md z-10">
    <button @click="router.replace('/')">🏠</button>
    <div class="star">共答题:{{ allCount }}</div>
    <div class="error">错误:{{ errorCount }}</div>
  </div>
  <div>
    <div v-for="item in allHistory" class="bg-green-50 p-1">

      <div class="flex items-center gap-4 justify-around m-2.5 bg-amber-50">
        <div>{{ item.id }}</div>
        <div class="flex items-center gap-2">
          <div class="flex flex-col items-center">
            <div
              class="drop-shadow-sm leading-none min-w-5 md:min-w-16 px-1 h-8 md:h-24  flex items-center justify-center transition-colors border"
              :class="{ 'text-red-500': item.inputPlace == 'left' && item.wrongTimes > 0 }">{{ item.left }}</div>
          </div>
          <!-- Operator -->
          <div class="flex flex-col items-center pt-2 md:pt-4">
            <span class="text-gray-300 text-4xl md:text-6xl">{{ item.op }}</span>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="drop-shadow-sm leading-none min-w-5 md:min-w-16 px-1 h-8 md:h-24  flex items-center justify-center transition-colors border "
              :class="{ 'text-red-500': item.inputPlace == 'right' && item.wrongTimes > 0 }">{{ item.right }}</div>
          </div>
          <div class="flex flex-col items-center pt-2 md:pt-4">
            <span class="text-gray-300 text-4xl md:text-6xl">=</span>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="drop-shadow-sm leading-none min-w-5 md:min-w-16 px-1 h-8 md:h-24  flex items-center justify-center transition-colors border"
              :class="{ 'text-red-500': item.inputPlace == 'result' && item.wrongTimes > 0 }">
              {{ item.result }}
            </div>
          </div>
        </div>
        <div>{{ item.wrongTimes > 0 ? '❌' : '✅' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDB } from '@/hooks/useDB';
import { computed, onMounted, ref } from 'vue';
import router from '@/router';
const { initDB, getAllRecords } = useDB();
const allHistory = ref([]);
const allCount = computed(() => {
  return allHistory.value.length;
});
const errorCount = computed(() => {
  return allHistory.value.filter(item => item.wrongTimes > 0).length;
});
const getHistory = async () => {
  try {
    await initDB();
    const allHis = await getAllRecords('math');
    allHistory.value = allHis || []; // 确保有默认值
  } catch (error) {
    console.error('获取历史记录失败:', error);
    allHistory.value = [];
  }
};
onMounted(() => {
  getHistory();
});
</script>

<style scoped></style>