import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowDown, FiSearch } from 'react-icons/fi';

const categoryMeta = {
    electronics: {
        bg: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2400&auto=format&fit=crop',
        overlay: 'from-[#060d1a] via-[#060d1a]/70 to-transparent',
        accent: '#7dd3fc',
        label: 'Electronics',
    },
    fashion: {
        bg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2400&auto=format&fit=crop',
        overlay: 'from-[#1a0a1a] via-[#2a1a2a]/70 to-transparent',
        accent: '#f9a8d4',
        label: 'Fashion',
    },
    home: {
        bg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2400&auto=format&fit=crop',
        overlay: 'from-[#1a1408] via-[#1a1408]/70 to-transparent',
        accent: '#fcd34d',
        label: 'Home',
    },
    beauty: {
        bg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2400&auto=format&fit=crop',
        overlay: 'from-[#1a0d0a] via-[#2a1a14]/70 to-transparent',
        accent: '#d4a574',
        label: 'Beauty',
    },
    sports: {
        bg: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2400&auto=format&fit=crop',
        overlay: 'from-[#0a0a0a] via-black/70 to-transparent',
        accent: '#fbbf24',
        label: 'Sports',
    },
    appliances: {
        bg: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2400&auto=format&fit=crop',
        overlay: 'from-[#0d1a2a] via-[#0d1a2a]/70 to-transparent',
        accent: '#6ee7b7',
        label: 'Appliances',
    },
    kitchen: {
        bg: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2400&auto=format&fit=crop',
        overlay: 'from-[#1a0d08] via-[#1a0d08]/70 to-transparent',
        accent: '#fb923c',
        label: 'Kitchen',
    },
    accessories: {
        bg: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?q=80&w=2400&auto=format&fit=crop',
        overlay: 'from-[#0a0a14] via-[#0a0a14]/70 to-transparent',
        accent: '#c084fc',
        label: 'Accessories',
    },
};

const defaultMeta = {
    bg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2400&auto=format&fit=crop',
    overlay: 'from-black via-black/70 to-transparent',
    accent: '#e5e7eb',
    label: null,
};

const HeroSearch = ({ keyword }) => {
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 600], [0, 160]);
    const textY = useTransform(scrollY, [0, 600], [0, -60]);
    const fadeOut = useTransform(scrollY, [0, 400], [1, 0]);

    const meta = categoryMeta[keyword?.toLowerCase()] || defaultMeta;

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* Background */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${meta.bg})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${meta.overlay}`} />
                <div className="absolute inset-0 bg-black/35" />
            </motion.div>

            {/* Content */}
            <motion.div style={{ y: textY, opacity: fadeOut }} className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-8 md:px-16 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex items-center gap-2 mb-5"
                        >
                            <FiSearch style={{ color: meta.accent }} className="text-lg" />
                            <span
                                className="text-xs font-semibold tracking-[0.3em] uppercase"
                                style={{ color: meta.accent }}
                            >
                                {meta.label ? meta.label : 'Search Results'}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.7 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.05] mb-6"
                        >
                            {meta.label || (
                                <>
                                    Results for<br />
                                    <span style={{ color: meta.accent }}>"{keyword}"</span>
                                </>
                            )}
                            {meta.label && (
                                <> <br /><span className="text-white/60 text-3xl md:text-4xl font-light">Collection</span></>
                            )}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-white/60 text-base md:text-lg max-w-sm leading-relaxed font-light"
                        >
                            {meta.label
                                ? `Explore our curated ${meta.label.toLowerCase()} collection. Scroll down to browse all products.`
                                : `Showing all products matching "${keyword}". Scroll down to see results.`
                            }
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll cue */}
            <motion.div style={{ opacity: fadeOut }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <span className="text-white/50 text-[10px] tracking-[0.2em] uppercase">Scroll to Discover</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <FiArrowDown className="text-white/50 text-lg" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroSearch;
