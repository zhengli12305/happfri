import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { parseQuizFile } from '@/api/quiz';
import { useGameStore } from '@/stores/game';
import { useUiStore } from '@/stores/ui';
const router = useRouter();
const gameStore = useGameStore();
const uiStore = useUiStore();
const selectedFile = ref(null);
const fileInputRef = ref(null);
function handleFileChange(event) {
    const target = event.target;
    selectedFile.value = target.files?.[0] ?? null;
    uiStore.clearError();
}
function clearSelection() {
    selectedFile.value = null;
    uiStore.clearError();
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
}
async function handleUpload() {
    if (!selectedFile.value)
        return;
    uiStore.setLoading(true);
    uiStore.clearError();
    try {
        const result = await parseQuizFile(selectedFile.value);
        if (!result.questions?.length) {
            throw new Error('解析结果为空，请检查文件内容后重试。');
        }
        gameStore.setParseResult(result);
        await router.push('/item');
    }
    catch (error) {
        let message = '解析失败，请稍后重试。';
        if (axios.isAxiosError(error)) {
            const detail = error.response?.data?.detail;
            if (typeof detail === 'string' && detail.trim()) {
                message = detail;
            }
            else if (error.message) {
                message = error.message;
            }
        }
        else if (error instanceof Error) {
            message = error.message;
        }
        uiStore.setError(message);
    }
    finally {
        uiStore.setLoading(false);
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['format-tips']} */ ;
/** @type {__VLS_StyleScopedClasses['format-tips']} */ ;
/** @type {__VLS_StyleScopedClasses['format-tips']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "upload-page" },
});
/** @type {__VLS_StyleScopedClasses['upload-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "title" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "desc" },
});
/** @type {__VLS_StyleScopedClasses['desc']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onChange: (__VLS_ctx.handleFileChange) },
    ref: "fileInputRef",
    ...{ class: "file-input" },
    type: "file",
    accept: ".doc,.docx,.pdf,.xls,.xlsx",
});
/** @type {__VLS_StyleScopedClasses['file-input']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "actions" },
});
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.handleUpload) },
    ...{ class: "primary-btn" },
    disabled: (!__VLS_ctx.selectedFile || __VLS_ctx.uiStore.loading),
});
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
(__VLS_ctx.uiStore.loading ? '解析中...' : '上传并开始答题');
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.clearSelection) },
    ...{ class: "ghost-btn" },
    disabled: (__VLS_ctx.uiStore.loading),
});
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
if (__VLS_ctx.selectedFile) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "filename" },
    });
    /** @type {__VLS_StyleScopedClasses['filename']} */ ;
    (__VLS_ctx.selectedFile.name);
}
if (__VLS_ctx.uiStore.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "error" },
    });
    /** @type {__VLS_StyleScopedClasses['error']} */ ;
    (__VLS_ctx.uiStore.error);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "format-tips" },
});
/** @type {__VLS_StyleScopedClasses['format-tips']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({
    ...{ class: "example" },
});
/** @type {__VLS_StyleScopedClasses['example']} */ ;
// @ts-ignore
[handleFileChange, handleUpload, selectedFile, selectedFile, selectedFile, uiStore, uiStore, uiStore, uiStore, uiStore, clearSelection,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
