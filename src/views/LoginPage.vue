<template>
  <div class="login-container">
    <h1 class="title">登录</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="input-group">
        <label for="phone" class="label">手机号</label>
        <input type="text" v-model="phone" id="phone" required class="input-field" />
      </div>
      <div class="input-group">
        <label for="password" class="label">密码</label>
        <input type="password" v-model="password" id="password" required class="input-field" />
      </div>
      <button type="submit" class="submit-btn">登录</button>
    </form>
    <router-link to="/register" class="register-link">没有账户? 注册</router-link>
  </div>
</template>

<script>
import axios from 'axios';  // 导入 axios

export default {
  name: 'LoginPage',
  data() {
    return {
      phone: '',
      password: '',
    };
  },
  methods: {
    async login() {
      if (!this.phone || !this.password) {
        alert('手机号和密码不能为空');
        return;
      }

      axios.post('http://localhost:3000/api/login', {
        phone: this.phone,
        password: this.password
      })
      .then(response => {
        if (response.data.token) {
          alert('登录成功');
          localStorage.setItem('token', response.data.token); // 将 token 存储在 localStorage 中
          this.$router.push('/check'); // 跳转到首页
        } else {
          alert(response.data.message); // 如果返回 message 就提示用户
        }
      })
      .catch(error => {
        console.error('登录请求失败:', error);
        alert('登录失败，请检查输入');
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.title {
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.input-field {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.input-field:focus {
  outline: none;
  border-color: #3498db;
  background-color: #fff;
}

.submit-btn {
  padding: 12px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #358a62;
}

.register-link {
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #3498db;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
