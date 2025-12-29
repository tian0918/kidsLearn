<template>
  <div class="fixed top-0 w-dvw bg-[#8F87F1] text-white text-[20px] flex items-center justify-between h-[60px] p-4 z-50">
    <div class="flex-1/3">
      <div @click="router.go(-1)"> &#8592; </div>
    </div>
    <div class="flex-1/3 flex items-center justify-center">
      <slot name="navTitle"></slot>
    </div>
    <div class="flex-1/3">
      <slot name="rightBtn"></slot>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';


</script>

<style scoped>

</style>