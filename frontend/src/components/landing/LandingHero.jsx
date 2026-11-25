import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { FiArrowDown, FiArrowUpRight, FiStar } from 'react-icons/fi';
import { MagneticLink } from './MotionPrimitives';
import { useDesktopMotion } from './useDesktopMotion';
import { money, productImage } from './catalogUtils';

const LandingHero = ({ product, loading }) => {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const desktop = useDesktopMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.13]);
    return <section className="luxe-hero" ref={ref} aria-labelledby="hero-title">
        <div className="luxe-hero-copy">
            <Motion.p className="luxe-eyebrow" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                <span className="luxe-dot" /> A LITTLE LESS ORDINARY</Motion.p>
            <h1 id="hero-title" aria-label="Everyday. Exceptionally done.">
                {['Everyday.', 'Exceptionally', 'done.'].map((word, i) => <span className={`luxe-word-mask ${i === 1 ? 'is-serif' : ''}`} key={word} aria-hidden="true">
                    <Motion.span initial={reduced ? false : { y: '110%', rotate: 3 }} animate={{ y: '0%', rotate: 0 }}
                        transition={{ delay: 0.15 + i * 0.13, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}>{word}</Motion.span>
                </span>)}
            </h1>
            <Motion.div initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }}>
                <p className="luxe-hero-description">For the way you live, the spaces you love,<br className="luxe-desktop-break" /> and the things that make them yours.</p>
                <div className="luxe-hero-actions"><MagneticLink to="/page/1">Shop now</MagneticLink><a href="#collections" className="luxe-text-link">Explore the collection <FiArrowUpRight /></a></div>
            </Motion.div>
            <div className="luxe-hero-bottom"><a href="#introduction"><span className="luxe-scroll-circle"><FiArrowDown /></span> A world worth exploring</a><span>THE EVERYDAY EDIT / 01</span></div>
        </div>
        <Motion.div className={`luxe-hero-visual ${loading ? 'is-loading' : ''}`}
            initial={reduced ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
            {product ? <>
                <Motion.img className="luxe-hero-photo" src={productImage(product.image, 1500)} alt={product.name}
                    fetchPriority="high" decoding="async" style={desktop ? { y, scale } : undefined}
                    onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/placeholder.svg'; }} />
                <div className="luxe-hero-image-top"><span>OBJECTS OF DESIRE</span><span>EST. FOR THE EVERYDAY</span></div>
                <div className="luxe-hero-annotation"><span className="luxe-dot" /><span>{product.category}<br /><strong>Worth a closer look.</strong></span></div>
                <Link to={`/product/${product._id}`} className="luxe-hero-product">
                    <div><span className="luxe-eyebrow">IN THE SPOTLIGHT</span><h2>{product.name}</h2><span>{money(product.price)}{product.numReviews > 0 && <span className="luxe-hero-rating"><FiStar /> {product.rating.toFixed(1)}</span>}</span></div>
                    <span className="luxe-round-arrow"><FiArrowUpRight /></span>
                </Link>
            </> : <div className="luxe-hero-placeholder" aria-busy={loading}><span className="luxe-outline-star" aria-hidden="true">✳</span><p>{loading ? 'Finding your next favourite…' : 'A world of possibilities.'}</p></div>}
            <span className="luxe-hero-side-label" aria-hidden="true">GOOD DESIGN. GOOD DAYS.</span>
        </Motion.div>
    </section>;
};

export default LandingHero;
