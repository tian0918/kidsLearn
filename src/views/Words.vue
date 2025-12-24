<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <div class="flex items-center justify-between p-3 md:p-4 bg-sky-400 shadow-md z-10">
    <button @click="router.replace('/')">🏠</button>
    <h2 class="text-xl md:text-2xl font-bold text-white drop-shadow-md">Words</h2>
    <div class="w-10"></div>
  </div>
  <div>
   <div>
    <div v-for="item in lists" :key="item.cateroty">
      <div @click="toItems(item)">
        {{item.title}}
      </div>
    </div>
   </div>
  </div>
  </div>
</template>

<script setup>
import router from '@/router';
//
const lists = [
  { cateroty: 1, title: '星期' },
  { cateroty:2,  title:'月份'}
]
const toItems = (item) => { 
  router.push({
    name: 'wordItem',
    params: {
      type:item.cateroty
    }
  })
};
</script>

<style  scoped>

</style>