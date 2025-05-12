<template>
  <div class="profile-container">
    <AppNavbar />
    <h2 class="title">个人中心</h2>
    <p class="user-info">手机号: {{ userPhone }}</p>
    <div class="button-group">
      <button class="button" @click="changePassword">修改密码</button>
      <button class="button logout" @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue';

export default {
  data() {
    return {
      userPhone: ''
    };
  },
  methods: {
    changePassword() {
      this.$router.push('/change-password');
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/check');
    }
  },
  components: {
    AppNavbar
  },
  async created() {
    // 模拟获取用户信息
    const response = await fetch('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    if (data.code === 200) {
      this.userPhone = data.data.phone;
    }
  }
};
</script>

<style scoped>
.profile-container {
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.user-info {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  text-align: center;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.button {
  padding: 12px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.button:hover {
  background-color: #358a62;
}

.logout {
  background-color: #e74c3c;
}

.logout:hover {
  background-color: #c0392b;
}
</style>
