import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      redirect:'home'
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
      path: '/english',
      name: 'english',
      component:() => import('../views/English.vue')
    },
    {
      path: '/chinese',
      name: 'chinese',
      component: () => import('../views/Chinese.vue'),
      
    },
    {
      path: '/guwen/:type',
      name: 'guwen',
      component: () => import('../views/guwen.vue'),
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
      path: '/words',
      name: 'words',
      component: () => import('../views/Words.vue')
    },
    {
      path: '/worditem/:type',
      name: 'wordItem',
      component: () => import("../views/WordItem.vue")
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
    },
    {
      path: '/mathHistory',
      name: 'mathHistory',
      component: () => import('../views/MaxthHistory.vue')
    },
    {
      path: '/demo',
      name: 'demoview',
      component: () => import("../views/demo.vue")
    }
  ],
  
});

export default router;

