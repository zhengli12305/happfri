import { onMounted, ref, defineAsyncComponent } from 'vue';
import { useGameStore } from '@/stores/game';
import HomeContent from '../components/HomeContent.vue';
const UploadDrawer = defineAsyncComponent(() => import('../components/UploadDrawer.vue'));
const gameStore = useGameStore();
const isDrawerOpen = ref(false);
function openDrawer() {
    isDrawerOpen.value = true;
}
function closeDrawer() {
    isDrawerOpen.value = false;
}
onMounted(() => {
    const base = import.meta.env.BASE_URL;
    document.body.style.backgroundImage = `url('${base}static/img/1-1.webp'), url('${base}static/img/1-1.jpg')`;
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "home-page" },
});
/** @type {__VLS_StyleScopedClasses['home-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.openDrawer) },
    ...{ class: "upload-trigger" },
});
/** @type {__VLS_StyleScopedClasses['upload-trigger']} */ ;
const __VLS_0 = HomeContent;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onOpenDrawer': {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onOpenDrawer': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ openDrawer: {} },
    { onOpenDrawer: (__VLS_ctx.openDrawer) });
var __VLS_3;
var __VLS_4;
let __VLS_7;
/** @ts-ignore @type {typeof __VLS_components.transition | typeof __VLS_components.Transition | typeof __VLS_components.transition | typeof __VLS_components.Transition} */
transition;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    name: "fade",
}));
const __VLS_9 = __VLS_8({
    name: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
if (__VLS_ctx.isDrawerOpen) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.closeDrawer) },
        ...{ class: "drawer-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['drawer-mask']} */ ;
}
// @ts-ignore
[openDrawer, openDrawer, isDrawerOpen, closeDrawer,];
var __VLS_10;
let __VLS_13;
/** @ts-ignore @type {typeof __VLS_components.transition | typeof __VLS_components.Transition | typeof __VLS_components.transition | typeof __VLS_components.Transition} */
transition;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    name: "slide",
}));
const __VLS_15 = __VLS_14({
    name: "slide",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
if (__VLS_ctx.isDrawerOpen) {
    let __VLS_19;
    /** @ts-ignore @type {typeof __VLS_components.UploadDrawer} */
    UploadDrawer;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ...{ 'onClose': {} },
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClose': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_24;
    const __VLS_25 = ({ close: {} },
        { onClose: (__VLS_ctx.closeDrawer) });
    var __VLS_22;
    var __VLS_23;
}
// @ts-ignore
[isDrawerOpen, closeDrawer,];
var __VLS_16;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
