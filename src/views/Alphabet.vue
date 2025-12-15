<template>
<div class="flex flex-col h-screen overflow-hidden bg-sky-50">
  <div class="flex items-center justify-between p-3 md:p-4 bg-sky-400 shadow-md z-10">
    <button @click="router.replace('/')">🏠</button>
    <h2 class="text-xl md:text-2xl font-bold text-white drop-shadow-md">Alphabet</h2>
    <div class="w-10"></div>
  </div>
  <div class="flex-1 overflow-y-auto p-4 md:p-8">
    <div class="grid grid-cols-4 md:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto pb-24">
      <button v-for="(letter,idx) in alphabets"
      :key="letter"
      class="aspect-square flex items-baseline justify-center gap-1 rounded-2xl shadow-lg hover:rotate-2 transition-transform"
      :class="getColor(idx)"
      @click="playAudio(letter)"
      >
      <span class="relative top--1/2 translate-y-1/2 text-3xl font-black text-white drop-shadow-sm">{{letter}}</span>
      <span class="relative top--1/2 translate-y-1/2 text-2xl text-white/80 font-bold mt-2">{{letter.toLowerCase()}}</span>
    
      
      </button>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';  
import { ALPHABET_DATA } from '@/constant';
import router from '@/router';
import { useSpeechSynthesis } from '@vueuse/core';
const alphabets = ALPHABET_DATA;
const colors = [
  'bg-rose-400 border-rose-500',
  'bg-sky-400 border-sky-500',
  'bg-lime-400 border-lime-500',
  'bg-amber-400 border-amber-500',
  'bg-violet-400 border-violet-500'
];
const getColor = (index) => colors[index % colors.length];
const letter = ref('')
const { speak } = useSpeechSynthesis(letter, {
  lang: 'en-US',
  rate: 0.5
});

const playAudio = (item) => { 
  letter.value = item.toLowerCase()
  speak()
};
</script>