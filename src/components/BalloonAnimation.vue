<template>
  <div class="balloon-container">
    <!-- 气球 -->
    <div 
      v-for="(b, index) in balloons" 
      :key="b.id" 
      class="balloon" 
      :style="b.style">
    </div>

    <!-- 爆炸彩带 -->
    <div 
      v-for="(p, i) in particles" 
      :key="p.id" 
      class="particle" 
      :style="p.style">
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  streak: { type: Number, default: 0 },
  trigger: { type: Boolean, default: false }
});

const balloons = reactive([]);
const particles = reactive([]);
const baseColors = ['#ff4d4f', '#ffa940', '#40a9ff', '#73d13d', '#9254de', '#ff85c0', '#ffd666'];

watch(() => props.trigger, (newVal) => {
  if (newVal) triggerBalloons(props.streak);
});

function triggerBalloons(streak) {
  const count = Math.min(5 + Math.floor((streak - 10) / 2), 25);

  for (let i = 0; i < count; i++) {
    const id = Date.now() + Math.random();
    const left = Math.random() * 90;
    const color = baseColors[Math.floor(Math.random() * baseColors.length)];
    const size = 20 + Math.random() * 30;
    const duration = 3 + Math.random() * 2 + streak / 50;
    const rotation = Math.random() * 360;
    const sway = Math.random() * 40 - 20; // 左右偏移

    // 添加气球
    balloons.push({
      id,
      style: {
        left: left + '%',
        width: size + 'px',
        height: size * 1.3 + 'px',
        backgroundColor: color,
        animation: `floatUp ${duration}s ease-out forwards`,
        transform: `rotate(${rotation}deg) translateX(0px)`
      },
      duration,
      sway,
      color
    });

    // 气球到顶端爆炸成彩带
    setTimeout(() => {
      createParticles(left, color, streak);
      const index = balloons.findIndex(b => b.id === id);
      if (index !== -1) balloons.splice(index, 1);
    }, duration * 1000);
  }
}

function createParticles(left, color, streak) {
  const particleCount = 5 + Math.floor(streak / 5); // streak越高，颗粒越多
  for (let i = 0; i < particleCount; i++) {
    const id = Date.now() + Math.random();
    const angle = Math.random() * 360;
    const speed = 20 + Math.random() * 20;
    const size = 4 + Math.random() * 4;

    particles.push({
      id,
      style: {
        left: left + '%',
        width: size + 'px',
        height: size + 'px',
        backgroundColor: color,
        transform: `translate(${speed * Math.cos(angle)}px, ${-speed * Math.sin(angle)}px)`,
        animation: `particleMove 1s ease-out forwards`,
        borderRadius: '50%'
      }
    });

    setTimeout(() => {
      const index = particles.findIndex(p => p.id === id);
      if (index !== -1) particles.splice(index, 1);
    }, 1000);
  }
}
</script>

<style scoped>
.balloon-container {
  position: absolute;
  bottom: 0;
  top: 0;
  width: 100%;
  pointer-events: none;
  overflow: visible;
}

.balloon {
  position: absolute;
  bottom: 0;
  border-radius: 50% 50% 50% 50%;
}

@keyframes floatUp {
  0% { transform: translateY(0) translateX(0px) rotate(0deg); opacity: 1; }
  25% { transform: translateY(-100px) translateX(5px); }
  50% { transform: translateY(-200px) translateX(-5px); }
  75% { transform: translateY(-300px) translateX(5px); }
  100% { transform: translateY(-400px) rotate(360deg); opacity: 0; }
}

.particle {
  position: absolute;
  bottom: 0;
}

@keyframes particleMove {
  0% { transform: translate(0,0); opacity: 1; }
  100% { opacity: 0; }
}
</style>
