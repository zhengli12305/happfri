import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
const router = useRouter();
const gameStore = useGameStore();
const hintMessage = ref('');
const emit = defineEmits(['openDrawer']);
async function startQuiz() {
    if (!gameStore.hasQuestions) {
        hintMessage.value = '请先在右上角上传题库文件。';
        emit('openDrawer');
        return;
    }
    hintMessage.value = '';
    await router.push('/item');
}
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "home-main" },
});
/** @type {__VLS_StyleScopedClasses['home-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "level-tip" },
});
/** @type {__VLS_StyleScopedClasses['level-tip']} */ ;
(__VLS_ctx.gameStore.level);
__VLS_asFunctionalElement1(__VLS_intrinsics.img, __VLS_intrinsics.img)({
    src: "../images/1-2.png",
    alt: "Logo",
    ...{ class: "home-logo-img" },
});
/** @type {__VLS_StyleScopedClasses['home-logo-img']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.startQuiz) },
    ...{ class: "start-btn" },
});
/** @type {__VLS_StyleScopedClasses['start-btn']} */ ;
if (__VLS_ctx.hintMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "hint" },
    });
    /** @type {__VLS_StyleScopedClasses['hint']} */ ;
    (__VLS_ctx.hintMessage);
}
// @ts-ignore
[gameStore, startQuiz, hintMessage, hintMessage,];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
});
export default {};
