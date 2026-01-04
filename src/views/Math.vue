<template>
    <Navbar>
        <div class="flex gap-2">
            <div v-if="streak > 1" class="streak">🔥{{ streak }}</div>
        </div>
        <template #rightBtn>
            <div class="star"  @click="router.push('mathHistory')">答题历史</div>
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
                        <div ref="leftRef"
                            class="text-blue-500 drop-shadow-sm leading-none min-w-10 md:min-w-16 px-1 h-16 md:h-24  flex items-center justify-center transition-colors border-2 p-2">
                            {{ hiddenPlace != 'left' ? problem.left : userAnswer }}</div>
                    </div>
                    <!-- Operator -->
                    <div class="flex flex-col items-center pt-2 md:pt-4">
                        <span class="text-gray-300 text-4xl md:text-6xl">+</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <div ref="rightRef"
                            class="text-purple-500 drop-shadow-sm leading-none min-w-10 md:min-w-16 px-1 h-16 md:h-24  flex items-center justify-center transition-colors border-2 p-2">
                            {{ hiddenPlace != 'right' ? problem.right : userAnswer }}</div>
                    </div>
                    <div class="flex flex-col items-center pt-2 md:pt-4">
                        <span class="text-gray-300 text-4xl md:text-6xl">=</span>
                    </div>
                    <div class="flex items-baseline">
                        <div ref="resultRef"
                            class="text-orange-500 drop-shadow-sm leading-none min-w-10 md:min-w-16 px-1 h-16 md:h-24  flex items-center justify-center transition-colors border-2 p-2">
                            {{ hiddenPlace != 'result' ? problem.result : userAnswer }}
                        </div>
                       <p class="text-2xl pl-1.5" @click="getHelp(problem)">
                        <img  src="../assets/images/question.svg"/>
                       </p>
                    </div>

                </div>
            </div>
            <div class="pt-2.5 overflow-y-scroll">
                
                <div class="ai-output p-4rounded-lg space-y-4 font-sans">
                    <div v-if="loading" class="flex items-center space-x-2 text-gray-500">
      <span>AI 正在思考</span>
      <span class="dot" v-for="n in 6" :key="n">.</span>
    </div>
    <div v-else v-for="(step, index) in explainResult" :key="index" class="step">
      <p v-html="displayedSteps[index]"></p>
    </div>
  </div>
            </div>
        </div>
        <NumberBoard @clear="clearInput" @get-result="getResult" @input="getInput"></NumberBoard>
        <!-- <BalloonAnimation :streak="streak" :trigger="showCelebration" /> -->
    </div>
    <CartoonDialog v-model="showDialog" title="提示" theme="pink" confirmText="继续!" cancelText="休息一下🥱"
        @cancel="router.go(-1)" @confirm="addMoreQuestion">
        <div style="display: flex; align-items: center; flex-direction: column;">

            <p>今天已经做了{{ questionList.length }}到题了，很棒啦！还要继续吗？</p>
        </div>
    </CartoonDialog>
</template>
<script setup>
import NumberBoard from '@/components/NumberBoard.vue';
import CartoonDialog from '@/components/CartoonDialog.vue';
import MiniCartoonTimer from '@/components/MiniCartoonTime.vue';
import router from '@/router';
import { ref, computed, useTemplateRef, onUnmounted, onMounted, nextTick } from 'vue';
import { useDB } from '@/hooks/useDB';
import { generateQuestions } from '@/utlits/question';
onUnmounted(() => {
    timerRef.value?.reset();
});
import { speak } from '@/utlits/audio';
import Navbar from '@/components/Navbar.vue';
onMounted(() => {
    speak();
});
const loading = ref(false)
const timerRef = ref(null);
const showDialog = ref(false);
const questionList = ref(generateQuestions());
const score = ref(0);
const curIndex = ref(0);
const problem = ref(questionList.value[curIndex.value]);

const streak = ref(0);

const userAnswer = ref("");
const leftRef1 = useTemplateRef('leftRef');
const rightRef1 = useTemplateRef('rightRef');
const resultRef1 = useTemplateRef('resultRef');


const getRandomLRR = () => {
    const arr = ['left', 'right', 'result'];
    return arr[Math.floor(Math.random() * arr.length)];
};
const hiddenPlace = ref();
const shakePlace = ref();
hiddenPlace.value = getRandomLRR();


