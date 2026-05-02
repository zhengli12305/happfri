# 构建上下文为仓库根目录：docker compose build / docker build -f backend/Dockerfile .
FROM python:3.11-slim

WORKDIR /app

# .doc → .docx 转换依赖 LibreOffice（镜像较大，属正常）
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    -i https://mirrors.aliyun.com/pypi/simple/

COPY backend/app ./app

ENV PYTHONUNBUFFERED=1
ENV SOFFICE_PATH=/usr/bin/soffice

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
