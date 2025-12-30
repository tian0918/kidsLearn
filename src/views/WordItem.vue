<template>
  <Navbar>
   {{route.params.type}}
  </Navbar>
  <div class="pt-[60px]">
    <WordCard :list="list"  />
  </div>
</template>

<script setup lang="ts">
import { WEEK_DATA, MONTH_DATA } from '@/constant';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import WordCard from '@/components/WordCard.vue';
import Navbar from '@/components/Navbar.vue';
const route = useRoute()
const typeObj = {
  "Week": WEEK_DATA,
  "Month": MONTH_DATA
};
const list = ref([])
watch(() => route.params, () => {
    list.value = typeObj[`${route.params.type}`]
},
  {
    immediate:true
  }
);

</script>

<style scoped>

</style>