<template>
  <div>
    Setting
    <button @click="getWindowVoives">GetVoices</button>
    <input type="checkbox"></input>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const voies = ref([]);
onMounted( () => {
	
  // getWindowVoives()
})
const getWindowVoives = async () => { 
  if (!window.speechSynthesis) return;
  const loadVoices = () => {
    const list = window.speechSynthesis.getVoices();
    console.log('voices:', list);
    voies.value = list;
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  // console.log(list);
};
</script>

