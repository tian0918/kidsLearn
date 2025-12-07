<script setup>
import { generateQuestions } from '@/utlits/question';
import QuestionTree from '@/components/QuestionTree.vue';
import { ref, onMounted } from 'vue';
const questionList = ref(generateQuestions());
const currentIndex = ref(0)
const addNew = async (record) => { 
  delete record.hide;
  delete record.id;
  nextQuestion()
}
const nextQuestion = () => { 
  currentIndex.value++;
  if (currentIndex.value >= questionList.value.length - 1) {
  // questionList.value.push(...generateQuestions());
}
};
</script>
<template>
    <div class="game-container">
        <header class="header">
            <div class="progress-pill">第 {{ currentIndex + 1 }}/{{ questionList.length }} 题</div>
        </header>
        <QuestionTree :key="currentIndex" :question="questionList[currentIndex]" @handle-next="addNew">
        </QuestionTree>
    </div>
</template>
<style scoped>
.game-container {
    width: 100vw;
    height: 100vh;
    background-color: #FFF9C4;
    display: flex;
    flex-direction: column;
    font-family: 'Nunito', 'Rounded Mplus 1c', sans-serif;
    overflow: hidden;
}

.header {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;

    .progress-pill,
    .score-pill {
        background: rgba(255, 255, 255, 0.8);
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        color: #5D4037;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
}
</style>