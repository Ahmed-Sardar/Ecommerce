import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiArrowDown } from 'react-icons/fi';

// Flip card used as a decorative accent
const FlipCard = ({ front, back, delay = 0 }) => {
    const [flipped, setFlipped] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setFlipped(true), 1200 + delay);
        return () => clearTimeout(t);
    }, [delay]);
    return (
        <div
            className="w-28 h-36 cursor-pointer"
            style={{ perspective: 800 }}
            onClick={() => setFlipped((f) => !f)}
        >
            <motion.div
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full h-full"
            >
                {/* Front */}
                <div
                    className="absolute inset-0 rounded-2xl flex items-center justify-center text-white text-xs font-bold tracking-wider bg-white/10 border border-white/20 backdrop-blur-md"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {front}
                </div>
                {/* Back */}
                <div
                    className="absolute inset-0 rounded-2xl flex items-center justify-center text-white text-xs font-bold tracking-wider bg-accent/80 border border-accent/40"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    {back}
                </div>
            </motion.div>
        </div>
    );
};

const slides = [
    {
        id: 1,
        bg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop',
        gradient: 'from-[#1a0a00] via-[#2d1a0a] to-[#0d0d0d]',
        tagline: 'Curated Living',
        headline: 'Curating the\nArt of Living',
        description: 'Discover exclusive, handcrafted pieces designed to transform your space into a sanctuary.',
        cta: { text: 'Explore Collections', link: '/search/home' },
        flipFront: '✦ NEW',
        flipBack: 'SHOP',
        accent: '#c9a84c',
    },
    {
        id: 2,
        bg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2400&auto=format&fit=crop',
        gradient: 'from-[#0a1628] via-[#0d2035] to-[#060d1a]',
        tagline: 'Exclusive Brand',
        headline: 'Exclusive\nOffers for You',
        description: 'Clothing is more than just a way to cover the body. It is a form of self-expression, culture, and identity.',
        cta: { text: 'Shop Now', link: '/search/fashion' },
        flipFront: 'NEW IN',
        flipBack: 'WEAR',
        accent: '#4a9eff',
    },
    {
        id: 3,
        bg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2400&auto=format&fit=crop',
        gradient: 'from-[#1a0d0a] via-[#2a1a14] to-[#0d0a0a]',
        tagline: 'Timeless Beauty',
        headline: 'Timeless\nBeauty',
        description: 'Discover luxury skincare and makeup. Indulge in rituals that reveal your most radiant self.',
        cta: { text: 'Explore', link: '/search/beauty' },
        flipFront: 'GLOW',
        flipBack: 'SHOP',
        accent: '#d4a574',
    },
];

const Hero = () => {
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 600], [0, 180]);
    const textY = useTransform(scrollY, [0, 600], [0, -80]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
        return () => clearInterval(id);
    }, []);

    const slide = slides[current];

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.bg})` }}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-70`} />
                        <div className="absolute inset-0 bg-black/40" />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-10 h-full flex items-center"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="container mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                    >
                        {/* Left: Text */}
                        <div>
                            <motion.span
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="block text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-5"
                                style={{ color: slide.accent }}
                            >
                                {slide.tagline}
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.7 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.05] mb-6 whitespace-pre-line"
                            >
                                {slide.headline}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-white/70 text-base md:text-lg max-w-md mb-10 leading-relaxed font-light"
                            >
                                {slide.description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.65, duration: 0.5 }}
                                className="flex items-center gap-5"
                            >
                                <Link
                                    to={slide.cta.link}
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:brightness-110"
                                    style={{ backgroundColor: slide.accent }}
                                >
                                    {slide.cta.text}
                                    <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-xs">→</span>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right: Flip Cards decoration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="hidden md:flex items-center justify-center gap-5"
                        >
                            <FlipCard front={slide.flipFront} back={slide.flipBack} delay={0} />
                            <FlipCard front="2026" back="NEW" delay={200} />
                            <FlipCard front="★★★★★" back="LUXE" delay={400} />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Slide dots */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? 'w-10 bg-white' : 'w-2 bg-white/40'}`}
                    />
                ))}
            </div>

            {/* Scroll cue */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
            >
                <span className="text-white/50 text-[10px] tracking-[0.2em] uppercase">Scroll to Discover</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <FiArrowDown className="text-white/50 text-lg" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;
