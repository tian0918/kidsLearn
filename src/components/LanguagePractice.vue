<template>
  <div class="practice-page">
    <!-- 顶部导航 -->
    <header class="nav-bar">
      <button class="icon-btn back-btn" @click="$router.back()">⬅️</button>
      <div class="title-pill">{{ title }}</div>
      <div class="icon-btn help-btn">❓</div>
    </header>

    <!-- 核心区域：书写与展示 -->
    <main class="notebook-area">
      <div class="paper-sheet">
        <!-- 四线三格背景 -->
        <div class="grid-lines">
          <div class="line top-line"></div>
          <div class="line mid-line"></div>
          <div class="line base-line"></div>
          <div class="line bottom-line"></div>
        </div>

        <!-- 范例文字 (半透明，用于临摹) -->
        <div class="guide-text" :class="fontClass">
          {{ char }}
        </div>

        <!-- 画布 (用户书写层) -->
        <canvas 
          ref="canvasRef"
          class="write-canvas"
          @touchstart.prevent="startDrawing"
          @touchmove.prevent="draw"
          @touchend="stopDrawing"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
        ></canvas>
      </div>

      <!-- 画布控制工具 -->
      <div class="canvas-tools">
        <button class="tool-btn clear-btn" @click="clearCanvas">
          🗑️ 擦掉重写
        </button>
        <span class="hint">👆 在横线上描红哦</span>
      </div>
    </main>

    <!-- 底部：录音与互动 -->
    <footer class="audio-panel">
      
      <!-- 左侧：标准发音 -->
      <div class="audio-col">
        <button class="circle-btn standard-btn" @click="playStandardAudio" :class="{ playing: isPlayingStandard }">
          🔊
        </button>
        <span class="label">听老师读</span>
      </div>

      <!-- 中间：录音按钮 -->
      <div class="audio-col main-col">
        <button 
          class="mic-btn" 
          :class="{ recording: isRecording }"
          @touchstart="startRecording" 
          @touchend="stopRecording"
          @mousedown="startRecording" 
          @mouseup="stopRecording"
        >
          <span class="mic-icon">🎙️</span>
        </button>
        <span class="label">{{ isRecording ? '松开结束' : '按住跟读' }}</span>
      </div>

      <!-- 右侧：我的发音 -->
      <div class="audio-col">
        <button 
          class="circle-btn my-voice-btn" 
          :disabled="!audioUrl"
          @click="playUserAudio"
        >
          👂
        </button>
        <span class="label">听我读</span>
      </div>
    </footer>

    <!-- 简单的录音动画遮罩 -->
    <div class="recording-overlay" v-if="isRecording">
      <div class="wave-box">
        <div class="bar" v-for="n in 5" :key="n"></div>
      </div>
      <p>正在录音...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// props 接收参数
const props = defineProps({
  mode: { type: String, default: 'english' }, // 'english' or 'pinyin'
  char: { type: String, default: 'Aa' },      // 展示的字符
  title: { type: String, default: '字母练习' } // 标题
});

// 1. 字体控制
const fontClass = computed(() => props.mode === 'english' ? 'font-en' : 'font-pinyin');

// 2. 画布逻辑
const canvasRef = ref(null);
const isDrawing = ref(false);
let ctx = null;

onMounted(() => {
  initCanvas();
});

const initCanvas = () => {
  const canvas = canvasRef.value;
  const parent = canvas.parentElement;
  // 设置画布尺寸为父容器的实际像素大小 (适配Retina屏)
  const dpr = window.devicePixelRatio || 1;
  const rect = parent.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#2c3e50'; // 笔迹颜色
  ctx.lineWidth = 6;           // 笔迹粗细
};

const getPos = (e) => {
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  let x, y;
  if (e.touches) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
  return { x, y };
};

const startDrawing = (e) => {
  isDrawing.value = true;
  const { x, y } = getPos(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const draw = (e) => {
  if (!isDrawing.value) return;
  const { x, y } = getPos(e);
  ctx.lineTo(x, y);
  ctx.stroke();
};

const stopDrawing = () => {
  isDrawing.value = false;
};

const clearCanvas = () => {
  const canvas = canvasRef.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 注意：这里是用scale后的坐标清除还是像素清除需测试，通常 clearRect 用像素
  // 简单暴力重置：
  canvas.width = canvas.width; 
  initCanvas(); // 重新初始化状态
};


// 3. 录音逻辑 (使用 MediaRecorder)
const isRecording = ref(false);
const audioUrl = ref(null);
let mediaRecorder = null;
let audioChunks = [];

const startRecording = async () => {
  // 震动反馈
  if (navigator.vibrate) navigator.vibrate(50);
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioUrl.value = URL.createObjectURL(audioBlob);
      audioChunks = [];
    };

    mediaRecorder.start();
    isRecording.value = true;
  } catch (err) {
    alert('无法访问麦克风，请检查手机权限设置哦 🎤');
    console.error(err);
  }
};

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop();
    isRecording.value = false;
  }
};

const playUserAudio = () => {
  if (audioUrl.value) {
    const audio = new Audio(audioUrl.value);
    audio.play();
  }
};

// 4. 标准音播放 (模拟)
const isPlayingStandard = ref(false);
const playStandardAudio = () => {
  isPlayingStandard.value = true;
  // 这里应该播放真实的 MP3，此处用 SpeechSynthesis 模拟
  const u = new SpeechSynthesisUtterance(props.char);
  if (props.mode === 'english') u.lang = 'en-US';
  else u.lang = 'zh-CN';
  u.rate = 0.8; // 读慢一点
  
  u.onend = () => { isPlayingStandard.value = false; };
  window.speechSynthesis.speak(u);
};
</script>

