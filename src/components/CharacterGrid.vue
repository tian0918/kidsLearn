<template>
  <div class="flex flex-col items-center justify-end ">
    <svg
    viewBox="0 0 100 100"
    class="bg-white w-10 h-10 md:w-20 md:h-20"
  >
    <line x1="0" y1="20" x2="0" y2="80" stroke="#7bf1a8" stroke-width="2" />
    <line x1="100" y1="20" x2="100" y2="80" stroke="#7bf1a8" stroke-width="2" />
    <!-- 四条线 -->
    <!-- 上线 -->
    <line x1="0" y1="20" x2="100" y2="20" stroke="#7bf1a8" stroke-width="2" />
    <!-- 中上线 -->
    <line x1="0" y1="40" x2="100" y2="40" stroke="#b9f8cf" />
    <!-- 中下线（基线） -->
    <line x1="0" y1="60" x2="100" y2="60" stroke="#b9f8cf" />
    <!-- 下线 -->
    <line x1="0" y1="80" x2="100" y2="80" stroke="#7bf1a8" stroke-width="2" />

    <!-- 拼音文本 -->
    <text
      x="50"
      y="60"
      text-anchor="middle"
      dominant-baseline="alphabetic"
      font-size="30px"
      fill="#111827"
    >
      {{ tone }}
    </text>
  </svg>
    <!-- </div> -->
   
  <div
    class="relative flex items-center justify-center bg-white border border-green-300 w-10 h-10 md:w-20 md:h-20"
    
  >
    <!-- 横线 -->
    <div class="absolute inset-x-0 top-1/2 h-px bg-green-200"></div>
    <!-- 竖线 -->
    <div class="absolute inset-y-0 left-1/2 w-px bg-green-200"></div>

    <!-- 对角线 -->
    <div
      v-if="showDiagonal"
      class="absolute inset-0 pointer-events-none"
    >
      <div class="absolute w-full h-px bg-green-200 rotate-45 top-1/2"></div>
      <div class="absolute w-full h-px bg-green-200 -rotate-45 top-1/2"></div>
    </div>
    
    <!-- 汉字 -->
    <span
      class="z-10 select-none"
      :class="charClass"
      :style="{
        fontSize: fontSize + 'px',
        color: color,
        lineHeight: 1
      }"
    >
      {{ char }}
    </span>
  </div>
  </div>
</template>

<script setup>
import { pinyin } from 'pinyin';  
import { computed } from 'vue';

const props = defineProps({
  char: {
    type: String,
    required: true
  },
  fontSize: {
    type: Number,
    default: 22
  },
  color: {
    type: String,
    default: '#111827'
  },
  showDiagonal: {
    type: Boolean,
    default: true
  },
  charClass: {
    type: String,
    default: 'font-serif'
  },
 
})
const tone = computed(() => { 
  if (/[\u4e00-\u9fa5]/.test(props.char)) {
    return pinyin(props.char)[0][0];
  } else { 
    return '   '
  }
})
</script>
