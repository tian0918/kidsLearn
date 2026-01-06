<!-- <script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import Button from '@/components/ui/Button.vue';
const email = ref('');
const password = ref('');



</script>

<template>
  <input v-model="email" placeholder="邮箱" />
  <input v-model="password" placeholder="密码" type="password" />
  <button @click="login">登录/注册</button>
  <Button varint-key="primary">Let's Go</Button>
</template> -->
<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-circle circle-1"></div>
    <div class="bg-circle circle-2"></div>

    <!-- 顶部吉祥物 -->
    <div class="mascot-area">
      <div class="mascot-placeholder">
        🐼
      </div>
      <h1 class="app-title">快乐学习屋</h1>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <h2 class="welcome-text">欢迎回来! 👋</h2>

      <form @submit.prevent="handleLogin">
        <!-- 邮箱输入 (修改处) -->
        <div class="input-group">
          <span class="icon">📧</span>
          <input 
            type="email" 
            v-model="form.email" 
            placeholder="小朋友的邮箱"
            class="kids-input"
            required
          />
        </div>

        <!-- 密码输入 -->
        <div class="input-group">
          <span class="icon">🔐</span>
          <input 
            type="password" 
            v-model="form.password" 
            placeholder="秘密口令"
            class="kids-input"
          />
        </div>

        <!-- 登录按钮 -->
        <button 
          type="submit" 
          class="login-btn" 
          :class="{ 'btn-loading': isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">登录 GO! 🚀</span>
          <span v-else>检查中... ⏳</span>
        </button>
      </form>

      <!-- 底部辅助链接 -->
      <div class="footer-links">
        <a href="#" class="link">忘记口令?</a>
        <a href="#" class="link parent-mode">注册新账号 ✨</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// 定义表单数据
const form = reactive({
  email: '',
  password: ''
});

// 加载状态
const isLoading = ref(false);


const handleLogin = () => {
  // 1. 基础非空校验
  if (!form.email || !form.password) {
    alert('哎呀，邮箱和口令都要填哦！🐣');
    return;
  }

  // 2. 简单的邮箱格式校验 (修改处)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email)) {
    alert('邮箱格式好像不太对，检查一下吧 🤔');
    return;
  }

  isLoading.value = true;
  login()

};
const currentUser = ref(null);
const router = useRouter();
const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth,  form.email, form.password);
    currentUser.value = userCredential.user;
    router.replace('/home')
  } catch (err) {
    console.error(err);
    // alert('登录失败，尝试注册新用户');
    await register();
  }
};
const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
    currentUser.value = userCredential.user;
    router.replace('/home')
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped >
/* 变量定义：鲜艳、活泼的配色 */


.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: var(--primary-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Varela Round', 'Rounded Mplus 1c', sans-serif; /* 建议引入圆体字 */
}

/* 背景装饰圆圈 */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  z-index: 0;
}
.circle-1 { width: 300px; height: 300px; top: -50px; left: -50px; }
.circle-2 { width: 200px; height: 200px; bottom: 50px; right: -50px; }

/* 吉祥物区域 */
.mascot-area {
  z-index: 1;
  text-align: center;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite; /* 悬浮动画 */

  .mascot-placeholder {
    font-size: 80px;
    background: #fff;
    width: 120px;
    height: 120px;
    line-height: 120px;
    border-radius: 50%;
    margin: 0 auto 10px;
    box-shadow: 0 8px 0 rgba(0,0,0,0.1);
  }

  .app-title {
    color: #fff;
    font-size: 28px;
    text-shadow: 2px 2px 0px rgba(0,0,0,0.2);
    margin: 0;
  }
}

/* 登录卡片 */
.login-card {
  z-index: 1;
  background: var(--card-bg);
  width: 85%;
  max-width: 360px;
  padding: 30px 20px;
  border-radius: 30px; /* 大圆角 */
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  text-align: center;
}

.welcome-text {
  color: var(--bg-color);
  margin-bottom: 25px;
  font-size: 22px;
}

/* 输入框组 */
.input-group {
  position: relative;
  margin-bottom: 20px;

  .icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    z-index: 2;
  }

  .kids-input {
    width: 100%;
    padding: 15px 15px 15px 50px; /* 留出图标位置 */
    border: 3px solid #E0E0E0;
    border-radius: 50px; /* 胶囊形状 */
    font-size: 16px;
    outline: none;
    transition: all 0.3s;
    background: #F9F9F9;
    box-sizing: border-box;

    &:focus {
      border-color: var(--primary-color);
      background: #FFF;
      box-shadow: 0 0 0 4px rgba(255, 217, 61, 0.3);
    }

    &::placeholder {
      color: #BBB;
    }
  }
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 50px;
  background-color: var(--primary-color);
  color: #5D4037; /* 深褐色文字对比度好 */
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 6px 0 #E6C200; /* 3D按压效果 */
  transition: all 0.1s;
  margin-top: 10px;

  &:active {
    transform: translateY(6px); /* 按下时下移 */
    box-shadow: 0 0 0 #E6C200;
  }

  &:disabled {
    background-color: #CCC;
    box-shadow: none;
    transform: none;
    cursor: not-allowed;
  }
}

/* 底部链接 */
.footer-links {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;

  .link {
    color: #999;
    text-decoration: none;
    
    &.parent-mode {
      color:var(--accent-color);
      font-weight: bold;
    }
  }
}

/* 简单的浮动动画 */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
</style>