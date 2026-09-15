import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { FiShoppingBag, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBox from './SearchBox';

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
            setMobileMenuOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Brand */}
                    <Link to="/" className="flex items-center space-x-2 z-50">
                        <span className={`text-2xl font-heading font-bold tracking-tight ${isScrolled ? 'text-primary' : 'text-primary'}`}>
                            Luxe<span className="text-secondary">Store</span>
                        </span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:block flex-1 max-w-xl mx-8">
                        <SearchBox />
                    </div>

                    {/* Desktop Actions */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {userInfo ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-sm font-medium hover:text-balck transition-colors">
                                    <FiUser className="text-xl" />
                                    <span>{userInfo.name.split(' ')[0]}</span>
                                </button>

                                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="glass bg-white/90 rounded-2xl shadow-xl p-4 min-w-[200px] border border-gray-100">
                                        <div className="flex flex-col space-y-2">
                                            <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 rounded-xl text-sm transition-colors">Profile</Link>
                                            {userInfo.isAdmin && (
                                                <>
                                                    <div className="h-px bg-gray-200 my-1 mx-2"></div>
                                                    <Link to="/admin/productlist" className="px-4 py-2 hover:bg-gray-100 rounded-xl text-sm transition-colors">Products</Link>
                                                    <Link to="/admin/userlist" className="px-4 py-2 hover:bg-gray-100 rounded-xl text-sm transition-colors">Users</Link>
                                                    <Link to="/admin/orderlist" className="px-4 py-2 hover:bg-gray-100 rounded-xl text-sm transition-colors">Orders</Link>
                                                </>
                                            )}
                                            <div className="h-px bg-gray-200 my-1 mx-2"></div>
                                            <button onClick={logoutHandler} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm transition-colors flex items-center">
                                                <FiLogOut className="mr-2" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-medium hover:text-black transition-colors">
                                Sign In
                            </Link>
                        )}

                        <Link to="/cart" className="relative group">
                            <FiShoppingBag className="text-2xl text-primary transition-transform group-hover:scale-110" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden z-50 p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 right-0 bg-white shadow-xl md:hidden border-t border-gray-100"
                        >
                            <div className="p-6 flex flex-col space-y-4">
                                <SearchBox />
                                {userInfo ? (
                                    <>
                                        <div className="font-heading font-semibold text-lg pb-2 border-b">Hi, {userInfo.name}</div>
                                        <Link to="/profile" className="py-2" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                                        {userInfo.isAdmin && (
                                            <>
                                                <Link to="/admin/productlist" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                                            </>
                                        )}
                                        <button onClick={logoutHandler} className="text-left text-red-500 py-2">Logout</button>
                                    </>
                                ) : (
                                    <Link to="/login" className="py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Spacer for fixed header */}
            <div className="h-20"></div>
        </>
    );
};

export default Header;
