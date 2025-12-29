<template>
  <!-- 容器：胶囊形状，自带阴影，适合悬浮在界面角落 -->
  <div class="mini-timer-capsule">
    <!-- 左侧图标区域 -->
    <div class="timer-icon">
      ⏰
    </div>
    
    <!-- 右侧数字区域 -->
    <div class="timer-digits">
      <span>{{ formattedMain }}</span>
      <span class="timer-ms">.{{ formattedMs }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTimestamp } from '@vueuse/core';

// 1. 获取当前时间戳 (自动更新，无需手动 controls)
const  timestamp  = useTimestamp();

// 2. 记录组件加载时的初始时间
const startTime = ref(0);

onMounted(() => {
  startTime.value = Date.now();
  console.log("Timer---",startTime.value);
  
});
const reset = () => {
  const finalTime = elapsed.value;
  
  // 将开始时间重置为当前瞬间
  startTime.value = Date.now();
  return finalTime;
};

// 暴露给父组件
defineExpose({
  reset
});
// 3. 计算流逝时间 (当前时间 - 开始时间)
const elapsed = computed(() => {
  // 如果还没挂载完成，显示 0
  if (startTime.value === 0) return 0;
  return timestamp.value - startTime.value;
});

// 4. 格式化逻辑 (拆分为 主时间 和 毫秒，方便样式区分)
const formattedMain = computed(() => {
  const seconds = Math.floor(elapsed.value / 1000) % 60;
  const minutes = Math.floor(elapsed.value / 1000 / 60) % 60;
  const hours = Math.floor(elapsed.value / 1000 / 60 / 60);

  // 小时:分钟:秒
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const formattedMs = computed(() => {
  const milliseconds = elapsed.value % 1000;
  // 只显示前两位毫秒，减少视觉抖动，或者完整显示看需求
  return milliseconds.toString().padStart(3, '0').slice(0, 2); 
});
</script>

<style scoped>
/* 引入等宽字体，防止数字跳动导致宽度变化 */
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600&display=swap');

.mini-timer-capsule {
  /* 布局与尺寸 */
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  gap: 10px;
  
  /* 卡通风格核心：粗边框 + 硬阴影 */
  background-color: #ffffff;
  border: 3px solid #E9A5F1;
  border-radius: 50px; /* 胶囊圆角 */
  box-shadow: 4px 4px 0px rgba(0,0,0,0.15); /* 较浅的阴影，不喧宾夺主 */
  
  /* 固定高度，防止布局抖动 */
  height: 40px;
  box-sizing: border-box;
  
  /* 字体设置 */
  color: #333;
  user-select: none; /* 防止误选 */
  transition: transform 0.2s;
}

/* 简单的悬停效果，增加一点互动感 */
.mini-timer-capsule:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0px rgba(0,0,0,0.15);
}

.timer-icon {
  font-size: 1.2rem;
  /* 让闹钟图标微微摆动 */
  animation: swing 2s infinite ease-in-out;
  transform-origin: bottom center;
}

.timer-digits {
  font-family: 'VT323', monospace; /* 复古像素风/等宽字体 */
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: baseline;
}

.timer-ms {
  font-size: 1rem; /* 毫秒字体小一点，降低干扰 */
  color: #888;
  width: 24px; /* 固定宽度 */
}

/* 摆动动画 */
@keyframes swing {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(10deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}
</style>