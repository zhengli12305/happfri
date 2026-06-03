import pytest

from app.parser import parse_uploaded_file
from tests.helpers import build_sample_docx


def test_parse_docx_single_choice():
    content = build_sample_docx(1)
    result = parse_uploaded_file("sample.docx", content)

    assert result.quizTitle == "sample"
    assert len(result.questions) == 1
    q = result.questions[0]
    assert q.type == "ONE"
    assert "2+2" in q.stem
    assert q.correctAnswerIds == ["B"]
    assert len(q.options) >= 2


def test_unsupported_format_raises():
    with pytest.raises(ValueError, match="不支持"):
        parse_uploaded_file("bad.txt", b"hello")
