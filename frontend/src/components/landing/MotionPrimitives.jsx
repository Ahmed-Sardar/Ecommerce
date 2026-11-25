import { motion as Motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

export const Reveal = ({ children, className = '', delay = 0 }) => {
    const reduced = useReducedMotion();
    return <Motion.div className={className} initial={reduced ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduced ? 0 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
        {children}
    </Motion.div>;
};

export const MagneticLink = ({ children, to, href, className = '' }) => {
    const reduced = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 180, damping: 18 });
    const springY = useSpring(y, { stiffness: 180, damping: 18 });
    const move = (event) => {
        if (reduced || event.pointerType !== 'mouse') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - bounds.left - bounds.width / 2) * 0.08);
        y.set((event.clientY - bounds.top - bounds.height / 2) * 0.12);
    };
    const content = <>{children}<FiArrowUpRight aria-hidden="true" /></>;
    return <Motion.span className="luxe-magnetic" style={{ x: springX, y: springY }}
        onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }}>
        {to ? <Link className={`luxe-button ${className}`} to={to}>{content}</Link>
            : <a className={`luxe-button ${className}`} href={href}>{content}</a>}
    </Motion.span>;
};
