<template>
  <div class="tree-container">

    <!-- SVG 连线层 -->
    <svg ref="svgRef" class="svg-layer">
      <line ref="lineLeft" class="link"></line>
      <line ref="lineRight" class="link"></line>
    </svg>
    <!-- <svg class="connections" viewBox="0 0 300 200">
        
        <line x1="150" y1="50" x2="60" y2="150" stroke="#B0BEC5" stroke-width="8" stroke-linecap="round" />
        
        <line x1="150" y1="50" x2="240" y2="150" stroke="#B0BEC5" stroke-width="8" stroke-linecap="round" />
      </svg> -->
    <!-- <div class="node top-node">
        <div class="block total-block animate-drop">
          {{ totalNum }}
        </div>
      </div> -->
    <div class="tree">
      <!-- 根节点 -->
      <div class="node root" ref="rootRef">
        <input class="input-block" v-model="rootValue" disabled />
      </div>

      <!-- 子节点 + 操作符 -->
      <div class="children-row">
        <div class="node child" ref="leftRef">
          <input class="input-block shake" v-model="leftValue" @change="handleLeftChange" />
        </div>

        <div class="node op">
          +
          <!-- <input v-model="operator" /> -->
        </div>

        <div class="node child " ref="rightRef">
          <input class="input-block" v-model="rightValue" @change="handleRightChange" />
        </div>
      </div>
    </div>

  </div>
  <!-- <div class="keypad-area">
      <div class="keypad-grid">
        <button v-for="n in 9" :key="n" @click="inputNum(n)" class="key-btn">{{ n }}</button>
        <button @click="clearNum" class="key-btn action-btn">❌</button>
        <button @click="inputNum(0)" class="key-btn">0</button>
        <button @click="checkAnswer" class="key-btn confirm-btn">OK</button>
      </div>
    </div> -->
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, computed } from "vue";


const emit = defineEmits(['handleNext'])
const props = defineProps(['question']);
const item = computed(() => props.question)

const rootValue = ref(item.value.result);
const leftValue = ref(Math.random() > 0.5 ? item.value.left : '');
const rightValue = ref(leftValue.value == "" ? item.value.right : '');;
const operator = ref("+");


// DOM 引用
const rootRef = ref(null);
const leftRef = ref(null);
const rightRef = ref(null);
const svgRef = ref(null);
const lineLeft = ref(null);
const lineRight = ref(null);
/**
 * 获取节点的顶部/底部中点
 */
function getTopCenter(el) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 + window.scrollX,
    y: r.top + window.scrollY
  };
}

function getBottomCenter(el) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 + window.scrollX,
    y: r.bottom + window.scrollY
  };
}

function updateLines() {
  if (!rootRef.value || !leftRef.value || !rightRef.value) return;

  const rootBottom = getBottomCenter(rootRef.value);   // 根节点底部
  const leftTop = getTopCenter(leftRef.value);         // 左节点顶部
  const rightTop = getTopCenter(rightRef.value);       // 右节点顶部

  const svgRect = svgRef.value.getBoundingClientRect();

  const toSvg = (p) => ({
    x: p.x - svgRect.left,
    y: p.y - svgRect.top
  });

  const r = toSvg(rootBottom);
  const l = toSvg(leftTop);
  const rr = toSvg(rightTop);

  lineLeft.value.setAttribute("x1", r.x);
  lineLeft.value.setAttribute("y1", r.y);
  lineLeft.value.setAttribute("x2", l.x);
  lineLeft.value.setAttribute("y2", l.y);

  lineRight.value.setAttribute("x1", r.x);
  lineRight.value.setAttribute("y1", r.y);
  lineRight.value.setAttribute("x2", rr.x);
  lineRight.value.setAttribute("y2", rr.y);
}

