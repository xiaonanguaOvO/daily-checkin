<template>
  <div class="check-in-container">
    <AppNavbar />
    <h2 class="title">今日打卡</h2>
    <div v-if="hasCheckedIn" class="check-in-status">
      <p class="check-in-text">今日已打卡：{{ checkInContent }}</p>
      <button class="button edit" @click="editCheckIn">编辑打卡内容</button>
    </div>
    <div v-else class="check-in-form">
      <textarea class="check-in-textarea" v-model="content" placeholder="输入今日打卡内容..."></textarea>
      <button class="button submit" @click="submitCheckIn">提交打卡</button>
    </div>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue';  // 引入 Navbar 组件
export default {
  data() {
    return {
      content: '',
      hasCheckedIn: false,
      checkInContent: ''
    };
  },
  components: {
    AppNavbar  // 注册组件
  },
  methods: {
    async fetchCheckIn() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://localhost:3000/api/checkin', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    if (data.code === 200 && data.data) {
      this.hasCheckedIn = true;
      this.checkInContent = data.data.content;
    } else {
      this.hasCheckedIn = false;
      this.checkInContent = '';
    }
  } catch (error) {
    console.error('获取今日打卡失败:', error);
    this.hasCheckedIn = false;
    this.checkInContent = '';
  }
    },
    async submitCheckIn() {
      if (!this.content) return alert('打卡内容不能为空');
      const response = await fetch('http://localhost:3000/api/checkin', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: this.content })
      });
      const data = await response.json();
      if (data.code === 200) {
        alert('打卡成功');
        this.hasCheckedIn = true;
        this.checkInContent = this.content;
      }
    },
    editCheckIn() {
      this.hasCheckedIn = false;
    }
  },
  mounted() {
    this.fetchCheckIn();
  }
};
</script>

<style scoped>
.check-in-container {
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.check-in-status {
  text-align: center;
}

.check-in-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.check-in-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.check-in-textarea {
  width: 100%;
  height: 150px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  outline: none;
  transition: border-color 0.3s ease;
}

.check-in-textarea:focus {
  border-color: #42b983;
}

.button {
  padding: 12px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.button.edit {
  background-color: #3498db;
}

.button.edit:hover {
  background-color: #2980b9;
}

.button.submit {
  background-color: #42b983;
}

.button.submit:hover {
  background-color: #358a62;
}
</style>
