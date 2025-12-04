<template>
  <div class="tree-container">

    <!-- SVG 连线层 -->
    <svg ref="svgRef" class="svg-layer">
      <line ref="lineLeft" class="link"></line>
      <line ref="lineRight" class="link"></line>
    </svg>

    <div class="tree">
      <!-- 根节点 -->
      <div class="node root" ref="rootRef">
        <input v-model="rootValue"  disabled />
      </div>

      <!-- 子节点 + 操作符 -->
      <div class="children-row">
        <div  class="node child" ref="leftRef">
          <input  v-model="leftValue" @change="handleLeftChange" />
        </div>

        <div class="node op">
          +
          <!-- <input v-model="operator" /> -->
        </div>

        <div  class="node child" ref="rightRef">
          <input v-model="rightValue"  @change="handleRightChange" />
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, computed } from "vue";


const emit = defineEmits(['handleNext'])
const props = defineProps(['question']);
const item = computed(() => props.question)

const rootValue = ref(item.value.result);
const leftValue = ref(Math.random() > 0.5 ? item.value.left : '');
const rightValue =  ref(leftValue.value == "" ? item.value.right : '');;
const operator = ref("+");


// DOM 引用
const rootRef = ref(null);
const leftRef = ref(null);
const rightRef = ref(null);
const svgRef = ref(null);
const lineLeft = ref(null);
const lineRight = ref(null);
const isShake = ref(false)
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

const handleLeftChange = (e) => { 
  const currentResult = Number(rightValue.value) + Number(e.target.value);
  calculatorResult(currentResult,'left')
}
const handleRightChange = (e) => { 
  const currentResult = +leftValue.value + +e.target.value;
  calculatorResult(currentResult,'right')
}
const calculatorResult = (result,shakeNode) => { 
  let recordObj = { ...item.value }
    recordObj.updateTime = Date.now();
  if (result === Number(item.value.result)) { 
    recordObj['correct'] = true
    
      emit('handleNext',recordObj)
  } else {
    recordObj['correct'] = false;
    recordObj['wronResult'] = result;
    recordObj['wrondNode'] = shakeNode
    addShakeAnimation(shakeNode == 'left' ? leftRef.value : rightRef.value).then(res => { 
      // questionStore.addQuestion(recordObj)
      emit('handleNext',recordObj)

    })
  }
};
const addShakeAnimation = (element) => {
  return new Promise((resolve) => { 
    const el = element;
    el.classList.add('shake');
    el.addEventListener('animationend',
      () => { 
        el.classList.remove('shake');
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
  border: 1px solid #444;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}
 .op {
  border:none;
  font-size: 22px;
}
/* .node input:focus {
  outline: none;
  border-color: red;
  
} */
.node input {
  outline: none;
  border: none;

  width: 100%;
  height: 100%;

  font-size: 24px;
  text-align: center;
  
}

/* SVG 连线层 */
.svg-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.link {
  stroke: #333;
  stroke-width: 1;
}
.child.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  border-color: red;
  
}
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
