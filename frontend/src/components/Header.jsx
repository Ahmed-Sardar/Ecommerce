import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { FiShoppingBag, FiUser, FiLogOut, FiMenu, FiX, FiSearch, FiArrowUpRight, FiChevronDown } from 'react-icons/fi';
import SearchBox from './SearchBox';

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const close = () => { setMobileMenuOpen(false); setSearchOpen(false); };
    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
            close();
        } catch (err) { console.error(err); }
    };
    const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
    return <header className={`luxe-header ${isScrolled ? 'is-scrolled' : ''}`} onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
        <a className="luxe-skip" href="#main-content">Skip to content</a>
        <div className="luxe-announcement"><span>A considered edit. An extraordinary everyday.</span><Link to="/page/1" onClick={close}>Discover the collection <FiArrowUpRight /></Link></div>
        <div className="luxe-nav">
            <Link to="/" className="luxe-brand" onClick={close} aria-label="LuxeStore home">Luxe<span>Store</span><sup>®</sup></Link>
            <nav className="luxe-desktop-nav" aria-label="Main navigation"><Link to="/page/1">The collection</Link><Link to="/#new-arrivals">New arrivals</Link><Link to="/#introduction">Our point of view</Link></nav>
            <div className="luxe-nav-actions">
                <button aria-label={searchOpen ? 'Close product search' : 'Search products'} aria-expanded={searchOpen} aria-controls="luxe-search-panel" onClick={() => { setSearchOpen(!searchOpen); setMobileMenuOpen(false); }}>{searchOpen ? <FiX /> : <FiSearch />}</button>
                <div className="luxe-desktop-account">{userInfo ? <details className="luxe-account-menu"><summary><FiUser /><span>{userInfo.name.split(' ')[0]}</span><FiChevronDown size={12} /></summary><nav aria-label="Account navigation"><Link to="/profile">My profile & orders</Link>{userInfo.isAdmin && <><Link to="/admin/productlist">Manage products</Link><Link to="/admin/userlist">Manage users</Link><Link to="/admin/orderlist">Manage orders</Link></>}<button onClick={logoutHandler}><FiLogOut /> Sign out</button></nav></details> : <Link to="/login" className="luxe-account-link"><FiUser /><span>Account</span></Link>}</div>
                <Link className="luxe-bag-link" to="/cart" onClick={close} aria-label={`Shopping bag, ${cartCount} items`}><FiShoppingBag /><span className="luxe-bag-label">Bag</span><span className="luxe-bag-count" aria-live="polite">{cartCount}</span></Link>
                <button className="luxe-menu-toggle" aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenuOpen} aria-controls="luxe-mobile-nav" onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setSearchOpen(false); }}>{mobileMenuOpen ? <FiX /> : <FiMenu />}</button>
            </div>
        </div>
        {searchOpen && <div className="luxe-search-panel" id="luxe-search-panel"><SearchBox onNavigate={close} /><button onClick={close} aria-label="Close search"><FiX /></button></div>}
        {mobileMenuOpen && <nav className="luxe-mobile-nav" id="luxe-mobile-nav" aria-label="Mobile navigation"><Link to="/page/1" onClick={close}>The collection <FiArrowUpRight /></Link><Link to="/#new-arrivals" onClick={close}>New arrivals <FiArrowUpRight /></Link><Link to="/#introduction" onClick={close}>Our point of view <FiArrowUpRight /></Link><Link to={userInfo ? '/profile' : '/login'} onClick={close}>{userInfo ? `Hi, ${userInfo.name} · Your account` : 'Sign in to your account'}<FiUser /></Link>{userInfo?.isAdmin && <><Link to="/admin/productlist" onClick={close}>Manage products</Link><Link to="/admin/userlist" onClick={close}>Manage users</Link><Link to="/admin/orderlist" onClick={close}>Manage orders</Link></>}{userInfo && <button onClick={logoutHandler}><FiLogOut /> Sign out</button>}</nav>}
    </header>;
};

export default Header;
