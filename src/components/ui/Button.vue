<template>
  <div>
     <button 
     :class="[variants[key],baseStyles]"
    >
      <slot/>
    </button>
  </div>
</template>

<script setup>
const props = defineProps(['varintKey'])
const key = props.varintKey
const baseStyles = "w-full py-4 rounded-2xl font-bold text-xl transition-all transform active:scale-95 flex items-center justify-center relative overflow-hidden";
 const variants = {
    primary: "bg-yellow-400 hover:bg-yellow-300 text-yellow-900 shadow-[0_6px_0_rgb(202,138,4)] active:shadow-none active:translate-y-[6px]",
    secondary: "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_6px_0_rgb(67,56,202)] active:shadow-none active:translate-y-[6px]",
    outline: "bg-white border-4 border-sky-200 text-sky-500 hover:bg-sky-50"
  };
</script>

<style lang="scss" scoped>

</style>