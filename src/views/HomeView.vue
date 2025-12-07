<script setup>
import { onMounted } from 'vue';
import SubjectSelect from './SubjectSelect.vue';
import { useDB } from "@/hooks/useDB";
const { initDB, addRecord, getAllRecords } = useDB();
onMounted(async() => { 
  await initDB();
  const allList = await getAllRecords();
})

import { useFirestorerecords } from "@/hooks/useFirestorerecords";
const {
  records,
  streak,
  loading,
  saveAnswer,
  loadAnswers,
  listenRecords
} = useFirestorerecords();
listenRecords();



</script>

<template>
    <SubjectSelect/>
</template>
<style>
</style>