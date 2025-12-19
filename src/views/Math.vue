<template>
    <div class="flex h-dvh w-screen flex-col items-center gap-2.5 p-3 md:p-4 bg-sky-400 shadow-md z-10">
        <div class="flex w-full justify-between items-center mb-2 md:mb-4 px-1">
            <button @click="router.replace('/')">🏠</button>
            <div class="flex gap-2">
                <div v-if="streak > 1"
                    class="streak">
                    🔥{{ streak }}
                </div>
                <!-- <div class="bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm text-gray-500 font-bold text-xs md:text-sm shadow-sm">
             Level: 0-{mathRange}
          </div> -->
            </div>
            <div
                class="star">
                <span>⭐</span> <span>{{score}}</span>
            </div>
        </div>
        <!--Game Area-->
        <div
            class="flex-1 w-full flex flex-col items-center bg-white rounded-3xl md:rounded-4xl shadow-xl p-3 md:p-8 border-b-8 relative overflow-hidden transition-colors duration-500">
           
            <div class="flex flex-col gap-5 items-center w-full mb-4 md:mb-8 mt-2 md:mt-0">
                 <MiniCartoonTimer ref="timerRef" />
                <div
                    class="flex items-start justify-center gap-1 md:gap-4 text-5xl md:text-8xl font-black text-gray-800">
                    <!-- Number 1  -->
                    <div class="flex flex-col items-center">
                        <div ref="leftRef" class="text-blue-500 drop-shadow-sm leading-none min-w-10 md:min-w-16 px-1 h-16 md:h-24  flex items-center justify-center transition-colors border-2 p-2" 
                        >{{ hiddenPlace != 'left' ? problem.left : userAnswer}}</div>
                    </div>
                    <!-- Operator -->
                    <div class="flex flex-col items-center pt-2 md:pt-4">
                        <span class="text-gray-300 text-4xl md:text-6xl">+</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <div ref="rightRef" class="text-purple-500 drop-shadow-sm leading-none min-w-10 md:min-w-16 px-1 h-16 md:h-24  flex items-center justify-center transition-colors border-2 p-2">{{hiddenPlace != 'right' ? problem.right : userAnswer}}</div>
                    </div>
                    <div class="flex flex-col items-center pt-2 md:pt-4">
                        <span class="text-gray-300 text-4xl md:text-6xl">=</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <div ref="resultRef" class="text-orange-500 drop-shadow-sm leading-none min-w-10 md:min-w-16 px-1 h-16 md:h-24  flex items-center justify-center transition-colors border-2 p-2"
                        >
                            {{ hiddenPlace != 'result' ? problem.result : userAnswer }}
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <NumberBoard
        @clear="clearInput"
        @get-result="getResult"
        @input="getInput"
        ></NumberBoard>
        <!-- <BalloonAnimation :streak="streak" :trigger="showCelebration" /> -->
    </div>
    <CartoonDialog 
      v-model="showDialog" 
      title="提示"
      theme="pink"
      confirmText="继续!"
      cancelText="休息一下🥱"
      @cancel="router.go(-1)"
      @confirm="addMoreQuestion"
    >
      <div style="display: flex; align-items: center; flex-direction: column;">
       
        <p>今天已经做了{{questionList.length}}到题了，很棒啦！还要继续吗？</p>
      </div>
    </CartoonDialog>
</template>
<script setup>
import NumberBoard from '@/components/NumberBoard.vue';
import CartoonDialog from '@/components/CartoonDialog.vue';
import MiniCartoonTimer from '@/components/MiniCartoonTime.vue';
import BalloonAnimation from '@/components/BalloonAnimation.vue';
import router from '@/router';
import { ref, computed, useTemplateRef, onUnmounted, onMounted } from 'vue';
import { useDB } from '@/hooks/useDB';
import { generateQuestions } from '@/utlits/question';
onUnmounted(() => { 
    timerRef.value?.reset();
})
import { speak } from '@/utlits/audio';
onMounted(() => {
    speak()
})
const timerRef = ref(null)
const showDialog = ref(false);
const questionList = ref(generateQuestions());
const score = ref(0);
const curIndex = ref(0)
const problem = ref(questionList.value[curIndex.value])

