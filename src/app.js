const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

// 创建 Express 应用
const app = express();
const port = 3000;

// 使用中间件
app.use(cors());
app.use(bodyParser.json());

// 连接 MySQL 数据库
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'checkin_app'
});

db.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err.stack);
    return;
  }
  console.log('数据库连接成功');
});

// 注册接口
app.post('/api/register', (req, res) => {
  const { phone, password } = req.body;
  console.log('收到注册请求:', { phone, password });

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('密码加密失败:', err);
      return res.status(500).json({ message: '密码加密失败' });
    }

    const query = 'INSERT INTO user (phone, password) VALUES (?, ?)';
    db.query(query, [phone, hashedPassword], (err, result) => {
      if (err) {
        console.error('注册时出错:', err);
        return res.status(500).json({ message: '注册失败' });
      }
      console.log('注册成功:', result);
      res.status(200).json({ message: '注册成功' });
    });
  });
});

// 登录接口
app.post('/api/login', (req, res) => {
  const { phone, password } = req.body;
  console.log('收到登录请求:', { phone, password });

  const query = 'SELECT * FROM user WHERE phone = ?';
  db.query(query, [phone], (err, results) => {
    if (err) {
      console.error('查询失败:', err);
      return res.status(500).json({ message: '查询失败' });
    }
    if (results.length === 0) {
      console.log('用户不存在:', phone);
      return res.status(400).json({ message: '用户不存在' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('密码验证失败:', err);
        return res.status(500).json({ message: '密码验证失败' });
      }
      if (!isMatch) {
        console.log('密码错误:', phone);
        return res.status(400).json({ message: '密码错误' });
      }

      // 生成 JWT token
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
      console.log('登录成功，生成 token:', token);
      res.status(200).json({ message: '登录成功', token });
    });
  });
});

// 打卡接口
app.post('/api/checkin', (req, res) => {
  const { content } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  console.log('收到打卡请求:', { content, token });

  if (!token) {
    console.log('未提供 token');
    return res.status(401).json({ message: '未登录或token失效' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      console.error('token验证失败:', err);
      return res.status(401).json({ message: 'token验证失败' });
    }

    const userId = decoded.userId;
    const checkinDate = new Date().toISOString().split('T')[0];  // 当前日期

    // 检查当天是否已经打卡
    const checkQuery = 'SELECT * FROM checkin_record WHERE user_id = ? AND checkin_date = ?';
    db.query(checkQuery, [userId, checkinDate], (err, results) => {
      if (err) {
        console.error('查询打卡记录失败:', err);
        return res.status(500).json({ message: '查询失败' });
      }
      if (results.length > 0) {
        console.log('今天已经打卡，无法重复打卡');
        return res.status(400).json({ message: '今天已打卡，无法重复打卡' });
      }

      // 提交打卡记录
      const insertQuery = 'INSERT INTO checkin_record (user_id, content, checkin_date) VALUES (?, ?, ?)';
      db.query(insertQuery, [userId, content, checkinDate], (err, result) => {
        if (err) {
          console.error('打卡失败:', err);
          return res.status(500).json({ message: '打卡失败' });
        }
        console.log('打卡成功:', result);
        res.status(200).json({ message: '打卡成功' });
      });
    });
  });
});

// 获取打卡历史接口
app.get('/api/checkin/history', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('收到查看历史打卡记录请求:', { token });

  if (!token) {
    console.log('未提供 token');
    return res.status(401).json({ message: '未登录或token失效' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      console.error('token验证失败:', err);
      return res.status(401).json({ message: 'token验证失败' });
    }

    const userId = decoded.userId;
    const query = 'SELECT * FROM checkin_record WHERE user_id = ? ORDER BY checkin_date DESC';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('查询打卡历史失败:', err);
        return res.status(500).json({ message: '查询失败' });
      }
      console.log('返回打卡历史记录:', results);
      res.status(200).json({ data: results });
    });
  });
});
// 更新打卡内容接口
app.post('/api/checkin/update', (req, res) => {
  const { content, id } = req.body;  // 确保获取 id 字段
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '未登录或token失效' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'token验证失败' });
    }

    const userId = decoded.userId;
    const updateQuery = 'UPDATE checkin_record SET content = ? WHERE id = ? AND user_id = ?';
    db.query(updateQuery, [content, id, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: '更新打卡内容失败' });
      }
      if (result.affectedRows === 0) {
        return res.status(400).json({ message: '找不到对应的打卡记录，无法更新' });
      }
      res.status(200).json({ message: '打卡内容更新成功' });
    });
  });
});

// 获取今日打卡接口
app.get('/api/checkin', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未登录或token失效' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'token验证失败' });
    }

    const userId = decoded.userId;
    const checkinDate = new Date().toISOString().split('T')[0];  // 当前日期

    // 查询当天的打卡记录
    const query = 'SELECT * FROM checkin_record WHERE user_id = ? AND checkin_date = ?';
    db.query(query, [userId, checkinDate], (err, results) => {
      if (err) {
        return res.status(500).json({ message: '查询打卡记录失败' });
      }
      if (results.length > 0) {
        return res.status(200).json({ data: results[0] });  // 返回当天打卡记录
      } else {
        return res.status(200).json({ data: null });  // 没有打卡记录
      }
    });
  });
});

// 服务器监听
app.listen(port, () => {
  console.log(`服务器正在运行在 http://localhost:${port}`);
});
