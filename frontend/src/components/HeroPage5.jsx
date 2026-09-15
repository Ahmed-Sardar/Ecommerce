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
                    className="absolute inset-0 rounded-xl flex items-center justify-center text-xs font-black tracking-wider bg-white/10 border border-white/25 text-yellow-300"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {front}
                </div>
                <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center text-xs font-black tracking-wider bg-gradient-to-br from-red-500 to-pink-600 text-white"
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
        bg: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2400&auto=format&fit=crop',
        primaryGrad: 'from-red-600 via-orange-500 to-yellow-500',
        secondaryGrad: 'from-purple-900 via-blue-800 to-black',
        tagline: 'UNLEASH ENERGY',
        headline: 'BOLD\nMOVES',
        description: 'High-energy products for those who dare to stand out. Make a statement that can\'t be ignored.',
        cta: { text: 'POWER UP', link: '/search/Sports' },
        flipFront: 'GO', flipBack: 'WIN',
    },
    {
        id: 2,
        bg: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2400&auto=format&fit=crop',
        primaryGrad: 'from-purple-600 via-pink-600 to-red-500',
        secondaryGrad: 'from-blue-900 via-indigo-800 to-black',
        tagline: 'MAXIMUM IMPACT',
        headline: 'FIERCE\nFORCE',
        description: 'Unleash your inner warrior with products designed for maximum impact and unstoppable performance.',
        cta: { text: 'GO FIERCE', link: '/search/Sports' },
        flipFront: 'PUSH', flipBack: 'HARD',
    },
    {
        id: 3,
        bg: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2400&auto=format&fit=crop',
        primaryGrad: 'from-cyan-500 via-blue-600 to-purple-700',
        secondaryGrad: 'from-green-900 via-teal-800 to-black',
        tagline: 'ELECTRIC VIBES',
        headline: 'SHOCK\nWAVE',
        description: 'Electrifying products that send shockwaves through the ordinary. Experience the extraordinary.',
        cta: { text: 'GET SHOCKED', link: '/search/Sports' },
        flipFront: 'ZAP', flipBack: 'IT',
    },
];

const HeroPage5 = () => {
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 600], [0, 160]);
    const textY = useTransform(scrollY, [0, 600], [0, -60]);
    const fadeOut = useTransform(scrollY, [0, 400], [1, 0]);

    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setCurrent(p => (p + 1) % slides.length), 4500);
        return () => clearInterval(id);
    }, []);

    const slide = slides[current];

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
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
                        {/* Bold split gradient overlay */}
                        <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${slide.primaryGrad} opacity-85`} />
                        <div className={`absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr ${slide.secondaryGrad} opacity-80`} />
                        <div className="absolute inset-0 bg-black/30" />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Geometric animated shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
                <motion.div
                    animate={{ rotate: [0, 180, 360], scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-16 right-24 w-28 h-28 bg-white/10 rotate-45"
                />
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, -90, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-24 right-40 w-20 h-20 border-4 border-yellow-300/30 rounded-full"
                />
            </div>

            <motion.div style={{ y: textY, opacity: fadeOut }} className="relative z-10 h-full flex items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="container mx-auto px-8 md:px-16 max-w-6xl"
                    >
                        <div className="max-w-xl">
                            <motion.span
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="block text-xs font-black tracking-[0.35em] uppercase text-yellow-300 mb-4"
                            >
                                {slide.tagline}
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.7 }}
                                className="text-6xl md:text-7xl lg:text-8xl font-heading font-black text-white leading-none mb-6 whitespace-pre-line"
                            >
                                {slide.headline}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-gray-300 text-lg md:text-xl max-w-sm mb-10 leading-tight font-medium"
                            >
                                {slide.description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.65, duration: 0.5 }}
                            >
                                <Link
                                    to={slide.cta.link}
                                    className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-black text-base hover:from-red-600 hover:to-pink-700 hover:scale-105 transition-all duration-300 shadow-2xl"
                                >
                                    {slide.cta.text}
                                    <span className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center">→</span>
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
                                <FlipCard front="HOT" back="DEAL" delay={200} />
                                <FlipCard front="NEW" back="NOW" delay={400} />
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? 'w-10 bg-yellow-400' : 'w-2 bg-white/30'}`}
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

export default HeroPage5;