const streak = ref(0);
const message = ref({});
const userAnswer = ref("");
const leftRef = useTemplateRef('leftRef')
const rightRef = useTemplateRef('rightRef')
const resultRef = useTemplateRef('resultRef')
// const borderClass = computed(() => {
//     const type = message.value?.type;
//     if (type === 'success') return 'border-green-500 text-green-500';
//     if (type === 'error') return 'border-red-500 text-red-500';
//     if (type === 'levelup') return 'border-purple-500 text-purple-500';
//     return 'border-gray-300 text-orange-500';
// });

const getRandomLRR = () => {
    const arr = ['left', 'right', 'result'];
    return arr[Math.floor(Math.random() * arr.length)];
};
const hiddenPlace = ref()
const shakePlace = ref()
hiddenPlace.value = getRandomLRR();

const celebrationStages = [10, 25, 40, 50];
const lastCelebrationStage = ref(0);
const showCelebration = ref(false);

const getResult = () => {
    const value = Number(userAnswer.value); 
    const correctAnswer = problem.value[hiddenPlace.value];
    if (value === correctAnswer) {
        score.value += 1;
        streak.value += 1;
        message.value.type = 'success'
        speak("Correct! Good job!")
        addShakeAnimation('success').then(res => {
            // const lastTimeMs =  timerRef.value?.reset();
            addToIndexDB()
            getNextQuestion()
    })
    } else {
        speak("Oops, try again.");
        message.value.type = 'error'
        shakePlace.value = hiddenPlace.value;
        streak.value = 0;
        problem.value.wrongTimes += 1;
        addShakeAnimation('error').then(res => { 
            userAnswer.value = '';
        })
    }
};
const { initDB, addRecord, getAllRecords } = useDB();
const addToIndexDB = async () => {
    delete problem.value.id;
    const lastTimeMs =  timerRef.value?.reset();
    let obj = { ...problem.value }
    obj.useAnswer = userAnswer.value;
    obj.inputPlace = hiddenPlace.value;
    if (lastTimeMs != undefined) { 
        obj.time = lastTimeMs;
    }
    // addToIndexDB (obj)
    await initDB();
    await addRecord('math', obj);

};
const getNextQuestion = async() => { 
    hiddenPlace.value = getRandomLRR()
    userAnswer.value = ""
    curIndex.value += 1;
    console.log("当前INDEX",curIndex.value);
    console.log("数组长度",questionList.value.length);
    
    if (curIndex.value == questionList.value.length) { 
        showDialog.value = true;
        speak(`今天已经做了${questionList.value.length }道题了，很棒啦！还要继续吗？`,'zh-CN')
    }else{

        problem.value = questionList.value[curIndex.value]
    }
};
const addMoreQuestion = () => { 
   
    questionList.value.push(...generateQuestions(30, 20))
    showDialog.value = false
};
const clearInput = () => { 
    userAnswer.value = '';
};
const getInput = (num) => { 
   
    userAnswer.value += String(num) 
    speak(userAnswer.value)
       
};
const addShakeAnimation = (status) => {
    return new Promise((resolve) => {
        let curRef = hiddenPlace.value == 'left' ? leftRef : hiddenPlace.value == 'right' ? rightRef : resultRef;
    curRef.value.classList.add(`${status}`);
        curRef.value.addEventListener('animationend',
      () => {
        curRef.value.classList.remove(`${status}`);
        resolve()
      },
      {
        once: true
      }
    )
    
    
  })
};
</script>
<style scoped>
@keyframes shake {
    0% { transform: translateX(0); }
    20% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
    100% { transform: translateX(0); }
}
.shake {
  animation: shake 0.5s ease-in-out;
}
div {
     &.error {
    background: #FFEBEE;
    border-color: #FF5252;
    color: #FF5252;
    animation: shake 0.4s;
  }

  /* 正确状态 */
  &.success {
    background: #E8F5E9;
    border-color: #66BB6A;
    color: #43A047;
    animation: success 0.4s;
    
  }
}
@keyframes success {
  /* from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; } */
}
</style>


