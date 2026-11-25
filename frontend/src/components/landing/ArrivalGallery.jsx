import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import EditorialProductCard from './EditorialProductCard';
import { useDesktopMotion } from './useDesktopMotion';

const ArrivalGallery = ({ products }) => {
    const section = useRef(null);
    const viewport = useRef(null);
    const track = useRef(null);
    const desktop = useDesktopMotion();
    const [distance, setDistance] = useState(0);
    const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
    const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
    useEffect(() => {
        const trackElement = track.current;
        const viewportElement = viewport.current;
        let active = true;
        const measure = () => {
            if (active && trackElement.isConnected && viewportElement.isConnected) {
                setDistance(Math.max(0, trackElement.scrollWidth - viewportElement.clientWidth));
            }
        };
        const observer = new ResizeObserver(measure);
        observer.observe(trackElement);
        observer.observe(viewportElement);
        return () => { active = false; observer.disconnect(); };
    }, []);
    const move = (direction) => viewport.current.scrollBy({ left: direction * viewport.current.clientWidth * 0.8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    // Keep keyboard focus visible as it enters cards beyond the desktop viewport.
    const followFocus = (event) => {
        if (!desktop || !event.target.matches(':focus-visible')) return;
        const card = event.target.closest('.luxe-product');
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        if (bounds.left >= 0 && bounds.right <= window.innerWidth) return;
        const travel = section.current.offsetHeight - window.innerHeight;
        const position = Math.min(1, Math.max(0, (card.offsetLeft - 60) / Math.max(1, distance)));
        window.scrollTo({ top: section.current.offsetTop + travel * (0.05 + position * 0.9), behavior: 'instant' });
    };
    return <section className={`luxe-arrivals ${desktop ? 'is-horizontal-story' : ''}`} ref={section} id="new-arrivals"
        style={desktop ? { height: `calc(100svh + ${distance}px)` } : undefined} aria-labelledby="arrival-title">
        <div className="luxe-arrivals-sticky">
            <div className="luxe-section-heading luxe-wrap"><div><p className="luxe-eyebrow">FRESH PERSPECTIVES</p><h2 id="arrival-title">Just landed. <em>Just right.</em></h2></div>
                <Link className="luxe-text-link" to="/page/1">All new arrivals <FiArrowUpRight /></Link></div>
            <div ref={viewport} className="luxe-gallery-viewport" tabIndex={desktop ? -1 : 0} aria-label="New arrivals gallery" onFocusCapture={followFocus}>
                <Motion.div className="luxe-gallery-track" ref={track} style={desktop ? { x } : undefined}>
                    {products.map((product, i) => <EditorialProductCard key={product._id} product={product} number={i + 1} />)}
                </Motion.div>
            </div>
            <div className="luxe-gallery-bottom luxe-wrap"><span className="luxe-gallery-hint">{desktop ? 'SCROLL TO DISCOVER' : 'SWIPE TO DISCOVER'} <FiArrowRight /></span>
                <div className="luxe-gallery-progress" aria-hidden="true"><Motion.span style={desktop ? { scaleX: scrollYProgress } : { scaleX: 1 }} /></div>
                {!desktop && <div className="luxe-gallery-controls"><button onClick={() => move(-1)} aria-label="Previous arrivals"><FiArrowLeft /></button><button onClick={() => move(1)} aria-label="Next arrivals"><FiArrowRight /></button></div>}
                <span className="luxe-gallery-total">{String(products.length).padStart(2, '0')} DISCOVERIES</span></div>
        </div>
    </section>;
};

export default ArrivalGallery;
