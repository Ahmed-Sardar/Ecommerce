import { createElement, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight, FiArrowRight, FiCreditCard, FiUser, FiEye, FiStar } from 'react-icons/fi';
import { useGetProductsQuery, useGetTopProductsQuery } from '../../slices/productsApiSlice';
import { ProductSkeleton } from '../Skeleton';
import { MagneticLink, Reveal } from './MotionPrimitives';
import { useDesktopMotion } from './useDesktopMotion';
import EditorialProductCard from './EditorialProductCard';
import LandingHero from './LandingHero';
import ProductStory from './ProductStory';
import ArrivalGallery from './ArrivalGallery';
import { productImage, searchPath, uniqueProducts } from './catalogUtils';

const choose = (products, pattern) => products.find((product) => pattern.test(product.name)) || products[0];

const CategoryTile = ({ product, category, title, className }) => <Link to={searchPath(category)} className={`luxe-category ${className}`}>
    <img src={productImage(product.image, 1000)} alt={product.name} loading="lazy" decoding="async"
        onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/placeholder.svg'; }} />
    <span className="luxe-category-overlay" />
    <div className="luxe-category-top"><span>{category === 'Furniture' ? 'LIVING' : category.toUpperCase()}</span><FiArrowUpRight /></div>
    <div className="luxe-category-bottom"><h3>{title}</h3><span>Explore {category === 'Furniture' ? 'home & living' : category.toLowerCase()} <FiArrowRight /></span></div>
</Link>;

const Campaign = ({ product }) => {
    const ref = useRef(null);
    const desktop = useDesktopMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.86, 1, 1]);
    const imageY = useTransform(scrollYProgress, [0, 1], [-35, 35]);
    return <section className="luxe-campaign-section" ref={ref}>
        <Motion.div className="luxe-campaign" style={desktop ? { scale } : undefined}>
            <Motion.img src={productImage(product.image, 1800)} alt={product.name} loading="lazy" decoding="async" style={desktop ? { y: imageY } : undefined}
                onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/placeholder.svg'; }} />
            <div className="luxe-campaign-shade" /><div className="luxe-campaign-copy"><p className="luxe-eyebrow">THE ART OF FEELING AT HOME</p>
                <h2>Make space for<br />a little more <em>you.</em></h2><p>Your corner of the world. Make it a good one.</p>
                <MagneticLink to={searchPath(product.category)} className="luxe-button-light">Explore home & living</MagneticLink></div>
            <span className="luxe-campaign-caption">A DIFFERENT KIND OF EVERYDAY</span>
        </Motion.div>
    </section>;
};

