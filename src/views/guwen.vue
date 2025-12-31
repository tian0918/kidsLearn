<template>
  <Navbar>
    {{ navTitle }}
  </Navbar>
  <div class="pt-[70px] p-2">
    <div class="flex flex-col gap-3">
      <div v-for="(group, groupIndex) in list">
        <div class="flex flex-col items-baseline gap-2">
          <div class="flex items-center">
            <div class="flex-1 grid grid-cols-8 gap-0.5">
              <template v-for="(item, index) in group">
                <template v-if="['，', '。'].indexOf(item) == -1">
                  <CharacterGrid :char="item"></CharacterGrid>
                </template>
                <template v-else>
                  <div class="flex flex-col justify-end text-2xl">{{ item }}</div>
                </template>
              </template>
            </div>
          </div>
          <template v-if="navTitle == '三字经' && groupIndex % 2 != 0">
            <div class="flex gap-4 items-baseline m-1.5">
            <!-- <span class="text-2xl">🗣️</span> -->
            <span @click="getExplain(groupIndex)" class="text-1xl">🤖</span>
          </div>
          </template>
          <template v-else>
            <div class="flex gap-4 items-baseline">
            <div class="flex items-center">
              <!-- <span class="text-2xl">🗣️</span> -->
            <span @click="getExplain(groupIndex)" class="text-1xl block">🤖</span>
            </div>
          </div>
          </template>
          <div v-if="loading && curIndex == groupIndex" :key="groupIndex" class="bubble">
            <span v-for="n in 3" :key="n" class="dot" :style="getStyle(n)"></span>
          </div>
          <div v-if="explainResult[groupIndex]" class="p-3 min-h-5 bg-[#e9eeea] rounded-[10px]">
            <p>{{ explainResult[groupIndex] }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import CharacterGrid from '@/components/CharacterGrid.vue';
import Navbar from '@/components/Navbar.vue';
import { GuWenData } from '../constant';
import { watch, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { GuWenCategory } from '@/types';
import { speak } from '@/utlits/audio';
import OpenAI from 'openai';
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: import.meta.env.VITE_DEEPSEEK_API,
  dangerouslyAllowBrowser: true
});
const getStyle = (index) => ({
  animationDelay: `${index * 0.2}s`
});
const loading = ref(false);
const curIndex = ref(0);
const route = useRoute();
const list = ref([]);
const explainResult = ref({});
//获取 AI 解释内容
const getExplain = async (groupIndex) => {
  curIndex.value = groupIndex;
  loading.value = true;
  let explainContent = "";
  if (navTitle.value == '三字经') {
    explainContent = list.value.filter((item, index) => (index >= groupIndex - 1 && index <= groupIndex)).join(',');
  } else {
    explainContent = list.value[groupIndex].join('');
  }
  try { 
     const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system", content: `你是一位有耐心的儿童启蒙老师并且非常熟悉中国传统知识。
请根据用户提供的《${navTitle.value}》原文内容,用非常简单、温和、适合6岁小朋友理解的语言进行解释。

要求：
1. 使用口语化、短句
2. 不使用抽象或成人化词汇
3. 可以用生活中的例子帮助理解
4. 每句话尽量不超过15个字
5. 语气亲切、像在和孩子说话
6. 不需要讲历史背景，只解释意思
7. 标点符号使用英文半角，不要使用中文全角`
      },
      { role: "user", "content": explainContent }
    ],
    model: "deepseek-chat",
    // stream:true
  });
  explainResult.value[groupIndex] = completion.choices[0].message.content;
  } finally { 
    loading.value = false
  }
 
};

// 语音播放
const playAuido = (groupIndex) => {
  let content = list.value[groupIndex];
  let strin = content.join('');
  speak(strin, 'zh-CH');
};
const navTitle = computed(() => {
  return GuWenCategory[route.params.type];
});

watch(() => route.params, (newVal) => {
  if (newVal.type) {
    list.value = GuWenData[GuWenCategory[route.params.type]];
  }
}, { immediate: true }
);
</script>

<style scoped>

  .bubble {
    display: flex;
    gap: 6px;
    padding: 8px 12px;
    background: #f2f4f7;
    border-radius: 12px;
    width: fit-content;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: #999;
    border-radius: 50%;
    animation: jump 1s infinite ease-in-out;
  }

  @keyframes jump {

    0%,
    80%,
    100% {
      transform: translateY(0);
      opacity: 0.3;
    }

    40% {
      transform: translateY(-3px);
      opacity: 1;
    }
  }
</style>