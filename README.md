# React + Python 全栈网站

这是一个使用 React 作为前端、Python (Flask) 作为后端的全栈网站项目。

## 项目结构

```
website/
├── backend/          # Python Flask 后端
│   ├── app.py       # 主应用文件
│   └── requirements.txt
├── frontend/        # React 前端
│   ├── public/
│   ├── src/
│   └── package.json
└── README.md
```

## 功能特性

- ✅ 任务管理（增删改查）
- ✅ RESTful API
- ✅ 跨域支持 (CORS)
- ✅ 现代化的 UI 设计
- ✅ 响应式布局

## 快速开始

### 后端设置

1. 进入后端目录：
```bash
cd backend
```

2. 创建虚拟环境（推荐）：
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. 安装依赖：
```bash
pip install -r requirements.txt
```

4. 运行后端服务器：
```bash
python app.py
```

后端将在 `http://localhost:5000` 运行

### 前端设置

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
```

前端将在 `http://localhost:3000` 运行

## API 端点

- `GET /api/tasks` - 获取所有任务
- `GET /api/tasks/<id>` - 获取单个任务
- `POST /api/tasks` - 创建新任务
- `PUT /api/tasks/<id>` - 更新任务
- `DELETE /api/tasks/<id>` - 删除任务
- `GET /api/health` - 健康检查

## 技术栈

### 后端
- Python 3.x
- Flask
- Flask-CORS

### 前端
- React 18
- Axios
- CSS3

## 开发说明

- 确保后端和前端都在运行
- 前端通过代理访问后端 API（配置在 package.json 中）
- 后端支持 CORS，允许跨域请求

## 许可证

MIT
