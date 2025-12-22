<template>
  <div v-if="show"  class="absolute h-dvh w-dvw bg-black/70 z-2025" @click.self="hideen">
    <div class="bg-white h-dvh w-2/3 ">
      <slot></slot>
      
    </div>
  </div>
</template>

<script setup>
const { show } = defineProps(['show']);
const emit = defineEmits(['update:show'])
const hideen = () => { 
  emit('update:show',false)
};
</script>

<style scoped>

</style>