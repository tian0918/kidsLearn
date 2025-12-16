<script setup>
import { generateQuestions } from '@/utlits/question';
import QuestionTree from '@/components/QuestionTree.vue';
import { ref, onMounted } from 'vue';
import { useDB } from '@/hooks/useDB';
import router from '@/router';
const questionList = ref(generateQuestions());
const currentIndex = ref(0);
const addNew = async (record) => {
    delete record.hide;
    delete record.id;
    addToIndexDB(record);
    nextQuestion();
};
const nextQuestion = () => {
    currentIndex.value++;
    if (currentIndex.value >= questionList.value.length - 1) {
        // questionList.value.push(...generateQuestions());
    }
};
const { initDB, addRecord, getAllRecords } = useDB();
const addToIndexDB = async (record) => {
    await initDB();
    await addRecord('math', record);

};
</script>
<template>
    <div class="flex flex-col gap-4  h-screen overflow-hidden">
        <div class="flex items-center justify-between p-3 md:p-4 bg-sky-400 shadow-md z-10">
            <button @click="router.replace('/')">🏠</button>
            <h2 class="text-xl md:text-2xl font-bold text-white drop-shadow-md">第 {{ currentIndex + 1 }}/{{ questionList.length }} 题</h2>
            <div class="w-10"></div>
        </div>
    <QuestionTree   :key="currentIndex" :question="questionList[currentIndex]" @handle-next="addNew">
    </QuestionTree>
    </div>
</template>
<style scoped>
    .game-container {
        width: 100vw;
        height: 100vh;
        background-color: #FFFDF5;
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