const LandingPage = () => {
    const [filter, setFilter] = useState('All discoveries');
    const reduced = useReducedMotion();
    const latest = useGetProductsQuery({ pageNumber: 1 });
    const top = useGetTopProductsQuery();
    const headphones = useGetProductsQuery({ keyword: 'headphones', pageNumber: 1 });
    const fashion = useGetProductsQuery({ keyword: 'Fashion', pageNumber: 1 });
    const electronics = useGetProductsQuery({ keyword: 'Electronics', pageNumber: 1 });
    const furniture = useGetProductsQuery({ keyword: 'Furniture', pageNumber: 1 });
    const beauty = useGetProductsQuery({ keyword: 'Beauty', pageNumber: 1 });
    const queries = [latest, top, headphones, fashion, electronics, furniture, beauty];
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
    const all = uniqueProducts(latest.data?.products || [], top.data || [], fashion.data?.products || [], electronics.data?.products || [], furniture.data?.products || [], beauty.data?.products || [], headphones.data?.products || []);
    const heroProduct = headphones.data?.products?.[0] || top.data?.[0] || latest.data?.products?.[0];
    const homeProduct = choose(furniture.data?.products || [], /sofa/i);
    const categories = [
        { category: 'Furniture', product: choose(furniture.data?.products || [], /armchair/i), title: 'A space for you.', className: 'luxe-category-living' },
        { category: 'Fashion', product: choose(fashion.data?.products || [], /leather.*watch|leather.*bag/i), title: 'Wear your story.', className: 'luxe-category-fashion' },
        { category: 'Electronics', product: choose(electronics.data?.products || [], /headphones/i), title: 'Tune into better.', className: 'luxe-category-tech' },
        { category: 'Beauty', product: choose(beauty.data?.products || [], /serum/i), title: 'Your daily ritual.', className: 'luxe-category-beauty' },
    ].filter((category) => category.product);
    const filters = ['All discoveries', ...new Set(all.map((product) => product.category).filter(Boolean))];
    const favourites = all.filter((product) => filter === 'All discoveries' || product.category === filter)
        .sort((a, b) => b.rating - a.rating || b.numReviews - a.numReviews).slice(0, 4);
    const arrivals = latest.data?.products?.slice(0, 6) || [];
    const reviews = all.flatMap((product) => (product.reviews || []).filter((review) => review.comment && review.name).map((review) => ({ ...review, product }))).slice(0, 3);
    const loading = queries.some((query) => query.isLoading);
    const failed = queries.every((query) => query.isError);
    const retry = () => queries.forEach((query) => query.refetch());
    return <div className="luxe-landing">
        {!reduced && <Motion.div className="luxe-scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />}
        <LandingHero product={heroProduct} loading={loading && !heroProduct} />
        <div className="luxe-ticker" aria-label="Style, spaces, sound and everyday rituals"><span>STYLE WITH SUBSTANCE</span><span aria-hidden="true">✳</span><span>SPACES WITH SOUL</span><span aria-hidden="true">✳</span><span>SOUND THAT MOVES YOU</span><span aria-hidden="true">✳</span><span>EVERYDAY, ELEVATED</span><span aria-hidden="true">✳</span></div>
        <section className="luxe-introduction luxe-wrap" id="introduction">
            <Reveal><p className="luxe-eyebrow">LESS NOISE.<br />MORE YOU.</p><span className="luxe-intro-symbol" aria-hidden="true">✳</span></Reveal>
            <Reveal><h2>Life happens in the everyday.<br />We’re here to make it<br /><em>anything but ordinary.</em></h2>
                <div className="luxe-intro-bottom"><span>THE LUXESTORE POINT OF VIEW</span><p>The perfect pair. Your favourite corner. A soundtrack to get lost in. Discover the pieces that make the little things feel like something more.</p></div></Reveal>
        </section>
        <section className="luxe-collections luxe-wrap" id="collections" aria-labelledby="collections-title">
            <Reveal className="luxe-section-heading"><div><p className="luxe-eyebrow">A WORLD TO MAKE YOUR OWN</p><h2 id="collections-title">Find your <em>kind of good.</em></h2></div><Link to="/page/1" className="luxe-text-link">Explore everything <FiArrowUpRight /></Link></Reveal>
            {categories.length > 0 ? <div className="luxe-category-grid">{categories.map((category, i) => <Reveal className={category.className} delay={i * 0.07} key={category.category}><CategoryTile {...category} /></Reveal>)}</div>
                : loading ? <div className="luxe-category-loading" aria-busy="true" aria-label="Loading collections" />
                    : <div className="luxe-state" role={failed ? 'alert' : 'status'}><h3>{failed ? 'Our collection is taking a moment.' : 'Something good is on its way.'}</h3><p>{failed ? 'Please try loading the collection again.' : 'Check back soon for new discoveries.'}</p>{failed && <button className="luxe-button" onClick={retry}>Try again</button>}</div>}
        </section>
        <section className="luxe-favourites luxe-wrap" id="favourites" aria-labelledby="favourites-title">
            <Reveal className="luxe-section-heading"><div><p className="luxe-eyebrow">GOOD TASTE. GREAT COMPANY.</p><h2 id="favourites-title">Meet the <em>favourites.</em></h2></div><p className="luxe-heading-note">A few things worth getting to know.<br />Ordered by your product ratings.</p></Reveal>
            {all.length > 0 && <div className="luxe-filter-row" role="group" aria-label="Filter favourite products">{filters.map((category) => <button key={category} onClick={() => setFilter(category)} aria-pressed={filter === category} className={filter === category ? 'is-active' : ''}>{category === 'Furniture' ? 'Home & living' : category}</button>)}</div>}
            {favourites.length ? <div className="luxe-product-grid">{favourites.map((product, i) => <Reveal key={product._id} delay={i * 0.06}><EditorialProductCard product={product} /></Reveal>)}</div>
                : loading ? <div className="luxe-product-grid" aria-busy="true" aria-label="Loading favourites">{Array.from({ length: 4 }, (_, i) => <ProductSkeleton key={i} />)}</div>
                    : <div className="luxe-state"><p>More favourites are waiting to be discovered.</p><Link className="luxe-text-link" to="/page/1">Browse the collection <FiArrowUpRight /></Link></div>}
            {all.length > 0 && <div className="luxe-section-end"><MagneticLink to="/page/1" className="luxe-button-outline">Find your next favourite</MagneticLink></div>}
        </section>
        {heroProduct && <ProductStory product={heroProduct} />}
        {arrivals.length > 0 && <ArrivalGallery products={arrivals} />}
        {latest.isError && <div className="luxe-state" role="alert"><h2>New arrivals are taking a moment.</h2><button className="luxe-button" onClick={latest.refetch}>Reload new arrivals</button></div>}
        {homeProduct && <Campaign product={homeProduct} />}
        <section className="luxe-values luxe-wrap" aria-labelledby="values-title"><Reveal className="luxe-section-heading"><div><p className="luxe-eyebrow">THE LITTLE THINGS MATTER</p><h2 id="values-title">Considered, <em>from click one.</em></h2></div></Reveal>
            <div className="luxe-values-grid">{[
                { Icon: FiEye, title: 'The full picture.', text: 'Product details, stock availability and customer ratings. Get to know your next find before it’s yours.', link: '/page/1', cta: 'Explore the collection' },
                { Icon: FiCreditCard, title: 'Checkout your way.', text: 'Choose from the payment methods available at checkout. Your bag is ready whenever you are.', link: '/cart', cta: 'Visit your bag' },
                { Icon: FiUser, title: 'A space of your own.', text: 'Your profile, your order history, your everyday essentials. Keep it all together in your account.', link: '/profile', cta: 'Your account' },
            ].map(({ Icon, title, text, link, cta }, i) => <Reveal key={title} delay={i * 0.08}>{createElement(Icon, { className: 'luxe-value-icon' })}<h3>{title}</h3><p>{text}</p><Link className="luxe-text-link" to={link}>{cta}<FiArrowUpRight /></Link></Reveal>)}</div>
        </section>
        {reviews.length > 0 && <section className="luxe-reviews luxe-wrap" aria-labelledby="reviews-title"><Reveal><p className="luxe-eyebrow">IN YOUR WORDS</p><h2 id="reviews-title">Good finds. <em>Real stories.</em></h2></Reveal><div className="luxe-review-grid">{reviews.map((review, i) => <Reveal key={review._id || `${review.product._id}-${i}`}><figure><div className="luxe-review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }, (_, j) => <FiStar key={j} />)}</div><blockquote>“{review.comment}”</blockquote><figcaption><strong>{review.name}</strong><Link to={`/product/${review.product._id}`}>{review.product.name} <FiArrowUpRight /></Link></figcaption></figure></Reveal>)}</div></section>}
        <section className="luxe-invitation luxe-wrap"><Reveal><p className="luxe-eyebrow">YOUR EVERYDAY STARTS HERE</p><h2>Good things<br />are <em>waiting.</em><span aria-hidden="true">✳</span></h2><div><p>Follow your curiosity.<br />Find something that feels like you.</p><MagneticLink to="/page/1">Explore LuxeStore</MagneticLink></div></Reveal></section>
    </div>;
};

export default LandingPage;
