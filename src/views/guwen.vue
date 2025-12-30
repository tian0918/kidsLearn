<template>
  <Navbar>
   {{navTitle}}
  </Navbar>
  <div class="pt-[70px] p-4">
    <div  class="grid gap-1 grid-cols-8">
      <CharacterGrid v-for="(item,index) in list" :char="item" :key="index"></CharacterGrid>
      <!-- <span>Play</span> -->
    </div>
  </div>
</template>

<script setup>
import { pinyin} from 'pinyin';
import CharacterGrid from '@/components/CharacterGrid.vue';
import Navbar from '@/components/Navbar.vue';
import { GuWenData} from '../constant'
import { watch,ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { GuWenCategory } from '@/types';
const route = useRoute()
const list = ref([])

const navTitle = computed(() => { 
  return GuWenCategory[route.params.type] 
})
// const gridClass = computed(() => { 
//   if (route.params.type == 'SZJ') {
//     return `grid-cols-8`;
//   } else { 
//     return `grid-cols-8`;
//   }
// })
watch(() => route.params, (newVal) => { 
  if (newVal.type) { 
    list.value.push(...GuWenData[GuWenCategory[route.params.type]])
  }
  // if (newVal.type == 'BJX') { 
  //   list.value.push(...BAIJIAXING_DATA);
  // }
  // if (newVal.type == 'SZJ') { 
  //   list.value.push(...SANZIJING_DATA)
  // }
  
}, { immediate: true }
);
onMounted(() => { 
  // getpinyin()
  console.log(pinyin("赵")[0][0]);
})

</script>

<style  scoped>

</style>