<template>
 <Navbar>
  中国话
 </Navbar>
 <div class="pt-[60px]">
    <div class="grid grid-cols-3 md:grid-cols-6 h-[280px] gap-2 p-2">
      <div class="card flex-center" @click="handleCardClick(item)" v-for="item in lists">
       <div class="flex-center flex-col">
         <div class="text-2xl font-ui">
          {{item.label}}
        </div>
        <div class="font-cute">
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
  {label:'千字文',routeName:'',sub:'天地玄黄',type:'QZW'},
  {label:'百家姓',routeName:'',sub:'姓氏一览',type:'BJX'},
  {label:'三字经',routeName:'',sub:'启蒙',type:'SZJ'},
]
const handleCardClick = (item) => { 
  if (item.routeName != "") {
    router.push(item.routeName)
  } else { 
    router.push({
      name: 'guwen',
      params: {
        type:item.type
      }
    })
  }
  
};
</script>

<style  scoped>
.sksksksks {
  font-family: 'ZCOO LKuaiLe', Times, serif;
}
</style>