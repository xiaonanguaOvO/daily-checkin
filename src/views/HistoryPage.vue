<template>
  <div class="history-container">
    <AppNavbar />
    <h1 class="title">打卡历史</h1>
    <ul v-if="history.length > 0" class="history-list">
      <li v-for="(item, index) in history" :key="index" class="history-item">
        <div class="history-content">
          <span class="content-label">今日分享：</span>
          <div v-if="item.isEditing" class="edit-form">
            <input v-model="item.content" class="edit-input" />
            <button class="button save" @click="saveEdit(item)">保存</button>
            <button class="button cancel" @click="cancelEdit(item)">取消</button>
          </div>
          <div v-else class="content-display">
            {{ item.content }}
            <button class="button edit" @click="editItem(item)">编辑</button>
          </div>
        </div>
        <div class="history-date">
          <strong>{{ item.date }}</strong>: {{ item.content }}
        </div>
      </li>
    </ul>
    <p v-else class="no-history">没有打卡记录。</p>
  </div>
</template>


<script>
import AppNavbar from '@/components/AppNavbar.vue';
export default {
  name: 'HistoryPage',
  data() {
    return {
      history: [],
      today: new Date().toISOString().split('T')[0],
    };
  },
  mounted() {
    this.fetchCheckInHistory();
  },
  methods: {
    // 获取打卡历史
    async fetchCheckInHistory() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('未登录或token失效');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/checkin/history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('获取打卡历史失败:', errorData.message);
          return;
        }

        const data = await response.json();
        console.log('从后端获取的打卡历史数据:', data);

        this.history = data.data.map(item => {
          const formattedDate = new Date(item.checkin_date).toISOString().split('T')[0];
          return {
            id: item.id,
            date: formattedDate,
            content: item.content,
            isEditing: false,  // <=== 新增字段：是否正在编辑
          };
        });

        console.log('格式化后的打卡历史:', this.history);

      } catch (error) {
        console.error('请求失败:', error);
      }
    },

    // 点编辑
    editItem(item) {
      item.isEditing = true;
    },

    // 取消编辑
    cancelEdit(item) {
      item.isEditing = false;
      this.fetchCheckInHistory();  // 重新拉一次数据，恢复原值
    },

    // 保存编辑
    async saveEdit(item) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('未登录或token失效');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/checkin/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: item.id,
            content: item.content,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('更新打卡内容失败:', errorData.message);
          alert('更新失败');
          return;
        }

        const data = await response.json();
        console.log('打卡内容更新成功:', data);
        alert('打卡内容更新成功');

        item.isEditing = false;  // 退出编辑模式

      } catch (error) {
        console.error('请求失败:', error);
        alert('更新失败，请重试');
      }
    },
  },
  components: {
    AppNavbar,
  },
};
</script>

<style scoped>
.history-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.8rem;
  font-weight: bold;
}

.history-list {
  list-style: none;
  padding: 0;
}

.history-item {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.history-content {
  margin-bottom: 10px;
}

.content-label {
  display: inline-block;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  margin-bottom: 5px;
}

/* 编辑和显示内容的区域 */
.edit-form,
.content-display {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.edit-input {
  padding: 8px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 220px;
}

/* 日期单独一块 */
.history-date {
  font-size: 0.95rem;
  color: #777;
  padding-top: 5px;
  border-top: 1px solid #eee;
  margin-top: 10px;
}

/* 按钮样式 */
.button {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.save {
  background-color: #4caf50;
  color: white;
}

.cancel {
  background-color: #f44336;
  color: white;
}

.edit {
  background-color: #2196f3;
  color: white;
}

.button:hover {
  opacity: 0.85;
}

.no-history {
  text-align: center;
  color: #999;
  font-size: 1rem;
  margin-top: 20px;
}
</style>