<template>
  <div class="card-wrap">
    
    <div class="card" v-for="item in wordList" :key="item.en"  @click="playSound(item)">
      <div class="flex flex-col items-center p-1 gap-2">
        <div class="pt-2.5">{{item.zh}}</div>
        <div class="">{{item.en}}</div>
        <div class="pb-2.5"> 🔈</div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, watch } from 'vue';
const props = defineProps({
  list: {
    type: Array,
    requied: true,
    default:[]
  }
})
import { speak } from '@/utlits/audio';

const wordList = ref([])
const playSound = (item) => { 
  // console.log("playSound",item);
  speak(`${item.en}`)
};
watch(props.list, (newVal) => { 
  if (newVal) { 
    console.log(newVal);
    
    wordList.value = [...newVal]
  }
},
  { immediate: true }
);
</script>

<style scoped>

</style>