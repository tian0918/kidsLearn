<template>
  <div class="select-page">
    <!-- 背景装饰气泡 -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <!-- 顶部欢迎语 -->
    <header class="header" @click="showSidebar">
      <div class="avatar">🐼</div>
      <div class="greeting">
        <h2>嗨，小朋友！</h2>
        <p>今天想去哪里探险？</p>
      </div>
    </header>

    <!-- 科目列表 -->
    <main class="card-list">
      <div 
        v-for="(item, index) in subjects" 
        :key="item.id"
        class="subject-card"
        :class="`theme-${item.type}`"
        @click="selectSubject(item)"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <!-- 左侧图标/插画 -->
        <div class="card-icon-wrapper">
          <span class="emoji">{{ item.emoji }}</span>
        </div>

        <!-- 右侧文字内容 -->
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p class="font-ui">{{ item.desc }}</p>
        </div>

        <!-- 装饰性箭头 -->
        <div class="arrow-btn">GO</div>
      </div>
    </main>
    
  </div>
  <SiderBar v-model:show="isShowSidebar">
    
     <header class="header">
      <div class="avatar">🐼</div>
      <div class="greeting">
        <h2>嗨，小朋友！</h2>
      </div>
    </header>
  </SiderBar>
</template>

<script setup>
import router from '@/router';
import { ref } from 'vue';
import SiderBar from '@/components/SiderBar.vue';
const isShowSidebar = ref(false)
// 科目数据配置
const subjects = ref([
  { 
    id: 1, 
    type: 'chinese', 
    title: '中文真好听', 
    desc: '学习 a o e，说话真好听', 
    emoji: '🗣️',
    route: 'chinese' 
  },
  { 
    id: 2, 
    type: 'english', 
    title: '神奇字母', 
    desc: 'ABC 唱起来，单词记心间', 
    emoji: '🔠',
    route: 'english' 
  },
  { 
    id: 3, 
    type: 'math', 
    title: '趣味数学', 
    desc: '数字连连看，加减大挑战', 
    emoji: '🧮',
    route: 'math' 
  }
]);
const showSidebar = () => { 
  console.log("Hi!")
  isShowSidebar.value = true
};
const selectSubject = (item) => {
  // 简单的点击反馈震动
  if (navigator.vibrate) navigator.vibrate(50);
  console.log(item);
  
  router.push(`/${item.route}`)
};
</script>

<style scoped >
/* 字体引入建议 */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');

.select-page {
  width: 100vw;
  height: 100dvh;
  background-color: #F0F4F8;
  position: relative;
  overflow: hidden;
  font-family: 'Fredoka', 'Rounded Mplus 1c', sans-serif;
  display: flex;
  flex-direction: column;
}

/* 背景气泡动画 */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  z-index: 0;
  opacity: 0.6;
}
.blob-1 { top: -50px; left: -50px; width: 200px; height: 200px; background: #FFD166; }
.blob-2 { bottom: -50px; right: -50px; width: 250px; height: 250px; background: #06D6A0; }

/* 头部 */
.header {
  padding: 30px 25px 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 1;

  .avatar {
    width: 60px;
    height: 60px;
    background: #FFF;
    border-radius: 50%;
    font-size: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border: 3px solid #FFF;
  }

  .greeting {
    h2 {
      margin: 0;
      color: #2D3436;
      font-size: 24px;
    }
    p {
      margin: 5px 0 0;
      color: #636E72;
      font-size: 14px;
    }
  }
}

/* 卡片列表 */
.card-list {
  flex: 1;
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1;
  overflow-y: auto;
}

/* 科目卡片核心样式 */
.subject-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 25px;
  color: #FFF;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  animation: slideUp 0.6s backwards; /* 进场动画 */

  /* 点击缩放效果 */
  &:active {
    transform: scale(0.96);
  }

  /* 装饰背景纹理 (半透明圆圈) */
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
  }
}

/* 主题配色 (渐变色) */
.theme-chinese {
  background: linear-gradient(135deg, #FF9966 0%, #FF5E62 100%);
  box-shadow: 0 10px 20px rgba(255, 94, 98, 0.3);
}

.theme-english {
  background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%);
  box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
}

.theme-math {
  background: linear-gradient(135deg, #43E97B 0%, #38F9D7 100%);
  box-shadow: 0 10px 20px rgba(67, 233, 123, 0.3);
  
  /* 数学主题文字颜色深一点点可能更好看，或者保持白色统一 */
  h3, p { text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
}

/* 卡片内部布局 */
.card-icon-wrapper {
  background: rgba(255,255,255,0.25);
  width: 60px;
  height: 60px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  backdrop-filter: blur(5px);

  .emoji {
    font-size: 32px;
  }
}

.card-content {
  flex: 1;

  h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
    font-size: 13px;
    opacity: 0.9;
  }
}

.arrow-btn {
  background: #FFF;
  color: #333;
  font-size: 12px;
  font-weight: 800;
  padding: 8px 12px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* 进场动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>