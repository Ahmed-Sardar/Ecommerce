import { useSyncExternalStore } from 'react';

const subscribe = (callback) => {
    const query = window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
    query.addEventListener('change', callback);
    return () => query.removeEventListener('change', callback);
};
const snapshot = () => window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches;

export const useDesktopMotion = () => useSyncExternalStore(subscribe, snapshot, () => false);
