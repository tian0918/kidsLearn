<script setup>
import { generateQuestions } from '@/utlits/question';
import { ref,onMounted } from 'vue';
import QuestionTree from '@/components/QuestionTree.vue';

import { useDB } from "@/hooks/useDB";
const { initDB, addRecord, getAllRecords } = useDB();
onMounted(async() => { 
  await initDB();
  const allList = await getAllRecords();
  console.log(allList);
})
const addNew = async (record) => { 
  delete record.hide;
  delete record.id;
  await addRecord(record)
  nextQuestion()
}


const questionList = ref(generateQuestions());
const currentIndex = ref(0)
const nextQuestion = () => { 
  currentIndex.value++;
  if (currentIndex.value >= questionList.value.length - 1) {
  questionList.value.push(...generateQuestions());
}
};
</script>

<template>
  <main>
    <div>
      
      
    </div>
    <div>
      <QuestionTree 
      :key="currentIndex" 
      :question="questionList[currentIndex]"
       @handle-next="addNew"></QuestionTree>
    </div>
  </main>
</template>
<style>
main {
  flex: 1;
}
</style>