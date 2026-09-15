import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiArrowDown } from 'react-icons/fi';

const FlipCard = ({ front, back, delay = 0 }) => {
    const [flipped, setFlipped] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setFlipped(true), 1200 + delay);
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
                    className="absolute inset-0 rounded-xl flex items-center justify-center text-xs font-bold tracking-wider bg-white/10 border border-white/25 backdrop-blur-md text-white"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {front}
                </div>
                <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center text-xs font-bold tracking-wider bg-gradient-to-br from-violet-500 to-cyan-500 text-white"
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
        bg: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2400&auto=format&fit=crop',
        tagline: 'Transparent Innovation',
        headline: 'Through the\nGlass',
        description: 'Experience clarity in design and function. Our collection blurs the line between form and innovation.',
        cta: { text: 'Discover Tech', link: '/search/Electronics' },
        flipFront: 'TECH', flipBack: 'NOW',
        accent: '#7dd3fc',
    },
    {
        id: 2,
        bg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2400&auto=format&fit=crop',
        tagline: 'Crystal Clear Vision',
        headline: 'Beyond the\nSurface',
        description: 'Dive deeper into products that reveal their true beauty through transparency and precision.',
        cta: { text: 'Explore Deep', link: '/search/Electronics' },
        flipFront: 'DEEP', flipBack: 'GO',
        accent: '#a78bfa',
    },
    {
        id: 3,
        bg: 'https://images.unsplash.com/photo-1612831455359-970e23a1e4e9?q=80&w=2400&auto=format&fit=crop',
        tagline: 'Ethereal Design',
        headline: 'Floating\nDreams',
        description: 'Where reality meets imagination. Products that seem to defy gravity with ethereal beauty.',
        cta: { text: 'Dream Big', link: '/search/Accessories' },
        flipFront: 'FLOAT', flipBack: 'FLY',
        accent: '#67e8f9',
    },
];

const HeroPage3 = () => {
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 600], [0, 160]);
    const textY = useTransform(scrollY, [0, 600], [0, -60]);
    const fadeOut = useTransform(scrollY, [0, 400], [1, 0]);

    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setCurrent(p => (p + 1) % slides.length), 6000);
        return () => clearInterval(id);
    }, []);

    const slide = slides[current];

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#060d1a]">
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
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.bg})` }} />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#060d1a] via-[#060d1a]/75 to-[#060d1a]/30" />
                        {/* Glassmorphic overlay */}
                        <div className="absolute inset-0 backdrop-blur-[1px]" />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Floating orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
                <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-20 right-40 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />
                <motion.div animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-32 left-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

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
                                className="block text-xs font-semibold tracking-[0.3em] uppercase mb-5"
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
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-white/60 text-base md:text-lg max-w-sm mb-10 leading-relaxed font-light"
                            >
                                {slide.description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.65, duration: 0.5 }}
                            >
                                <Link
                                    to={slide.cta.link}
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-[#060d1a] hover:scale-105 transition-all duration-300"
                                    style={{ backgroundColor: slide.accent }}
                                >
                                    {slide.cta.text}
                                    <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-xs">→</span>
                                </Link>
                            </motion.div>

                            {/* Flip cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="flex gap-4 mt-12"
                            >
                                <FlipCard front={slide.flipFront} back={slide.flipBack} delay={0} />
                                <FlipCard front="2026" back="TECH" delay={200} />
                                <FlipCard front="NEW" back="IN" delay={400} />
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? 'w-10 bg-white' : 'w-2 bg-white/30'}`}
                    />
                ))}
            </div>

            <motion.div style={{ opacity: fadeOut }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase">Scroll to Discover</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <FiArrowDown className="text-white/40 text-lg" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroPage3;
