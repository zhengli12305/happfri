import pytest

from app.parser import parse_uploaded_file
from tests.helpers import build_sample_docx


@pytest.fixture
def small_docx() -> bytes:
    return build_sample_docx(10)


@pytest.fixture
def medium_docx() -> bytes:
    return build_sample_docx(50)


def test_parse_10_questions_benchmark(benchmark, small_docx):
    result = benchmark(parse_uploaded_file, "small_10q.docx", small_docx)
    assert len(result.questions) == 10


def test_parse_50_questions_benchmark(benchmark, medium_docx):
    result = benchmark(parse_uploaded_file, "medium_50q.docx", medium_docx)
    assert len(result.questions) == 50
