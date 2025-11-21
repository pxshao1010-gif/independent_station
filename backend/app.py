from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 模拟数据存储（实际项目中应使用数据库）
tasks = [
    {"id": 1, "title": "学习 React", "completed": False, "created_at": "2024-01-01T10:00:00"},
    {"id": 2, "title": "学习 Flask", "completed": True, "created_at": "2024-01-02T10:00:00"},
]

# 获取所有任务
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

# 获取单个任务
@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    if task:
        return jsonify(task)
    return jsonify({"error": "任务未找到"}), 404

# 创建新任务
@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json
    new_id = max([t['id'] for t in tasks], default=0) + 1
    new_task = {
        "id": new_id,
        "title": data.get('title', ''),
        "completed": False,
        "created_at": datetime.now().isoformat()
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

# 更新任务
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({"error": "任务未找到"}), 404
    
    data = request.json
    task['title'] = data.get('title', task['title'])
    task['completed'] = data.get('completed', task['completed'])
    return jsonify(task)

# 删除任务
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({"error": "任务未找到"}), 404
    
    tasks = [t for t in tasks if t['id'] != task_id]
    return jsonify({"message": "任务已删除"}), 200

# 健康检查
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "后端服务运行正常"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
