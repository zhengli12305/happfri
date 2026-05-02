import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
const router = useRouter();
const gameStore = useGameStore();
const score = computed(() => gameStore.calculateScore);
const scoreTips = computed(() => {
    const tipsArr = [
        '继续努力，再做几套题就更稳了。',
        '掌握得不错，保持这个节奏。',
        '表现很好，已经超过大多数人。',
        '优秀，答题准确率很高。',
        '满分表现，太强了。'
    ];
    let index = Math.ceil(score.value / 20) - 1;
    if (index < 0)
        index = 0;
    if (index > 4)
        index = 4;
    return tipsArr[index];
});
onMounted(() => {
    if (!gameStore.hasQuestions) {
        router.replace('/upload');
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "score-page" },
});
/** @type {__VLS_StyleScopedClasses['score-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "score" },
});
/** @type {__VLS_StyleScopedClasses['score']} */ ;
(__VLS_ctx.score);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "tip" },
});
/** @type {__VLS_StyleScopedClasses['tip']} */ ;
(__VLS_ctx.scoreTips);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "meta" },
});
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
(__VLS_ctx.gameStore.questionCount);
(__VLS_ctx.gameStore.elapsedTime);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "actions" },
});
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "button ghost" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "button ghost" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
// @ts-ignore
[score, scoreTips, gameStore, gameStore,];
var __VLS_3;
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    to: "/answer-card",
    ...{ class: "button secondary" },
}));
const __VLS_8 = __VLS_7({
    to: "/answer-card",
    ...{ class: "button secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary']} */ ;
const { default: __VLS_11 } = __VLS_9.slots;
// @ts-ignore
[];
var __VLS_9;
let __VLS_12;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    to: "/upload",
    ...{ class: "button" },
}));
const __VLS_14 = __VLS_13({
    to: "/upload",
    ...{ class: "button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
/** @type {__VLS_StyleScopedClasses['button']} */ ;
const { default: __VLS_17 } = __VLS_15.slots;
// @ts-ignore
[];
var __VLS_15;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
