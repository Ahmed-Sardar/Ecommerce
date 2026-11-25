import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiArrowUp } from 'react-icons/fi';

const Footer = () => <footer className="luxe-footer">
    <div className="luxe-footer-main luxe-wrap"><div className="luxe-footer-brand"><Link to="/" className="luxe-brand">Luxe<span>Store</span><sup>®</sup></Link><p>Good things for the way you live.<br />Everyday. Exceptionally done.</p></div>
        <nav aria-label="Explore LuxeStore"><p className="luxe-eyebrow">TAKE A LOOK AROUND</p><Link to="/page/1">The collection <FiArrowUpRight /></Link><Link to="/#new-arrivals">New arrivals <FiArrowUpRight /></Link><Link to="/#favourites">The favourites <FiArrowUpRight /></Link></nav>
        <nav aria-label="Customer account"><p className="luxe-eyebrow">MAKE YOURSELF AT HOME</p><Link to="/profile">Your account <FiArrowUpRight /></Link><Link to="/cart">Your shopping bag <FiArrowUpRight /></Link><Link to="/profile">Your orders <FiArrowUpRight /></Link></nav>
        <a className="luxe-back-top" href="#main-content">Back to top <span><FiArrowUp /></span></a>
    </div><div className="luxe-footer-wordmark" aria-hidden="true">Everyday, elevated.</div>
    <div className="luxe-footer-bottom luxe-wrap"><span>© {new Date().getFullYear()} LuxeStore. All rights reserved.</span><span>Thoughtfully explored. Personally yours.</span><span>INR ₹ <span className="luxe-footer-divider">/</span> Razorpay</span></div>
</footer>;

export default Footer;
