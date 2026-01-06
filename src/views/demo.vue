<template>
  <div class="max-w-md mx-auto p-4 bg-blue-50 rounded-lg space-y-4 font-sans">
    <h2 class="text-xl font-bold text-blue-700 mb-2">凑十法动态演示 🍬</h2>

    <!-- 数字显示 -->
    <div class="text-lg font-bold mb-4">
      8 + ? = 16
    </div>

    <!-- 糖果动画区域 -->
    <div class="relative w-full min-h-[120px] flex flex-wrap items-end border border-blue-200 p-2 rounded-lg overflow-hidden bg-white">
      <div
        v-for="(c, i) in candies"
        :key="i"
        class="w-10 h-10 flex items-center justify-center text-2xl m-1"
        :ref="el => candyEls[i] = el"
      >
        🍬
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import axios from 'axios'

// 初始糖果数量和总数量
const initialCandyCount = 8
const totalCandy = 16

// 初始化糖果数组
const candies = Array.from({ length: totalCandy })
const candyEls = []

// 教学步骤
const steps = [
  '第一步：先看看 <span class="text-red-500 font-bold">8</span> 个糖果',
  '🍬 还差 <span class="text-red-500 font-bold">2</span> 个凑成 10',
  '第二步：10 再加 <span class="text-red-500 font-bold">6</span> 个到 16',
  '第三步：把两次加的数合起来 2 + 6 = 8',
  '所以 8 + 8 = 16 ✅'
]

const displayedSteps = ref([])

// 打字机每个字符显示间隔
const typingSpeed = 20
const getAllVoices = async() => { 
  const res = await axios.get("http://192.168.2.120:8964/voices")
  if (res.status == 0) { 
    console.log("--获取所有voices",res.data);

  }
  
};
onMounted(() => {
  getAllVoices()
  const tl = gsap.timeline({ defaults: { duration: 0.4, ease: 'power2.out' } })

  // 1️⃣ 先让前 8 个糖果弹跳到行
  tl.to(candyEls.slice(0, 8), {
    y: -20,      // 垂直跳动
    yoyo: true,
    repeat: 1,
    stagger: 0.1
  })
  tl.add(() => typeStep(0), '+=0.3') // 显示步骤1

  // 2️⃣ 再加 2 个糖果到10
  tl.to(candyEls.slice(8, 10), {
    y: -40,
    yoyo: true,
    repeat: 1,
    stagger: 0.1
  })
  tl.add(() => typeStep(1), '+=0.3') // 显示步骤2

  // 3️⃣ 再加剩余糖果到16
  tl.to(candyEls.slice(10, 16), {
    y: -60,
    yoyo: true,
    repeat: 1,
    stagger: 0.05
  })
  tl.add(() => typeStep(2), '+=0.3') // 显示步骤3
  tl.add(() => typeStep(3), '+=0.3') // 步骤4
  tl.add(() => typeStep(4), '+=0.3') // 最终答案
})

// 打字机显示单步函数
function typeStep(index) {
  const fullText = steps[index]
  displayedSteps.value[index] = ''
  let charIndex = 0
  const interval = setInterval(() => {
    displayedSteps.value[index] += fullText[charIndex]
    charIndex++
    if (charIndex >= fullText.length) clearInterval(interval)
  }, typingSpeed)
}
</script>

<style scoped>
/* 可选：让糖果底部对齐，动画更自然 */
</style>
