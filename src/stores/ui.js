import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useUiStore = defineStore('ui', () => {
    const loading = ref(false);
    const error = ref('');
    function setLoading(value) {
        loading.value = value;
    }
    function setError(message) {
        error.value = message;
    }
    function clearError() {
        error.value = '';
    }
    return {
        loading,
        error,
        setLoading,
        setError,
        clearError,
    };
});
