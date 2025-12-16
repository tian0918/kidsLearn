<template>
  <Teleport to="body">
    <Transition name="bounce">
      <div v-if="modelValue" class="cartoon-overlay" @click.self="handleOverlayClick">
        
        <!-- 对话框主体 -->
        <div class="cartoon-modal" :class="themeClass">
          
          <!-- 顶部装饰 (比如一个云朵或者是星星) -->
          <div class="decoration-top"></div>

          <!-- 标题栏 -->
          <header class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="btn-close" @click="close">
              ✖
            </button>
          </header>

          <!-- 内容区域 -->
          <div class="modal-body">
            <slot>
              <p>这里是默认内容，小朋友你好呀！🎈</p>
            </slot>
          </div>

          <!-- 底部按钮 -->
          <footer class="modal-footer">
            <button class="btn btn-cancel" @click="close">
              {{ cancelText }}
            </button>
            <button class="btn btn-confirm" @click="confirm">
              {{ confirmText }}
            </button>
          </footer>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

// 定义 Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示 ✨'
  },
  confirmText: {
    type: String,
    default: '好的!'
  },
  cancelText: {
    type: String,
    default: '不要'
  },
  // 主题色: 'blue', 'pink', 'yellow'
  theme: {
    type: String,
    default: 'blue'
  },
  // 是否允许点击遮罩层关闭
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
});

// 定义 Emits
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

// 计算主题类名
const themeClass = computed(() => `theme-${props.theme}`);

// 关闭方法
const close = () => {
  emit('cancel');
  emit('update:modelValue', false);
};

// 确认方法
const confirm = () => {
  emit('confirm');
  // 如果需要在确认后自动关闭，可以在这里加上 emit('update:modelValue', false)
  // 或者由父组件控制
};

// 点击遮罩层
const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close();
  }
};
</script>

<style scoped>
/* 引入可爱的圆体字 */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap');

/* CSS 变量 - 方便换肤 */
.cartoon-overlay {
  --primary-color: #4facfe;
  --accent-color: #00f2fe;
  --bg-color: #ffffff;
  --text-color: #4a4a4a;
  --border-color: #333333;
  --border-width: 4px;
  --shadow-offset: 6px;
  
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6); /* 半透明遮罩 */
  backdrop-filter: blur(5px); /* 背景模糊 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Fredoka', 'Varela Round', 'Nunito', sans-serif;
}

/* 主题颜色定义 */
.theme-pink { --primary-color: #ff9a9e; --accent-color: #fecfef; }
.theme-yellow { --primary-color: #fddb92; --accent-color: #d1fdff; }
.theme-blue { --primary-color: #4facfe; --accent-color: #00f2fe; }

.cartoon-modal {
  width: 90%;
  max-width: 400px;
  background: var(--bg-color);
  border: var(--border-width) solid var(--border-color);
  border-radius: 24px;
  /* 硬阴影，打造贴纸/卡片感 */
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0px rgba(0,0,0,0.2);
  position: relative;
  overflow: visible;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* 顶部装饰 - 一个纯CSS画的斑点背景条 */
.modal-header {
  background: var(--primary-color);
  background-image: radial-gradient(circle, rgba(255,255,255,0.4) 20%, transparent 20%);
  background-size: 20px 20px; /* 波点图案 */
  padding: 16px 20px;
  border-bottom: var(--border-width) solid var(--border-color);
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  color: white;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.2);
  font-size: 1.5rem;
  letter-spacing: 1px;
}

/* 那个红色的关闭按钮 */
.btn-close {
  background: #ff5f5f;
  border: var(--border-width) solid var(--border-color);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
  box-shadow: 2px 2px 0px rgba(0,0,0,0.2);
}

.btn-close:active {
  transform: scale(0.9);
  box-shadow: 1px 1px 0px rgba(0,0,0,0.2);
}

.modal-body {
  padding: 24px;
  color: var(--text-color);
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
}

.modal-footer {
  padding: 0 20px 24px 20px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 通用按钮样式 */
.btn {
  padding: 10px 24px;
  border: var(--border-width) solid var(--border-color);
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.1s;
  position: relative;
  top: 0;
}

/* 按钮点击效果 - 向下压 */
.btn:active {
  top: 4px;
  box-shadow: 0px 0px 0px rgba(0,0,0,0.2);
}

.btn-confirm {
  background-color: #51cf66;
  color: white;
  box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
}

.btn-cancel {
  background-color: #f1f3f5;
  color: var(--text-color);
  box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
}

/* 顶部装饰 - 这里用 CSS 画一个“溢出”的可爱边框 */
.cartoon-modal::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 20px;
  width: 40px;
  height: 15px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  z-index: 2;
}

/* Vue Transition 动画: 弹跳效果 */
.bounce-enter-active {
  animation: bounce-in 0.4s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.15); /* 放大一点点，制造Q弹感 */
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>