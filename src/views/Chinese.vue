<template>
 <Navbar>
  <template #navTitle>中国话</template>
 </Navbar>
 <div class="pt-[60px]">
    <div class="grid grid-cols-3 md:grid-cols-6 h-[130px] gap-2 p-2">
      <div class="card flex-center" @click="handleCardClick(item)" v-for="item in lists">
       <div class="flex-center flex-col">
         <div class="text-2xl">
          {{item.label}}
        </div>
        <div class="text-[14px]">
          {{item.sub}}
        </div>
       </div>
      </div>
    </div>
 </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import router from '@/router';
const lists = [
  {label:'拼音',routeName:'pinyin',sub:'a o e'},
]
const handleCardClick = (item) => { 
  if (item.routeName != "") {
    router.push(item.routeName)
  } else { 
    
  }
  
};
</script>

<style  scoped>

</style>