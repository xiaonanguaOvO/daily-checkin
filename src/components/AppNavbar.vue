<template>
  <nav class="navbar">
    <ul class="nav-list">
      <li class="nav-item"><router-link to="/check" class="nav-link">首页</router-link></li>
      <li class="nav-item"><router-link to="/history" class="nav-link">打卡历史</router-link></li>
      <li v-if="!isLoggedIn" class="nav-item"><router-link to="/login" class="nav-link">登录</router-link></li>
      <li v-if="!isLoggedIn" class="nav-item"><router-link to="/register" class="nav-link">注册</router-link></li>
      <li v-if="isLoggedIn" class="nav-item logout" @click="logout">登出</li>
    </ul>
  </nav>
</template>


<script>
export default {
  data() {
    return {
      isLoggedIn: false,  // 根据实际情况判断用户是否登录
    };
  },
  methods: {
    logout() {
      // 处理登出逻辑
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
    }
  }
};
</script>

<style scoped>
.navbar {
  background-color: #42b983;
  padding: 10px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.nav-list {
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-item {
  font-size: 16px;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout {
  cursor: pointer;
  color: white;
  font-weight: 500;
}

.logout:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 8px 15px;
}
</style>
