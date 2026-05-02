import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
const router = useRouter();
const gameStore = useGameStore();
const localSelection = ref([]);
const currentTopic = computed(() => gameStore.currentTopic);
const visibleQuestionNumbers = computed(() => {
    const total = gameStore.questionCount;
    if (total <= 0)
        return [];
    const nums = [];
    for (let i = 1; i <= total; i++)
        nums.push(i);
    return nums;
});
watch(() => currentTopic.value?.id, (id) => {
    if (!id) {
        localSelection.value = [];
        return;
    }
    localSelection.value = [...(gameStore.userAnswersMap[id] ?? [])];
}, { immediate: true });
function getOptionLabel(index) {
    return String.fromCharCode(65 + index);
}
function isSelected(optionId) {
    return localSelection.value.includes(optionId);
}
function toggleOption(optionId) {
    const topic = currentTopic.value;
    if (!topic)
        return;
    if (topic.type === 'MORE') {
        if (isSelected(optionId)) {
            localSelection.value = localSelection.value.filter((id) => id !== optionId);
            return;
        }
        localSelection.value = [...localSelection.value, optionId];
        return;
    }
    localSelection.value = [optionId];
}
function persistCurrentSelection() {
    const topic = currentTopic.value;
    if (!topic)
        return;
    gameStore.submitCurrentQuestion(localSelection.value);
}
function handleNextItem() {
    persistCurrentSelection();
    if (gameStore.isLastQuestion) {
        handleSubmitAnswer();
        return;
    }
    gameStore.nextQuestion();
}
function handlePrevItem() {
    persistCurrentSelection();
    gameStore.prevQuestion();
}
function handleGoToQuestion(index) {
    persistCurrentSelection();
    gameStore.goToQuestion(index);
}
async function handleSubmitAnswer() {
    persistCurrentSelection();
    gameStore.stopTimer();
    await router.push('/score');
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['quiz-block']} */ ;
/** @type {__VLS_StyleScopedClasses['strip-item']} */ ;
/** @type {__VLS_StyleScopedClasses['strip-item']} */ ;
/** @type {__VLS_StyleScopedClasses['option-item']} */ ;
/** @type {__VLS_StyleScopedClasses['option-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "item-container" },
});
/** @type {__VLS_StyleScopedClasses['item-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "quiz-block" },
});
/** @type {__VLS_StyleScopedClasses['quiz-block']} */ ;
if (!__VLS_ctx.currentTopic) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        to: "/upload",
        ...{ class: "button" },
    }));
    const __VLS_2 = __VLS_1({
        to: "/upload",
        ...{ class: "button" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['button']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    // @ts-ignore
    [currentTopic,];
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "question-strip" },
    });
    /** @type {__VLS_StyleScopedClasses['question-strip']} */ ;
    for (const [num] of __VLS_vFor((__VLS_ctx.visibleQuestionNumbers))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.currentTopic))
                        return;
                    __VLS_ctx.handleGoToQuestion(num);
                    // @ts-ignore
                    [visibleQuestionNumbers, handleGoToQuestion,];
                } },
            key: (num),
            ...{ class: "strip-item" },
            ...{ class: ({ active: num === __VLS_ctx.gameStore.itemNum }) },
        });
        /** @type {__VLS_StyleScopedClasses['strip-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['active']} */ ;
        (num);
        // @ts-ignore
        [gameStore,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
        ...{ class: "topic-title" },
    });
    /** @type {__VLS_StyleScopedClasses['topic-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.currentTopic.type === 'ONE' ? '单选题' : __VLS_ctx.currentTopic.type === 'MORE' ? '多选题' : '判断题');
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.gameStore.itemNum);
    (__VLS_ctx.gameStore.questionCount);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "stem" },
    });
    /** @type {__VLS_StyleScopedClasses['stem']} */ ;
    (__VLS_ctx.currentTopic.stem);
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "option-list" },
    });
    /** @type {__VLS_StyleScopedClasses['option-list']} */ ;
    for (const [option, index] of __VLS_vFor((__VLS_ctx.currentTopic.options))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            ...{ onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.currentTopic))
                        return;
                    __VLS_ctx.toggleOption(option.id);
                    // @ts-ignore
                    [currentTopic, currentTopic, currentTopic, currentTopic, gameStore, gameStore, toggleOption,];
                } },
            key: (option.id),
            ...{ class: "option-item" },
        });
        /** @type {__VLS_StyleScopedClasses['option-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "option-tag" },
            ...{ class: ({ selected: __VLS_ctx.isSelected(option.id) }) },
        });
        /** @type {__VLS_StyleScopedClasses['option-tag']} */ ;
        /** @type {__VLS_StyleScopedClasses['selected']} */ ;
        (__VLS_ctx.getOptionLabel(index));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (option.text);
        // @ts-ignore
        [isSelected, getOptionLabel,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "nav-actions" },
    });
    /** @type {__VLS_StyleScopedClasses['nav-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.handlePrevItem) },
        ...{ class: "button ghost" },
        disabled: (__VLS_ctx.gameStore.itemNum <= 1),
    });
    /** @type {__VLS_StyleScopedClasses['button']} */ ;
    /** @type {__VLS_StyleScopedClasses['ghost']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.handleNextItem) },
        ...{ class: "button" },
    });
    /** @type {__VLS_StyleScopedClasses['button']} */ ;
    (__VLS_ctx.gameStore.isLastQuestion ? '提交答卷' : '下一题');
}
// @ts-ignore
[gameStore, gameStore, handlePrevItem, handleNextItem,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
