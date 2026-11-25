import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            return;
        }
        let observer;
        const findSection = () => {
            const target = document.getElementById(hash.slice(1));
            if (!target) return false;
            target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
            observer?.disconnect();
            return true;
        };
        const frame = requestAnimationFrame(() => {
            if (!findSection()) {
                observer = new MutationObserver(findSection);
                observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
            }
        });
        const timeout = setTimeout(() => observer?.disconnect(), 15000);
        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timeout);
            observer?.disconnect();
        };
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
