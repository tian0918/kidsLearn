import { createRouter, createWebHistory } from 'vue-router';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/home',
      redirect: '/',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path:'/subject',
      name:'subject',
      component:() => import('../views/SubjectSelect.vue')
    },
    {
      path:'/learnEnglish/:mode',
      name:'learnEnglish',
      component:() => import('../views/EnglishPractice.vue')
    },
    {
      path:'/pinyin/:mode',
      name:'pinyin',
      component:() => import('../views/EnglishPractice.vue')
    },
    {
      path:'/math',
      name:'math',
      component: () => import('../views/Math.vue')
    },
    {
      path: '/setting',
      name: 'setting',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
