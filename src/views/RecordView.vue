<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// ==================== 1. 可配置项 ====================
const dailyTarget = ref(50) // 每日目标答题数（可通过 input 修改）

const themes = {
  github: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  blue:   ['#ebedf0', '#a0d8ef', '#6bb6dc', '#3d8fc6', '#1b4f72'],
  purple: ['#ebedf0', '#d7aefb', '#b57edc', '#9c57c1', '#6a1b9a'],
  orange: ['#ebedf0', '#ffccb6', '#ff9a7a', '#ff7043', '#e64a19'],
  red:    ['#ebedf0', '#ff9e9e', '#ff6b6b', '#ff4444', '#cc0000']
}

const currentTheme = ref<keyof typeof themes>('github')

// ==================== 2. 模拟数据（实际项目请替换）=================
interface DayData {
  date: string       // '2025-03-15'
  count: number      // 当天答题数量
  correctRate: number // 0~1
  tooltip?: string
}

const rawData = ref<DayData[]>([
  // 这里放你真实的 365 天数据……（示例省略 300+ 天）
  { date: '2025-12-04', count: 68, correctRate: 0.92 },
  { date: '2025-12-03', count: 45, correctRate: 0.85 },
  { date: '2025-12-02', count: 12, correctRate: 1 },
  // ... 更多
])

// 生成最近 365 天（包含空天）
const days = computed(() => {
  const arr: (DayData & { effective: number; level: 0|1|2|3|4 })[] = []
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().slice(0, 10)
    
    const day = rawData.value.find(d => d.date === dateStr) || {
      date: dateStr,
      count: 0,
      correctRate: 0
    }
    
    const effective = day.count * day.correctRate
    const level = getLevel(effective)
    
    arr.push({
      ...day,
      effective,
      level,
      tooltip: day.count === 0 
        ? '无学习' 
        : `${day.count} 题 · 正确率 ${(day.correctRate*100).toFixed(0)}% · 有效 ${effective.toFixed(1)}`
    })
  }
  return arr
})

// ==================== 3. 动态阈值 + 分级函数 ====================
const thresholds = computed(() => {
  const max = dailyTarget.value
  return [0, max * 0.05, max * 0.25, max * 0.5, max * 0.9] // 可微调比例
})

function getLevel(effective: number): 0|1|2|3|4 {
  if (effective === 0) return 0
  const t = thresholds.value
  if (effective < t[1]) return 1
  if (effective < t[2]) return 2
  if (effective < t[3]) return 3
  return 4
}

// 颜色数组
const colors = computed(() => themes[currentTheme.value])

// 当目标或主题变化时自动刷新
watch([dailyTarget, currentTheme], () => {
  // 触发重新计算
})
</script>

<template>
  <div class="learning-calendar">
    <!-- 控制栏 -->
    <div class="controls mb-6 flex gap-4 flex-wrap items-center">
      <div>
        <label class="mr-2 text-sm">每日目标答题数：</label>
        <input
          v-model.number="dailyTarget"
          type="number"
          min="10"
          max="200"
          class="w-20 px-2 py-1 border rounded"
        />
      </div>
      
      <div class="flex gap-2">
        <button
          v-for="theme in Object.keys(themes)"
          :key="theme"
          @click="currentTheme = theme as any"
          :class="{ active: currentTheme === theme }"
          class="px-3 py-1 rounded text-sm capitalize"
          :style="{ background: currentTheme === theme ? themes[theme as keyof typeof themes][3] : '', color: currentTheme === theme ? 'white' : '' }"
        >
          {{ theme }}
        </button>
      </div>
    </div>

    <!-- 热力图主体 -->
    <div class="calendar-container overflow-x-auto">
      <div class="weeks-grid">
        <!-- 7 行（周一到周日） × 53 列 -->
        <div
          v-for="(day, index) in days"
          :key="day.date"
          class="day"
          :class="`level-${day.level}`"
          :style="{
            '--level': day.level,
            '--color': colors[day.level],
            '--height': day.level === 0 ? 0 : day.level * 3 + 6 + 'px'
          }"
          :title="day.tooltip"
        >
          <span class="tooltip">{{ day.tooltip }}</span>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend mt-4 text-sm text-gray-600">
      更少
      <span v-for="i in 5" :key="i" class="inline-block w-3 h-3 mx-1 rounded" :style="{ background: colors[i-1] }"></span>
      更多（有效答题数）
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  background: #f6f8fa;
  padding: 20px 10px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.weeks-grid {
  display: grid;
  grid-template-columns: repeat(53, 11px);
  grid-template-rows: repeat(7, 11px);
  gap: 3px;
  transform: rotateX(60deg) scale(0.95);
  transform-style: preserve-3d;
  perspective: 600px;
  justify-content: center;
}

.day {
  position: relative;
  width: 11px;
  height: 11px;
  background: var(--color);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 核心 3D 立体效果 */
  transform: 
    translateY(calc(11px - var(--height))) 
    translateZ(0);
  box-shadow: 
    2px 2px 4px rgba(0,0,0,0.2),
    inset 0 -2px 4px rgba(0,0,0,0.1);
}

.day:hover {
  transform: 
    translateY(calc(6px - var(--height))) 
    translateZ(16px) 
    scale(1.3);
  z-index: 10;
}

.day .tooltip {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  background-color: black;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  transition: opacity 0.2s;
  z-index: 20;
}

.day:hover .tooltip {
  opacity: 1;
}

.controls button.active {
  opacity: 1;
  font-weight: bold;
}

/* 暗黑模式适配（可选） */
@media (prefers-color-scheme: dark) {
  .calendar-container { background: #161b22; }
  .legend { color: #8b949e; }
}
</style>