const getResult = () => {
    const value = Number(userAnswer.value);
    const correctAnswer = problem.value[hiddenPlace.value];
    console.log('el-left', leftRef1.value);
    console.log('el-right', rightRef1.value);
    console.log('el-result', resultRef1.value);
    const map = {
        left: leftRef1,
        right: rightRef1,
        result: resultRef1
    };

    const el = map[hiddenPlace.value]?.value;
    // let cur = 

    if (value === correctAnswer) {
        score.value += 1;
        streak.value += 1;
        speak("Correct! Good job!");
        addShakeAnimation(el, 'success').then(res => {
            // const lastTimeMs =  timerRef.value?.reset();
            addToIndexDB();
            getNextQuestion();
        });
    } else {
        speak("Oops, try again.");
        shakePlace.value = hiddenPlace.value;
        streak.value = 0;
        problem.value.wrongTimes += 1;
        addShakeAnimation(el, 'shake').then(res => {
            userAnswer.value = '';
        });
    }
};
const { initDB, addRecord, getAllRecords } = useDB();
const addToIndexDB = async () => {
    delete problem.value.id;
    const lastTimeMs = timerRef.value?.reset();
    let obj = { ...problem.value };
    obj.useAnswer = userAnswer.value;
    obj.inputPlace = hiddenPlace.value;
    if (lastTimeMs != undefined) {
        obj.time = lastTimeMs;
    }
    // addToIndexDB (obj)
    await initDB();
    await addRecord('math', obj);

};
const getNextQuestion = async () => {
    hiddenPlace.value = getRandomLRR();
    userAnswer.value = "";
    curIndex.value += 1;
    // console.log("当前INDEX", curIndex.value);
    // console.log("数组长度", questionList.value.length);
    explainResult.value = '';

    if (curIndex.value == questionList.value.length) {
        showDialog.value = true;
        speak(`今天已经做了${questionList.value.length}道题了，很棒啦！还要继续吗？`, 'zh-CN');
    } else {

        problem.value = questionList.value[curIndex.value];
    }
};
const curMax = ref(10);
const addMoreQuestion = () => {
    let min = curMax.value;
    let max = curMax.value += 10;
    questionList.value.push(...generateQuestions(30, max, min));
    showDialog.value = false;
};
const clearInput = () => {
    userAnswer.value = '';
};
const getInput = (num) => {

    userAnswer.value += String(num);
    speak(userAnswer.value);

};
import OpenAI from 'openai';
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: import.meta.env.VITE_DEEPSEEK_API,
  dangerouslyAllowBrowser: true
});
const explainResult = ref([])
const steps = ref([])
const displayedSteps = ref("") // 每步显示内容
const typingSpeed = 30
const getHelp = async (problem) => { 
    loading.value = true
    const left = hiddenPlace.value == 'left' ? '?' : problem.left
    const right = hiddenPlace.value == 'right' ? '?' : problem.right
    const result = hiddenPlace.value == 'result' ? '?' : problem.result
    const content = `
    请使用「凑十法」向小朋友讲解下面的数学计算过程。
讲解时要求：
1️⃣ 语言简短、步骤清楚，不使用复杂术语；
2️⃣ 多用小朋友熟悉的事物（如糖果、苹果、小朋友、小动物等）来举例；
3️⃣ 重点说明“怎样凑成 10”，让小朋友一看就懂；
4️⃣ 语气要温柔、有引导感，适合学龄前或低年级儿童阅读。
请把解题步骤输出成 JSON 数组，每个元素是一条步骤文字:
[
  "第一步：...",
  "第二步：...",
  "第三步：..."
]
`
    // console.log("Current Question", content);
    try {
        const completion = await openai.chat.completions.create({
            messages: [{
                role: 'system',
                content: content
            },
            { role: "user", "content": `${left}+${right} = ${result}` }],
            model: "deepseek-chat",
        });
        let output = completion.choices[0].message.content;
        
        speak(output, 'zh-CN')
        loading.value = false
        // const steps = output.split(/\n\n+/) // 连续换行拆分
        // console.log(JSON.parse(output))
        // console.log(completion.choices[0].message.content);
        // explainResult.value = completion.choices[0].message.content;
        explainResult.value = JSON.parse(output)
        console.log("expla----", explainResult.value);
        displayedSteps.value = explainResult.value.map(() => "");
        console.log('displayedSteps',displayedSteps.value);
        
        
        showWithTypeStyle();
        // speak(explainResult.value,'zh-CH')
    } finally { 

    }
    
};
const showWithTypeStyle = () => { 
     let stepIndex = 0
    //  speak(,'zh-CH')

  const typeStep = () => {
    const fullText = explainResult.value[stepIndex]
    let charIndex = 0

    const interval = setInterval(() => {
        displayedSteps.value[stepIndex] += fullText[charIndex]
      charIndex++
      if (charIndex >= fullText.length) {
        clearInterval(interval)
        stepIndex++
        if (stepIndex < explainResult.value.length) {
          setTimeout(typeStep, 1000) // 步骤间延迟
        }
      }
    }, typingSpeed)
  }

  typeStep()
};
const addShakeAnimation = (el, status) => {
    console.log("addShakeAnimation", el, status);

    return new Promise((resolve) => {
        el.classList.add(`${status}`);
        el.addEventListener('animationend',
            () => {
                el.classList.remove(`${status}`);
                resolve();
            },
            {
                once: true
            }
        );


    });
};
</script>
<style scoped>
    .ai-output p {
  line-height: 1.6;
}
.step {
  transition: all 0.3s ease;
}
.dot {
  display: inline-block;
  animation: blink 6s infinite;
  font-weight: bold;
}

.dot:nth-child(2) { animation-delay: 2s; }
.dot:nth-child(3) { animation-delay: 3s; }
.dot:nth-child(4) { animation-delay: 4s; }
.dot:nth-child(5) { animation-delay: 5s; }
.dot:nth-child(6) { animation-delay: 6s; }

@keyframes blink {
  0%, 20%, 50%, 80%, 100% { opacity: 0; }
  10%, 30%, 60%, 90% { opacity: 1; }
}
    @keyframes shake {
        0% {
            transform: translateX(0);
        }

        20% {
            transform: translateX(-5px);
        }

        40% {
            transform: translateX(5px);
        }

        60% {
            transform: translateX(-5px);
        }

        80% {
            transform: translateX(5px);
        }

        100% {
            transform: translateX(0);
        }
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