<style scoped >
/* 字体设置 */
/* 英语可以使用 Google Fonts 的 'Patrick Hand' 或 'Didact Gothic' 模拟手写 */
@import url('https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap');

.practice-page {
  height: 100vh;
  width: 100vw;
  background: #FFFDF5; /* 米黄色护眼纸张色 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Rounded Mplus 1c', sans-serif;
}

/* 顶部 */
.nav-bar {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .icon-btn {
    background: #FFF;
    border: 2px solid #EEE;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }

  .title-pill {
    background: #FFECB3;
    padding: 8px 20px;
    border-radius: 20px;
    color: #FF6F00;
    font-weight: bold;
  }
}

/* 作业本区域 */
.notebook-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;

  .paper-sheet {
    width: 100%;
    max-width: 350px;
    aspect-ratio: 1.2; /* 宽高比 */
    background: #FFF;
    border: 1px solid #E0E0E0;
    box-shadow: 5px 5px 0 rgba(0,0,0,0.05);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }
}

/* 核心：四线三格系统 */
.grid-lines {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  pointer-events: none; /* 让点击穿透到画布 */
  
  /* 定义高度比例 */
  line-height: 25%; 

  .line {
    width: 100%;
    border-bottom: 1px solid;
    height: 60px; /* 格子高度 */
  }

  /* 颜色规范：上红下红，中间蓝 */
  .top-line {
    border-color: #FF8A80; /* 红线 */
    border-bottom-style: solid;
  }
  .mid-line {
    border-color: #80D8FF; /* 蓝线 */
    border-bottom-style: dashed; /* 很多作业本中间是虚线 */
  }
  .base-line {
    border-color: #80D8FF; /* 蓝线 */
    border-bottom-style: solid;
  }
  .bottom-line {
    border-color: #FF8A80; /* 红线 */
    border-bottom-style: solid;
    height: 0; /* 最后一条线不需要高度 */
  }
}

/* 范例文字 (临摹层) */
.guide-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 这里的 -50% 根据不同字体可能需要微调 */
  font-size: 150px;
  color: #E0E0E0; /* 浅灰色供临摹 */
  z-index: 1;
  pointer-events: none;
  white-space: nowrap;
  line-height: 1; /* 重要 */
  
  &.font-en {
    font-family: 'Didact Gothic', sans-serif;
    transform: translate(-50%, -58%); /* 英文在四线格位置微调 */
  }
  
  &.font-pinyin {
    /* 拼音可以用系统自带字体，或者引入汉语拼音字体 */
    font-family: sans-serif; 
    transform: translate(-50%, -60%);
    letter-spacing: 5px;
  }
}

/* 画布层 */
.write-canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  /* cursor: crosshair; */
}

.canvas-tools {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;

  .clear-btn {
    background: #FFEBEE;
    color: #D32F2F;
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: bold;
  }
  .hint {
    color: #90A4AE;
    font-size: 12px;
  }
}

/* 底部音频面板 */
.audio-panel {
  background: #FFF;
  padding: 20px 30px 40px; /* 底部留白给 Home Indicator */
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
  display: flex;
  align-items: flex-end; /* 底部对齐 */
  justify-content: space-between;

  .audio-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 60px;

    .label {
      font-size: 12px;
      color: #78909C;
    }
  }

  .circle-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: #F5F5F5;
    font-size: 24px;
    box-shadow: 0 4px 0 #E0E0E0;
    transition: all 0.1s;

    &:active { transform: translateY(4px); box-shadow: none; }
    &:disabled { opacity: 0.5; }
    
    &.playing {
      background: #E1F5FE;
      color: #03A9F4;
      animation: pulse 1s infinite;
    }
  }

  /* 麦克风主按钮 */
  .mic-btn {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(145deg, #FFD54F, #FFCA28);
    box-shadow: 0 8px 20px rgba(255, 193, 7, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    transition: transform 0.1s;
    
    &:active { transform: scale(0.95); }
    
    &.recording {
      background: #FF5252;
      box-shadow: 0 0 0 10px rgba(255, 82, 82, 0.3);
      transform: scale(1.1);
      
      .mic-icon { animation: shake 0.5s infinite; }
    }
  }
  
  .main-col {
    width: auto; /* 中间列自适应 */
    margin-bottom: 5px;
  }
}

/* 录音遮罩 */
.recording-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.6);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #FFF;
  
  .wave-box {
    display: flex;
    gap: 5px;
    height: 50px;
    align-items: center;
    margin-bottom: 20px;
    
    .bar {
      width: 8px;
      background: #FFD54F;
      animation: wave 0.5s infinite ease-in-out;
      border-radius: 4px;
      
      &:nth-child(1) { height: 20px; animation-delay: 0.0s; }
      &:nth-child(2) { height: 40px; animation-delay: 0.1s; }
      &:nth-child(3) { height: 50px; animation-delay: 0.2s; }
      &:nth-child(4) { height: 35px; animation-delay: 0.3s; }
      &:nth-child(5) { height: 20px; animation-delay: 0.4s; }
    }
  }
}

/* 动画定义 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes wave {
  0%, 100% { height: 20px; }
  50% { height: 50px; }
}

@keyframes shake {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
}
</style>