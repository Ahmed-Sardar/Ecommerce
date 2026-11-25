export const productImage = (src, width = 900) => {
    if (!src) return '/images/placeholder.svg';
    const normalized = src.replace(/\\/g, '/');
    if (/^https?:\/\//i.test(normalized)) {
        const url = new URL(normalized);
        if (url.hostname.endsWith('unsplash.com')) {
            url.searchParams.set('w', String(width));
            url.searchParams.set('q', '80');
            url.searchParams.set('auto', 'format');
        }
        return url.toString();
    }
    return `/${normalized.replace(/^\/+/, '')}`;
};

export const money = (value) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(value);

export const searchPath = (keyword) => `/search/${encodeURIComponent(keyword)}`;

export const uniqueProducts = (...groups) => [...new Map(
    groups.flat().filter(Boolean).map((product) => [product._id, product]),
).values()];
