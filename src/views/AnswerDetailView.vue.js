import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const questionIndex = computed(() => Number(route.params.index) || 1);
const reviewItem = computed(() => gameStore.reviewItems[questionIndex.value - 1]);
const question = computed(() => gameStore.questions[questionIndex.value - 1]);
function getOptionClass(optionId) {
    const isCorrect = reviewItem.value?.correctAnswerIds.includes(optionId);
    const isUserSelected = reviewItem.value?.userAnswerIds.includes(optionId);
    return {
        correct: Boolean(isCorrect),
        selected: Boolean(isUserSelected),
        wrong: Boolean(isUserSelected && !isCorrect)
    };
}
function goPrev() {
    if (questionIndex.value <= 1)
        return;
    router.push(`/answer-card/${questionIndex.value - 1}`);
}
function goNext() {
    if (questionIndex.value >= gameStore.reviewItems.length)
        return;
    router.push(`/answer-card/${questionIndex.value + 1}`);
}
onMounted(() => {
    if (!gameStore.hasQuestions) {
        router.replace('/upload');
        return;
    }
    if (!question.value || !reviewItem.value) {
        router.replace('/answer-card');
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['top']} */ ;
/** @type {__VLS_StyleScopedClasses['options']} */ ;
/** @type {__VLS_StyleScopedClasses['options']} */ ;
/** @type {__VLS_StyleScopedClasses['options']} */ ;
/** @type {__VLS_StyleScopedClasses['options']} */ ;
/** @type {__VLS_StyleScopedClasses['pager-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pager-btn']} */ ;
if (__VLS_ctx.reviewItem && __VLS_ctx.question) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
        ...{ class: "answer-detail-page" },
    });
    /** @type {__VLS_StyleScopedClasses['answer-detail-page']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
        ...{ class: "top" },
    });
    /** @type {__VLS_StyleScopedClasses['top']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
    (__VLS_ctx.reviewItem.index);
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        to: (`/answer-card?current=${__VLS_ctx.reviewItem.index}`),
        ...{ class: "back" },
    }));
    const __VLS_2 = __VLS_1({
        to: (`/answer-card?current=${__VLS_ctx.reviewItem.index}`),
        ...{ class: "back" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['back']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    // @ts-ignore
    [reviewItem, reviewItem, reviewItem, question,];
    var __VLS_3;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "type" },
    });
    /** @type {__VLS_StyleScopedClasses['type']} */ ;
    (__VLS_ctx.question.type);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "stem" },
    });
    /** @type {__VLS_StyleScopedClasses['stem']} */ ;
    (__VLS_ctx.question.stem);
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "options" },
    });
    /** @type {__VLS_StyleScopedClasses['options']} */ ;
    for (const [option] of __VLS_vFor((__VLS_ctx.question.options))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (option.id),
            ...{ class: (__VLS_ctx.getOptionClass(option.id)) },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "label" },
        });
        /** @type {__VLS_StyleScopedClasses['label']} */ ;
        (option.id);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (option.text);
        // @ts-ignore
        [question, question, question, getOptionClass,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "result-line" },
    });
    /** @type {__VLS_StyleScopedClasses['result-line']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({
        ...{ class: "correct-text" },
    });
    /** @type {__VLS_StyleScopedClasses['correct-text']} */ ;
    (__VLS_ctx.reviewItem.correctAnswerIds.join(', ') || '无');
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({
        ...{ class: "wrong-text" },
    });
    /** @type {__VLS_StyleScopedClasses['wrong-text']} */ ;
    (__VLS_ctx.reviewItem.userAnswerIds.join(', ') || '未作答');
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "pager" },
    });
    /** @type {__VLS_StyleScopedClasses['pager']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.goPrev) },
        ...{ class: "pager-btn ghost" },
        disabled: (__VLS_ctx.questionIndex <= 1),
    });
    /** @type {__VLS_StyleScopedClasses['pager-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['ghost']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.goNext) },
        ...{ class: "pager-btn" },
        disabled: (__VLS_ctx.questionIndex >= __VLS_ctx.gameStore.reviewItems.length),
    });
    /** @type {__VLS_StyleScopedClasses['pager-btn']} */ ;
}
// @ts-ignore
[reviewItem, reviewItem, goPrev, questionIndex, questionIndex, goNext, gameStore,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
