<template>
  <div class="welcome-container">
    <h1 class="title">欢迎来到每日打卡</h1>
    <p class="description">记录你的每日打卡内容，养成好习惯！</p>
    <div class="link-container">
      <router-link to="/login" class="button login">登录</router-link>
      <router-link to="/register" class="button register">注册</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f7f7f7;
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
}

.description {
  font-size: 18px;
  color: #555;
  margin-bottom: 30px;
}

.link-container {
  display: flex;
  gap: 20px;
}

.button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button.login {
  background-color: #42b983;
}

.button.login:hover {
  background-color: #358a62;
}

.button.register {
  background-color: #3498db;
}

.button.register:hover {
  background-color: #2980b9;
}
</style>
