import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';  // 引入视图组件
import HistoryPage from '../views/HistoryPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import AccountPage from '@/views/AccountPage.vue';
import CheckInPage from '@/views/CheckInPage.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountPage
  },
  {
    path: '/check',
    name: 'Check',
    component: CheckInPage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
