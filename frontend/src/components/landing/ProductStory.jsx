import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion as Motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { FiArrowUpRight, FiStar } from 'react-icons/fi';
import { MagneticLink } from './MotionPrimitives';
import { useDesktopMotion } from './useDesktopMotion';
import { money, productImage } from './catalogUtils';

const ProductStory = ({ product }) => {
    const ref = useRef(null);
    const desktop = useDesktopMotion();
    const [step, setStep] = useState(0);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.83, 1, 1.08]);
    const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-7, 0, 4]);
    const radius = useTransform(scrollYProgress, [0, 0.6], ['44% 44% 0% 0%', '0% 0% 0% 0%']);
    useMotionValueEvent(scrollYProgress, 'change', (progress) => setStep(Math.min(2, Math.floor(progress * 3))));
    const images = [...new Set([product.image, ...(product.images || [])].filter(Boolean))];
    const scenes = [
        { kicker: '01 / THE OBJECT', heading: product.name, text: product.description },
        { kicker: '02 / A CLOSER LOOK', heading: 'It’s in the details.',
            text: product.features?.length ? product.features.join(' · ') : `${product.brand}. ${product.category}. Explore the full product details and see how it fits into your everyday.` },
        { kicker: '03 / YOUR NEXT FAVOURITE', heading: 'Make room for better.', text: `${money(product.price)}. ${product.countInStock > 0 ? 'Available to add to your everyday.' : 'Currently sold out. Explore the collection for more discoveries.'}` },
    ];
    return <section className={`luxe-story ${desktop ? 'has-scroll-story' : ''}`} ref={ref} aria-labelledby="story-title">
        <div className="luxe-story-sticky">
            <div className="luxe-story-visual">
                <span className="luxe-eyebrow">THE SPOTLIGHT SERIES</span>
                <span className="luxe-story-watermark" aria-hidden="true">Closer.</span>
                <Motion.div className="luxe-story-image-mask" style={desktop ? { scale, rotate, borderRadius: radius } : undefined}>
                    <AnimatePresence mode="wait" initial={false}>
                        <Motion.img key={desktop ? Math.min(step, images.length - 1) : 'static'}
                            src={productImage(images[desktop ? Math.min(step, images.length - 1) : 0], 1200)} alt={product.name}
                            loading="lazy" decoding="async" initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} exit={{ opacity: 0.6 }} transition={{ duration: 0.35 }}
                            onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/placeholder.svg'; }} />
                    </AnimatePresence>
                </Motion.div>
                <span className="luxe-story-caption">ONE OBJECT. A DIFFERENT EVERYDAY.</span>
            </div>
            <div className="luxe-story-copy">
                <div className="luxe-story-progress" aria-hidden="true">{scenes.map((_, i) => <span key={i} className={i === (desktop ? step : 0) ? 'is-active' : ''} />)}</div>
                <div className="luxe-story-scene">
                    <AnimatePresence mode="wait" initial={false}>
                        <Motion.div key={desktop ? step : 0} initial={desktop ? { opacity: 0, y: 22 } : false} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
                            <p className="luxe-eyebrow">{scenes[desktop ? step : 0].kicker}</p>
                            <h2 id="story-title">{scenes[desktop ? step : 0].heading}</h2>
                            <p className="luxe-story-description">{scenes[desktop ? step : 0].text}</p>
                        </Motion.div>
                    </AnimatePresence>
                </div>
                {product.numReviews > 0 && <p className="luxe-story-rating"><FiStar /> {product.rating.toFixed(1)} <span>from {product.numReviews} product ratings</span></p>}
                <MagneticLink to={`/product/${product._id}`}>Discover the details</MagneticLink>
                <Link className="luxe-text-link" to="/page/1">Keep exploring <FiArrowUpRight /></Link>
            </div>
        </div>
    </section>;
};

export default ProductStory;
