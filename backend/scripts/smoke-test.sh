#!/usr/bin/env bash
# 在 ECS 上排查「问题在哪一层」。用法：
#   bash scripts/smoke-test.sh
#   bash scripts/smoke-test.sh http://127.0.0.1:8000          # 直连 Uvicorn
#   bash scripts/smoke-test.sh http://8.136.155.203           # 经 Nginx:80
set -euo pipefail

BASE="${1:-http://127.0.0.1:8000}"
BASE="${BASE%/}"

echo "========== 基址: $BASE =========="
code() { curl -sS -o /tmp/smoke_body.txt -w "%{http_code}" "$@" || echo "000"; }

echo
echo "1) GET /health"
HTTP=$(code "$BASE/health") || true
echo "   HTTP $HTTP"
head -c 300 /tmp/smoke_body.txt; echo

echo
echo "2) HEAD /api/parse-questions（易误判；接口只接受 POST，405 为正常）"
HTTP=$(curl -sS -o /dev/null -w "%{http_code}" -X HEAD "$BASE/api/parse-questions" || echo "000")
echo "   HTTP $HTTP"

echo
echo "3) POST 无 multipart（缺 file → FastAPI 校验 422）"
HTTP=$(curl -sS -o /tmp/smoke_body.txt -w "%{http_code}" -X POST "$BASE/api/parse-questions" || true)
echo "   HTTP $HTTP"
head -c 400 /tmp/smoke_body.txt; echo

echo
echo "4) POST 字段名错误 file_bad（应为 file → 422）"
echo 'x' >/tmp/smoke_bad_field.txt
HTTP=$(curl -sS -o /tmp/smoke_body.txt -w "%{http_code}" \
  -X POST "$BASE/api/parse-questions" -F "file_bad=@/tmp/smoke_bad_field.txt" || true)
echo "   HTTP $HTTP"
head -c 400 /tmp/smoke_body.txt; echo

echo
echo "5) POST 字段正确 file，但内容为随机 .txt（业务层 422：格式不支持）"
HTTP=$(curl -sS -o /tmp/smoke_body.txt -w "%{http_code}" \
  -X POST "$BASE/api/parse-questions" -F "file=@/tmp/smoke_bad_field.txt" || true)
echo "   HTTP $HTTP"
head -c 500 /tmp/smoke_body.txt; echo

echo
echo "---------- 如何读结果 ----------"
echo "• 1) 非 200：进程/端口/Nginx 未通或 BASE 写错"
echo "• 2) 405：正常（不要用 HEAD 测 POST 接口）"
echo "• 3) 422 且 detail 像缺字段：路由正常，multipart 未带 file"
echo "• 4) 422：字段名要与后端 File(...) 参数名一致（本仓库为 file）"
echo "• 5) 422 且 detail 含「格式不支持/未识别」：链路已通，换真实 docx/pdf/xlsx 再测"
echo "• 若经公网 Nginx 与直连 127.0.0.1 结果不一致：查 Nginx location / proxy_pass"
