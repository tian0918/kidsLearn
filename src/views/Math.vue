<template>
    <Navbar>
        
            <div class="flex gap-2">
                <div v-if="streak > 1" class="streak">🔥{{ streak }}</div>
            </div>
        
        <template #rightBtn>
             <div class="star" @click="router.push('mathHistory')">答题历史</div>
        </template>
    </Navbar>
    <div class="pt-20 h-screen flex w-screen flex-col items-center  p-3 md:p-4 bg-[#FED2E2] shadow-md">
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
import { ref, computed, useTemplateRef, onUnmounted, onMounted, nextTick} from 'vue';
import { useDB } from '@/hooks/useDB';
import { generateQuestions } from '@/utlits/question';
onUnmounted(() => { 
    timerRef.value?.reset();
})
import { speak } from '@/utlits/audio';
import Navbar from '@/components/Navbar.vue';
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

const userAnswer = ref("");
const leftRef1 = useTemplateRef('leftRef')
const rightRef1 = useTemplateRef('rightRef')
const resultRef1 = useTemplateRef('resultRef')


const getRandomLRR = () => {
    const arr = ['left', 'right', 'result'];
    return arr[Math.floor(Math.random() * arr.length)];
};
const hiddenPlace = ref()
const shakePlace = ref()
hiddenPlace.value = getRandomLRR();


const getResult = () => {
    const value = Number(userAnswer.value); 
    const correctAnswer = problem.value[hiddenPlace.value];
    console.log('el-left', leftRef1.value)
    console.log('el-right', rightRef1.value)
    console.log('el-result', resultRef1.value)
    const map = {
    left: leftRef1,
    right: rightRef1,
    result: resultRef1
  }

    const el = map[hiddenPlace.value]?.value;
    // let cur = 
    
    if (value === correctAnswer) {
        score.value += 1;
        streak.value += 1;
        speak("Correct! Good job!")
        addShakeAnimation(el,'success').then(res => {
            // const lastTimeMs =  timerRef.value?.reset();
            addToIndexDB()
            getNextQuestion()
    })
    } else {
        speak("Oops, try again.");
        shakePlace.value = hiddenPlace.value;
        streak.value = 0;
       problem.value.wrongTimes += 1;
        addShakeAnimation(el,'shake').then(res => { 
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
const curMax = ref(10)
const addMoreQuestion = () => { 
    let min = curMax.value
    let max = curMax.value += 10;
    questionList.value.push(...generateQuestions(30, max, min))
    showDialog.value = false
};
const clearInput = () => { 
    userAnswer.value = '';
};
const getInput = (num) => { 
   
    userAnswer.value += String(num) 
    speak(userAnswer.value)
       
};
const addShakeAnimation = (el, status) => {  
    console.log("addShakeAnimation",el,status);
      
    return new Promise((resolve) => {
    el.classList.add(`${status}`);
        el.addEventListener('animationend',
      () => {
        el.classList.remove(`${status}`);
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
    background: #FFEBEE;
 border-color: #FF5252;
 color: #FF5252;
  animation: shake 0.5s ease-in-out;
}

div {
   

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


