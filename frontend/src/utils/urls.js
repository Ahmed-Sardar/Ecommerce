export const API_URL = (import.meta.env?.VITE_API_URL || '').replace(/\/+$/, '');

export const imageUrl = (src) => {
    if (!src) return '/images/placeholder.svg';
    const normalized = src.replace(/\\/g, '/');
    if (normalized === '/images/placeholder.svg') return normalized;
    if (/^(https?:)?\/\//i.test(normalized) && !/^https?:\/\/localhost:5000\//i.test(normalized)) {
        return normalized;
    }
    const relative = normalized.replace(/^https?:\/\/localhost:5000\//i, '').replace(/^\/+/, '');
    return `${API_URL}/${relative}`;
};
