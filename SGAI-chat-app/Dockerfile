# 使用官方轻量级 Python 镜像
FROM python:3.10-slim

# 设置工作目录
WORKDIR /app

# 拷贝项目文件
COPY . /app

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 暴露端口（比如 uvicorn 默认端口）
EXPOSE 9994

# 启动命令（FastAPI + uvicorn）
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "9994"]
