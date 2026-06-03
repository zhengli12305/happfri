#Requires -Version 5.1
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location (Join-Path $Root "backend")

Write-Host "=== happyfri 后端性能基线 ===" -ForegroundColor Cyan
Write-Host "若 8000 端口被占用，请先:" -ForegroundColor Yellow
Write-Host '  $env:PERF_API_BASE="http://127.0.0.1:8001"' -ForegroundColor Yellow
Write-Host "  并在另一终端用 uvicorn 起 8001" -ForegroundColor Yellow
Write-Host ""

python -m pip install -q -r requirements-dev.txt
python scripts/run_perf_baseline.py

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "报告: docs/perf/BASELINE.md" -ForegroundColor Green
  Write-Host "口述稿: docs/perf/INTERVIEW_SCRIPT.md" -ForegroundColor Green
}
