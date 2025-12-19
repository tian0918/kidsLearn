import { createRouter, createWebHistory } from 'vue-router';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: 'home',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path:'/subject',
      name:'subject',
      component:() => import('../views/SubjectSelect.vue')
    },
    {
      path:'/alphabet',
      name:'alphabet',
      component:() => import('../views/Alphabet.vue')
    },
    {
      path:'/pinyin',
      name:'pinyin',
      component:() => import('../views/PinyinPractice.vue')
    },
    {
      path:'/math',
      name:'math',
      component: () => import('../views/Math.vue')
    },
    {
      path: '/setting',
      name: 'setting',

      component: () => import('../views/Setting.vue'),
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('../views/RecordView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    }
  ],
});

export default router;
