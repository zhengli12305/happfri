import axios from 'axios';
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
export async function parseQuizFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${apiBaseUrl}/api/parse-questions`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 60000
    });
    return response.data;
}
