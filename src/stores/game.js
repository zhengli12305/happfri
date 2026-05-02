import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useUiStore } from './ui';
function normalizeAnswerIds(answerIds) {
    return [...new Set(answerIds.map(String))].sort();
}
function isSameAnswerSet(left, right) {
    if (left.length !== right.length)
        return false;
    return left.every((id, index) => id === right[index]);
}
export const useGameStore = defineStore('game', () => {
    const level = ref('第一周');
    const quizTitle = ref('');
    const questions = ref([]);
    const itemNum = ref(1);
    const elapsedTime = ref(0);
    const timerId = ref(null);
    const userAnswersMap = ref({});
    const { clearError } = useUiStore();
    const questionCount = computed(() => questions.value.length);
    const currentTopic = computed(() => {
        const index = itemNum.value - 1;
        return index >= 0 && index < questions.value.length ? questions.value[index] ?? null : null;
    });
    const isLastQuestion = computed(() => {
        if (questionCount.value === 0)
            return false;
        return itemNum.value >= questionCount.value;
    });
    const hasQuestions = computed(() => questionCount.value > 0);
    const answeredCount = computed(() => Object.keys(userAnswersMap.value).length);
    const calculateScore = computed(() => {
        if (!questions.value.length)
            return 0;
        const explicitTotal = questions.value.reduce((sum, question) => sum + (question.score ?? 0), 0);
        const fallbackPerQuestion = questionCount.value > 0 ? 100 / questionCount.value : 0;
        const hasCustomScore = explicitTotal > 0;
        return Math.round(questions.value.reduce((score, question) => {
            const userAnswers = normalizeAnswerIds(userAnswersMap.value[question.id] ?? []);
            const standardAnswers = normalizeAnswerIds(question.correctAnswerIds ?? []);
            if (!isSameAnswerSet(userAnswers, standardAnswers))
                return score;
            return score + (hasCustomScore ? question.score ?? 0 : fallbackPerQuestion);
        }, 0));
    });
    const reviewItems = computed(() => questions.value.map((question, index) => {
        const userAnswerIds = normalizeAnswerIds(userAnswersMap.value[question.id] ?? []);
        const correctAnswerIds = normalizeAnswerIds(question.correctAnswerIds ?? []);
        return {
            index: index + 1,
            id: question.id,
            type: question.type,
            stem: question.stem,
            userAnswerIds,
            correctAnswerIds,
            isCorrect: isSameAnswerSet(userAnswerIds, correctAnswerIds)
        };
    }));
    function setParseResult(payload) {
        quizTitle.value = payload.quizTitle || '智能题库';
        questions.value = payload.questions;
        initializeData();
        clearError();
    }
    function setQuestionAnswer(questionId, answerIds) {
        userAnswersMap.value[questionId] = normalizeAnswerIds(answerIds);
    }
    function submitCurrentQuestion(answerIds) {
        const topic = currentTopic.value;
        if (!topic)
            return;
        setQuestionAnswer(topic.id, answerIds);
    }
    function nextQuestion() {
        if (itemNum.value < questionCount.value) {
            itemNum.value++;
            return;
        }
        stopTimer();
    }
    function prevQuestion() {
        if (itemNum.value > 1) {
            itemNum.value--;
        }
    }
    function goToQuestion(targetIndex) {
        if (questionCount.value === 0)
            return;
        const safeIndex = Math.min(Math.max(targetIndex, 1), questionCount.value);
        itemNum.value = safeIndex;
    }
    function initializeData() {
        stopTimer();
        itemNum.value = 1;
        elapsedTime.value = 0;
        userAnswersMap.value = {};
        clearError();
    }
    function clearAllData() {
        initializeData();
        quizTitle.value = '';
        questions.value = [];
    }
    function startTimer() {
        if (timerId.value !== null)
            return;
        timerId.value = window.setInterval(() => {
            elapsedTime.value++;
        }, 1000);
    }
    function stopTimer() {
        if (timerId.value !== null) {
            clearInterval(timerId.value);
            timerId.value = null;
        }
    }
    return {
        level,
        quizTitle,
        questions,
        itemNum,
        elapsedTime,
        timerId,
        userAnswersMap,
        questionCount,
        currentTopic,
        isLastQuestion,
        hasQuestions,
        answeredCount,
        calculateScore,
        reviewItems,
        setParseResult,
        setQuestionAnswer,
        submitCurrentQuestion,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        initializeData,
        clearAllData,
        startTimer,
        stopTimer
    };
});
