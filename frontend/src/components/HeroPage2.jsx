import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiArrowDown } from 'react-icons/fi';

// Flip card accent
const FlipCard = ({ front, back, delay = 0, dark = false }) => {
    const [flipped, setFlipped] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setFlipped(true), 1400 + delay);
        return () => clearTimeout(t);
    }, [delay]);
    return (
        <div style={{ perspective: 800 }} className="w-24 h-32 cursor-pointer" onClick={() => setFlipped(f => !f)}>
            <motion.div
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full h-full"
            >
                <div
                    className={`absolute inset-0 rounded-xl flex items-center justify-center text-xs font-bold tracking-wider border ${dark ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200 shadow-lg'}`}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {front}
                </div>
                <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center text-xs font-bold tracking-wider bg-[#1a6b4a] text-white border border-[#1a6b4a]/40"
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
        bg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2400&auto=format&fit=crop',
        tagline: 'Curated Selection',
        headline: 'Minimalist\nElegance',
        description: 'Clean lines, premium materials, and thoughtful design. Discover products that speak through simplicity.',
        cta: { text: 'Explore Collection', link: '/search/home' },
        flipFront: 'HOME', flipBack: 'SHOP',
    },
    {
        id: 2,
        bg: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2400&auto=format&fit=crop',
        tagline: 'Pure Design',
        headline: 'Essential\nBeauty',
        description: 'Stripped down to perfection. Every element serves a purpose, every detail is considered.',
        cta: { text: 'Shop Essentials', link: '/search/minimal' },
        flipFront: 'PURE', flipBack: 'YOURS',
    },
    {
        id: 3,
        bg: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2400&auto=format&fit=crop',
        tagline: 'Timeless Quality',
        headline: 'Refined\nSimplicity',
        description: 'Crafted for those who appreciate the beauty of restraint and the power of understatement.',
        cta: { text: 'Discover More', link: '/search/premium' },
        flipFront: 'LUXE', flipBack: 'NOW',
    },
];

const HeroPage2 = () => {
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 600], [0, 160]);
    const textY = useTransform(scrollY, [0, 600], [0, -60]);
    const fadeOut = useTransform(scrollY, [0, 400], [1, 0]);

    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5500);
        return () => clearInterval(id);
    }, []);

    const slide = slides[current];

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#f5f0e8]">
            {/* Background photo */}
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
                        {/* Warm light overlay — right side stays visible, left gets cream overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0e8] via-[#f5f0e8]/80 to-transparent" />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <motion.div style={{ y: textY, opacity: fadeOut }} className="relative z-10 h-full flex items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="container mx-auto px-8 md:px-16 max-w-6xl"
                    >
                        <div className="max-w-xl">
                            <motion.span
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="block text-xs font-semibold tracking-[0.3em] uppercase text-[#8a7a6a] mb-5"
                            >
                                {slide.tagline}
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.7 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-[#1a1a1a] leading-[1.05] mb-6 whitespace-pre-line"
                            >
                                {slide.headline}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-[#5a4a3a] text-base md:text-lg max-w-sm mb-10 leading-relaxed font-light"
                            >
                                {slide.description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.65, duration: 0.5 }}
                                className="flex items-center gap-5"
                            >
                                <Link
                                    to={slide.cta.link}
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1a1a1a] text-white text-sm font-semibold hover:bg-[#8a7a6a] transition-all duration-300 hover:scale-105"
                                >
                                    {slide.cta.text}
                                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">→</span>
                                </Link>
                            </motion.div>

                            {/* Flip cards row */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="flex gap-4 mt-12"
                            >
                                <FlipCard front={slide.flipFront} back={slide.flipBack} delay={0} />
                                <FlipCard front="2026" back="SALE" delay={200} />
                                <FlipCard front="NEW" back="IN" delay={400} />
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Dots */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? 'w-10 bg-[#1a1a1a]' : 'w-2 bg-[#1a1a1a]/30'}`}
                    />
                ))}
            </div>

            {/* Scroll cue */}
            <motion.div style={{ opacity: fadeOut }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <span className="text-[#8a7a6a] text-[10px] tracking-[0.2em] uppercase">Scroll to Discover</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <FiArrowDown className="text-[#8a7a6a] text-lg" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroPage2;
