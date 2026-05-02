# 构建上下文为仓库根目录：docker compose build / docker build -f backend/Dockerfile .
FROM python:3.11-slim

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

# 国内构建时访问 deb.debian.org 常失败（apt exit 100），改用阿里云 Debian 源
# 海外构建可：docker compose build --build-arg USE_CN_MIRROR=0
ARG USE_CN_MIRROR=1
# .doc → .docx 转换依赖 LibreOffice（镜像较大，属正常）
RUN set -eux; \
    if [ "$USE_CN_MIRROR" = "1" ]; then \
      if [ -f /etc/apt/sources.list.d/debian.sources ]; then \
        sed -i \
          -e 's|http://deb.debian.org/debian|http://mirrors.aliyun.com/debian|g' \
          -e 's|https://deb.debian.org/debian|http://mirrors.aliyun.com/debian|g' \
          -e 's|http://security.debian.org/debian-security|http://mirrors.aliyun.com/debian-security|g' \
          -e 's|https://security.debian.org/debian-security|http://mirrors.aliyun.com/debian-security|g' \
          /etc/apt/sources.list.d/debian.sources; \
      fi; \
      if [ -f /etc/apt/sources.list ]; then \
        sed -i 's|deb.debian.org|mirrors.aliyun.com|g; s|security.debian.org/debian-security|mirrors.aliyun.com/debian-security|g' /etc/apt/sources.list; \
      fi; \
    fi; \
    apt-get update; \
    apt-get install -y --no-install-recommends -o Acquire::Retries=5 libreoffice; \
    rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    -i https://mirrors.aliyun.com/pypi/simple/

COPY backend/app ./app

ENV PYTHONUNBUFFERED=1
ENV SOFFICE_PATH=/usr/bin/soffice

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
