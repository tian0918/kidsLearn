<template>
 <div class="w-full grid grid-cols-3 gap-2 md:gap-4 mb-2 md:mb-4 flex-1 content-center p-2">
      <button v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :key="num"
        @click="userInput(num)"
        class="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-2xl md:text-3xl font-black py-2 md:py-4 rounded-xl md:rounded-2xl shadow-sm border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all text-gray-700"
      >
    {{num}}</button>
    <button
    class="bg-rose-100 hover:bg-rose-200 text-rose-500 text-lg md:text-xl font-black py-2 md:py-3 rounded-xl md:rounded-2xl shadow-sm border-b-4 border-rose-200 active:border-b-0 active:translate-y-1 transition-all"
    @click="clearInput"
            >
              CLR
            </button>
            <button
              
              class="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-2xl md:text-3xl font-black py-2 md:py-3 rounded-xl md:rounded-2xl shadow-sm border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all text-gray-700"
              @click="userInput(0)"
            >
              0
            </button>
             <button
             
              class="bg-green-400 hover:bg-green-500 text-white text-xl md:text-2xl font-black py-2 md:py-3 rounded-xl md:rounded-2xl shadow-md border-b-4 border-green-600 active:border-b-0 active:translate-y-1 transition-all"
              @click="calResult"
            >
              GO
            </button>
    </div>
</template>

<script setup>
const emit = defineEmits(['input','getResult','clear'])
const userInput = (num) => { 
  emit('input',num)
};
const calResult = () => { 
  emit('getResult')
};
const clearInput = () => { 
  emit('clear')
};
</script>

<style lang="scss" scoped>

</style>