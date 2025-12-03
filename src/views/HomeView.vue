<script setup>
import { generateQuestions } from '@/utlits/question';
import { ref } from 'vue';
import QuestionTree from '@/components/QuestionTree.vue';
import { storeToRefs } from 'pinia';
import { useQuestion } from '@/stores/question';
const questionStore = useQuestion()
const { quesHistory } = storeToRefs(useQuestion);
const historyList = quesHistory;
const questionList = generateQuestions();
const currentIndex = ref(0)
const nextQuestion = () => { 
  if (currentIndex.value < questionList.length - 1) {
    currentIndex.value++
  }
};
</script>

<template>
  <main>
    <div>
      {{historyList}}
    </div>
    <div>
      <QuestionTree 
      :key="currentIndex" 
      :question="questionList[currentIndex]"
       @handle-next="nextQuestion"></QuestionTree>
    </div>
  </main>
</template>
<style>
main {
  flex: 1;
}
</style>