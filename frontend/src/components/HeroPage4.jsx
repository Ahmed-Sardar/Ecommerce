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
                    className="absolute inset-0 rounded-xl flex items-center justify-center text-xs font-black tracking-wider bg-white/10 border border-white/25 text-white"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {front}
                </div>
                <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center text-xs font-black tracking-wider bg-white text-purple-600"
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
        bg: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2400&auto=format&fit=crop',
        gradient: 'from-pink-500 via-purple-600 to-indigo-700',
        tagline: 'Vibrant Collection',
        headline: 'Color Your\nWorld',
        description: 'Bold designs, vibrant colors, playful innovation. Express yourself with products that celebrate creativity.',
        cta: { text: 'Explore Fashion', link: '/search/Fashion' },
        flipFront: 'BOLD', flipBack: 'WEAR',
    },
    {
        id: 2,
        bg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2400&auto=format&fit=crop',
        gradient: 'from-orange-500 via-red-500 to-pink-600',
        tagline: 'Rainbow Dreams',
        headline: 'Paint Your\nStory',
        description: 'Every color tells a story. Discover products that let you express your unique personality.',
        cta: { text: 'Shop Now', link: '/search/Fashion' },
        flipFront: 'STYLE', flipBack: 'YOU',
    },
    {
        id: 3,
        bg: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2400&auto=format&fit=crop',
        gradient: 'from-cyan-500 via-blue-600 to-purple-700',
        tagline: 'Electric Energy',
        headline: 'Spark Your\nImagination',
        description: 'High-voltage creativity meets stunning design. Products that electrify your space.',
        cta: { text: 'Get Sparked', link: '/search/Fashion' },
        flipFront: 'VIBE', flipBack: 'ON',
    },
];

const HeroPage4 = () => {
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 600], [0, 160]);
    const textY = useTransform(scrollY, [0, 600], [0, -60]);
    const fadeOut = useTransform(scrollY, [0, 400], [1, 0]);

    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
        return () => clearInterval(id);
    }, []);

    const slide = slides[current];

    return (
        <div className="relative w-full h-screen overflow-hidden">
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
                        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-75`} />
                        <div className="absolute inset-0 bg-black/20" />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-yellow-300/20 blur-2xl"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-green-300/15 blur-2xl"
                />
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
                                className="block text-xs font-black tracking-[0.3em] uppercase text-white/80 mb-5"
                            >
                                {slide.tagline}
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.7 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-[1.0] mb-6 whitespace-pre-line"
                            >
                                {slide.headline}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-white/80 text-base md:text-lg max-w-sm mb-10 leading-relaxed font-medium"
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
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-purple-700 text-sm font-black hover:bg-yellow-300 hover:text-black transition-all duration-300 hover:scale-105 shadow-xl"
                                >
                                    {slide.cta.text}
                                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs">→</span>
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
                                <FlipCard front="HOT" back="PICK" delay={200} />
                                <FlipCard front="★★★" back="SALE" delay={400} />
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? 'w-10 bg-white' : 'w-2 bg-white/40'}`}
                    />
                ))}
            </div>

            <motion.div style={{ opacity: fadeOut }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <span className="text-white/50 text-[10px] tracking-[0.2em] uppercase">Scroll to Discover</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <FiArrowDown className="text-white/50 text-lg" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroPage4;
