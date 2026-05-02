#!/usr/bin/env bash
# 在 ECS（Ubuntu 22.04）上以 root 执行：先启动实例、安全组放行 22/80/443，再：
#   curl -fsSL https://raw.githubusercontent.com/zhengli12305/happfri/main/deploy/bootstrap-ubuntu22-ecs.sh | bash
# 若 GitHub 拉取困难，可把本仓库打包上传后在该目录执行：sudo bash deploy/bootstrap-ubuntu22-ecs.sh
set -euo pipefail

INSTALL_ROOT="${INSTALL_ROOT:-/opt/happyfri}"
REPO_URL="${REPO_URL:-https://github.com/zhengli12305/happfri.git}"
REPO_BRANCH="${REPO_BRANCH:-main}"
# 国内 ECS 访问 npm 官方源很慢，可改环境变量覆盖
NPM_CONFIG_REGISTRY="${NPM_CONFIG_REGISTRY:-https://registry.npmmirror.com}"
PIP_INDEX_URL="${PIP_INDEX_URL:-https://mirrors.aliyun.com/pypi/simple/}"

if [[ "${EUID:-}" -ne 0 ]]; then
  echo "请使用 root 运行：sudo bash $0"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nginx python3 python3-venv python3-pip git curl ca-certificates

NODE_MAJOR="$(node -p "process.versions.major" 2>/dev/null || echo 0)"
if ! command -v node >/dev/null 2>&1 || [[ "$NODE_MAJOR" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

if [[ ! -d "$INSTALL_ROOT/.git" ]]; then
  rm -rf "$INSTALL_ROOT"
  git clone --depth 1 --branch "$REPO_BRANCH" "$REPO_URL" "$INSTALL_ROOT"
else
  git -C "$INSTALL_ROOT" fetch origin "$REPO_BRANCH"
  git -C "$INSTALL_ROOT" reset --hard "origin/$REPO_BRANCH"
fi

cd "$INSTALL_ROOT/backend"
if [[ ! -d venv ]]; then
  python3 -m venv venv
fi
./venv/bin/pip install --upgrade pip -i "$PIP_INDEX_URL"
./venv/bin/pip install -r requirements.txt -i "$PIP_INDEX_URL"

cd "$INSTALL_ROOT"
if [[ ! -f .env.production ]]; then
  cp .env.production.example .env.production
fi
# electron 默认从 GitHub 拉二进制，国内极慢
export ELECTRON_MIRROR="${ELECTRON_MIRROR:-https://npmmirror.com/mirrors/electron/}"
npm ci --registry="$NPM_CONFIG_REGISTRY"
npm run build

install -m0644 "$INSTALL_ROOT/deploy/nginx-happyfri.conf" /etc/nginx/sites-available/happyfri
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/happyfri /etc/nginx/sites-enabled/happyfri
nginx -t
systemctl reload nginx
systemctl enable nginx

install -m0644 "$INSTALL_ROOT/deploy/happyfri-backend.service" /etc/systemd/system/happyfri-backend.service
systemctl daemon-reload
systemctl enable happyfri-backend
systemctl restart happyfri-backend

# 仅 dist 与 venv 属 www-data，避免 git pull 后无法覆盖业务代码
chown -R www-data:www-data "$INSTALL_ROOT/dist" "$INSTALL_ROOT/backend/venv"
chmod -R o+rX "$INSTALL_ROOT/backend/app" 2>/dev/null || true

echo "部署完成。浏览器访问: http://$(curl -fsS --connect-timeout 3 https://api.ipify.org 2>/dev/null || echo '本机公网IP')/"
echo "健康检查: curl -s http://127.0.0.1:8000/health"
