<template>
  <Navbar>
   
      <h2>拼音王国</h2>
    
  </Navbar>
  <div class="pt-[60px] flex flex-col h-screen overflow-hidden">

    <div className="flex justify-center gap-2 p-3 bg-amber-50 overflow-x-auto">
      <button v-for="cat in Object.values(PinyinCategory)" :key="cat" @click="setPinyinTab(cat)"
        class="px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all"
        :class="{ 'bg-amber-500 text-white shadow-lg scale-105': pinyinTab == cat, 'bg-white text-amber-500 hover:bg-amber-100': pinyinTab != cat }">
        {{ cat }}
      </button>

    </div>
    <div class="flex-1 overflow-y-auto p-4 bg-amber-50">
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 max-w-5xl mx-auto pb-24">
        <button v-for="(item, idx) in pinyinData[pinyinTab]" :key="item"
          class="aspect-square flex items-center justify-center rounded-2xl shadow-md text-3xl md:text-4xl font-black text-white hover:scale-105 transition-transform"
          :class="getColor(idx)"
          @click="playAudio(item)">
          {{ item }}
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { PinyinCategory } from '../types';
import { PINYIN_DATA } from '@/constant';
import Navbar from '@/components/Navbar.vue';
const pinyinData = PINYIN_DATA;

const colors = [
  'bg-rose-400 border-rose-500',
  'bg-sky-400 border-sky-500',
  'bg-lime-400 border-lime-500',
  'bg-amber-400 border-amber-500',
  'bg-violet-400 border-violet-500'
];
const getColor = (index) => colors[index % colors.length];
const pinyinTab = ref(PinyinCategory.SHENGMU);
function setPinyinTab(cat) {

  pinyinTab.value = cat;
};
//http://du.hanyupinyin.cn/du/pinyin/ing.mp3
const playAudio = async (item) => { 
  // if (pinyinTab.value == PinyinCategory.SHENGMU) {
  //   try {
  //     const module = await import(`@/assets/audio/${item}.mp3`);
  //     const audio = new Audio(module.default);
  //     audio.play();
  //   } catch (err) {
  //     console.log(`未找到${item}.mp3`);

  //   }
  // } else { 
    if (['ü', 'üe', 'ün'].indexOf(item) != -1) { 
      item = item.replace('ü','v')
    }
    if(pinyinTab.value == PinyinCategory.ZHENGTI) {
      item = item + '1'
    }
    console.log(pinyinTab,item);
    
  const audio = new Audio(`http://du.hanyupinyin.cn/du/pinyin/${item}.mp3`);
  audio.volume = 1.0;
  audio.play()
  // }
  
};
</script>