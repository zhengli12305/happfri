import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game';
import ItemContainer from '@/components/ItemContainer.vue';
const router = useRouter();
const gameStore = useGameStore();
onMounted(() => {
    if (!gameStore.hasQuestions) {
        router.replace('/upload');
        return;
    }
    gameStore.initializeData();
    gameStore.startTimer();
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "item-view-container" },
});
/** @type {__VLS_StyleScopedClasses['item-view-container']} */ ;
const __VLS_0 = ItemContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    fatherComponent: "item",
}));
const __VLS_2 = __VLS_1({
    fatherComponent: "item",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
