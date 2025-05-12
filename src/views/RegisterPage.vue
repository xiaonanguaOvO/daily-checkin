<template>
  <div class="register-container">
    <h1 class="title">注册</h1>
    <form @submit.prevent="register" class="register-form">
      <div class="input-group">
        <label for="phone" class="label">手机号</label>
        <input type="text" v-model="phone" id="phone" required class="input-field" />
      </div>
      <div class="input-group">
        <label for="password" class="label">密码</label>
        <input type="password" v-model="password" id="password" required class="input-field" />
      </div>
      <button type="submit" class="submit-btn">注册</button>
    </form>
    <router-link to="/login" class="login-link">已有账户? 登录</router-link>
  </div>
</template>

<script>
import axios from 'axios'; // 导入 axios

export default {
  name: 'RegisterPage',
  data() {
    return {
      phone: '',
      password: '',
    };
  },
  methods: {
    async register() {
      if (!this.phone || !this.password) {
        alert('手机号和密码不能为空');
        return;
      }

      try {
        // 发送注册请求
        const response = await axios.post('http://localhost:3000/api/register', {
          phone: this.phone,
          password: this.password
        });

        if (response.data.message === '注册成功') {
          alert('注册成功');
          this.$router.push('/login'); // 跳转到登录页面
        } else {
          alert(response.data.message); // 如果返回message就显示
        }
      } catch (error) {
        console.error('注册失败:', error);
        alert('注册失败，请稍后再试');
      }
    },
  },
};
</script>

<style scoped>
.register-container {
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

.register-form {
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

.login-link {
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #3498db;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
