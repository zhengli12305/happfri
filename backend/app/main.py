from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .db import init_db
from .parser import parse_uploaded_file
from .schemas import (
    ParseQuestionsResponse,
    QuizResultCreate,
    QuizResultCreatedResponse,
    QuizResultListResponse,
)
from .storage import insert_quiz_result, list_quiz_results


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="Quiz Parser API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/api/parse-questions", response_model=ParseQuestionsResponse)
async def parse_questions(file: UploadFile = File(...)) -> ParseQuestionsResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="文件名为空。")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="文件内容为空。")

    try:
        return parse_uploaded_file(file.filename, content)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail="解析服务内部错误。") from exc


@app.post("/api/quiz-results", response_model=QuizResultCreatedResponse, status_code=201)
def create_quiz_result(payload: QuizResultCreate) -> QuizResultCreatedResponse:
    item = insert_quiz_result(payload)
    return QuizResultCreatedResponse(id=item.id, timestamp=item.timestamp)


@app.get("/api/quiz-results", response_model=QuizResultListResponse)
def get_quiz_results(
    clientId: str = Query(..., min_length=1),
) -> QuizResultListResponse:
    results = list_quiz_results(clientId)
    return QuizResultListResponse(results=results)
