<template>
  <Navbar>
    <template #navTitle>Learn Words</template>
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
import { onMounted } from 'vue';
onMounted(() => { 
  
  console.log(document.documentElement.clientHeight);
  
})
const lists = [
  {label:'字母',routeName:'alphabet',sub:'Alphabet'},
  {label:'星期',routeName:'',sub:'Week'},
  {label:'月份',routeName:'',sub:'Month'},
  // {label:'数字',routeName:'',sub:'Number'},
]
const handleCardClick = (item) => { 
  if (item.routeName != "") {
    router.push(item.routeName)
  } else { 
    router.push({
    name: 'wordItem',
    params: {
      type:item.sub
    }
  })
  }
  
};
</script>

<style  scoped>

</style>