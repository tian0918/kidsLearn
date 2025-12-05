<script setup>
import { generateQuestions } from '@/utlits/question';
import { ref,onMounted } from 'vue';
import QuestionTree from '@/components/QuestionTree.vue';

import { useDB } from "@/hooks/useDB";
const { initDB, addRecord, getAllRecords } = useDB();
onMounted(async() => { 
  await initDB();
  const allList = await getAllRecords();
  // console.log(allList);
  
})
const addNew = async (record) => { 
  delete record.hide;
  delete record.id;
  await saveAnswer(record)
  nextQuestion()
}
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
  
    <div class="game-container">
      <header class="header">
      <div class="progress-pill">第 1/5 题</div>
      <div class="score-pill">🌟 {{ score }}</div>
    </header>
      <QuestionTree 
      :key="currentIndex" 
      :question="questionList[currentIndex]"
       @handle-next="addNew"></QuestionTree>

     <div class="keypad-area">
      <div class="keypad-grid">
        <button v-for="n in 9" :key="n" @click="inputNum(n)" class="key-btn">{{ n }}</button>
        <button @click="clearNum" class="key-btn action-btn">❌</button>
        <button @click="inputNum(0)" class="key-btn">0</button>
        <button @click="checkAnswer" class="key-btn confirm-btn">OK</button>
      </div>
    </div>

    </div>
  
</template>
<style>
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
  
  .progress-pill, .score-pill {
    background: rgba(255,255,255,0.8);
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    color: #5D4037;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }
}
/* 键盘区域 */
.keypad-area {
  background: white;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 20px;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.05);

  .keypad-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); 
    gap: 12px;
    max-width: 400px;
    margin: 0 auto;

    .key-btn {
      background: #F5F5F5;
      border: none;
      padding: 15px 0;
      border-radius: 12px;
      font-size: 24px;
      font-weight: 700;
      color: #333;
      box-shadow: 0 4px 0 #E0E0E0;
      transition: active 0.1s;

      &:active {
        transform: translateY(4px);
        box-shadow: none;
      }

      &.confirm-btn {
        background: #42A5F5;
        color: white;
        box-shadow: 0 4px 0 darken(#42A5F5, 15%);
        grid-column: span 1; 
      }

      &.action-btn {
        background: #FFEBEE;
        color: #D32F2F;
        box-shadow: 0 4px 0 #FFCDD2;
      }
    }
  }
}
/*
$bg-color: #FFF9C4;
$block-blue: #42A5F5;
$block-orange: #FFA726;
$block-white: #FFFFFF;
$text-color: #37474F;
*/
</style>