onMounted(() => {
  updateLines();
  window.addEventListener("resize", updateLines);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateLines);
});
const inputNum = (num) => {
  // console.log(String(leftValue.value) += String(num));
  // leftValue.value = 
  // leftValue.value = num
  // if (isCorrect.value) return; // 答对后锁定
  // if (userAnswer.value.length >= 2) return; // 最多输入2位
  // userAnswer.value += num;
  // isError.value = false;
};
const handleLeftChange = (e) => {
  const currentResult = Number(rightValue.value) + Number(e.target.value);
  calculatorResult(currentResult, 'left')
}
const handleRightChange = (e) => {
  const currentResult = +leftValue.value + +e.target.value;
  calculatorResult(currentResult, 'right')
}
const calculatorResult = (result, shakeNode) => {
  const question = (({ id, ...rest }) => rest)(item.value);
  let recordObj = { question: JSON.stringify(question) }
  recordObj.updateTime = Date.now();
  let answer = {
    place: shakeNode,
    value: shakeNode == 'left' ? leftValue.value : rightValue.value
  };
  recordObj['answer'] = JSON.stringify(answer)
  if (result === Number(item.value.result)) {
    recordObj['correct'] = true
    addShakeAnimation(shakeNode == 'left' ? leftRef.value : rightRef.value,'success').then(res => {
      // questionStore.addQuestion(recordObj)
      emit('handleNext', recordObj)

    })
    // emit('handleNext', recordObj)
  } else {
    recordObj['correct'] = false;
    addShakeAnimation(shakeNode == 'left' ? leftRef.value : rightRef.value,'error').then(res => {
      // questionStore.addQuestion(recordObj)
      emit('handleNext', recordObj)

    })
  }
};

const addShakeAnimation = (element,status) => {
  console.log(element)
 
  return new Promise((resolve) => {
    const el = element.querySelector('input');
    el.classList.add(`${status}`);
    el.addEventListener('animationend',
      () => {
        el.classList.remove(`${status}`);
        rightValue.value = "";
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
.tree-container {
  width: 100%;
  max-width: 300px;
  margin: auto;
  position: relative;
}

.tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
}

.children-row {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

input {
  border: none;
}

/* 节点正方形 */
.node {
  width: 60px;
  height: 60px;
  background: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 5px; */
}

.node.op {
  background-color: transparent;
  border: none;
  font-size: 30px;
  color: #90A4AE;
  font-weight: 900;
}

/* .node input:focus {
  outline: none;
  border-color: red;
  
} */
/* .node input {
  outline: none;
  border: none;

  width: 100%;
  height: 100%;

  font-size: 24px;
  text-align: center;
  
} */

/* SVG 连线层 */
.svg-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.link {
  stroke: #B0BEC5;
  stroke-width: 8;
  stroke-linecap: butt
}

.child.shake {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  border-color: red;

}

.input-block {
  background: #FFFFFF;
  color: #37474F;
  border: 4px solid #CFD8DC;
  box-shadow: 0 2px 0 #B0BEC5;
  text-align: center;
  width: 100%;
  height: 100%;


  /* 激活状态 */
  &.active {
    border-color: #42A5F5;
    box-shadow: 0 6px 0 rgba(66, 165, 245, 0.3);
    animation: pulse 2s infinite;
  }

  /* 错误状态 */
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
    /* transform: scale(1.1); */
  }
}





.bond-stage {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
}

/* SVG 连线层，绝对定位在方块后面 */
.connections {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  /* 稍微上移以对齐方块中心 */
  width: 300px;
  height: 250px;
  z-index: 0;
  pointer-events: none;
}

/* 通用积木块样式 */
.block {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 800;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.15);
  /* 3D厚度 */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.top-node {
  margin-bottom: 60px;
  /* 撑开上下距离 */
  z-index: 2;

  .total-block {
    background: #42A5F5;
    color: white;
    box-shadow: 0 6px 0 darken(#42A5F5, 15%);
    width: 90px;
    height: 90px;
    font-size: 40px;
  }
}

.bottom-row {
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 2;

  .part-block {
    background: #FFA726;
    color: white;
    box-shadow: 0 6px 0 darken(#FFA726, 15%);
  }

  .operator {
    font-size: 30px;
    color: #90A4AE;
    font-weight: 900;
  }


}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
@keyframes success {
  /* from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; } */
}
</style>
