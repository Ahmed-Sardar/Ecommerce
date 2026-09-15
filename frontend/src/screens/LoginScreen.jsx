import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import '../styles/auth-animations.css';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const res = await login({ email, password }).unwrap();
            setLoginSuccess(true);
            setTimeout(() => {
                dispatch(setCredentials(res));
                navigate(redirect);
            }, 1500);
        } catch (err) {
            setErrors({ general: err?.data?.message || err.error });
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        // Simulate password reset
        setResetSent(true);
        setTimeout(() => {
            setShowForgotPassword(false);
            setResetSent(false);
            setResetEmail('');
        }, 3000);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
            {/* Animated Gradient Background - Lowest z-index, no pointer events */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pointer-events-none" style={{ zIndex: 1 }}>
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse-slow pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)] animate-pulse-slow pointer-events-none"></div>
                {/* Additional floating orbs - No pointer events */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-3/4 left-1/3 w-20 h-20 bg-pink-500/10 rounded-full blur-xl animate-float pointer-events-none" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Success Animation Overlay - High z-index when active */}
            <AnimatePresence>
                {loginSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center pointer-events-none"
                        style={{ zIndex: 9999 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-white rounded-full p-8 shadow-2xl pointer-events-none"
                        >
                            <motion.div
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <FaCheck className="text-6xl text-green-500" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content - Interactive layer with high z-index */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-md w-full relative pointer-events-auto"
                style={{ zIndex: 100 }}
            >
                {/* Glassmorphism Card - Interactive container */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden pointer-events-auto">
                    {/* Subtle glow effect - Decorative only, no pointer events */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
                    
                    <AnimatePresence mode="wait">
                        {!showForgotPassword ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="pointer-events-auto"
                            >
                                {/* Header */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-center mb-8"
                                >
                                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                                    <p className="text-white/70">Sign in to your account</p>
                                </motion.div>

                                {/* Social Login Buttons - Ensure full interactivity */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="space-y-3 mb-6 pointer-events-auto"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(219, 68, 55, 0.1)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-white/5 hover:bg-red-500/10 border border-white/20 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 text-white transition-all duration-300 group social-button glass-hover pointer-events-auto cursor-pointer"
                                        type="button"
                                    >
                                        <motion.div
                                            whileHover={{ y: -2, rotate: [0, -10, 10, 0] }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <FaGoogle className="text-red-400 group-hover:text-red-300" />
                                        </motion.div>
                                        <span>Continue with Google</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(24, 119, 242, 0.1)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-white/5 hover:bg-blue-500/10 border border-white/20 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 text-white transition-all duration-300 group social-button glass-hover pointer-events-auto cursor-pointer"
                                        type="button"
                                    >
                                        <motion.div
                                            whileHover={{ y: -2, rotate: [0, -10, 10, 0] }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <FaFacebook className="text-blue-400 group-hover:text-blue-300" />
                                        </motion.div>
                                        <span>Continue with Facebook</span>
                                    </motion.button>
                                </motion.div>

                                {/* Divider */}
                                <motion.div
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="relative mb-6"
                                >
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/20"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-transparent text-white/70">or continue with email</span>
                                    </div>
                                </motion.div>

                                {/* Form - Ensure all inputs and buttons are interactive */}
                                <form onSubmit={submitHandler} className="space-y-6 pointer-events-auto">
                                    {/* Email Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                        className="relative"
                                    >
                                        <motion.input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setEmailFocused(true)}
                                            onBlur={() => setEmailFocused(false)}
                                            className={`w-full bg-white/5 border-2 rounded-xl py-4 px-4 text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                                                errors.email ? 'border-red-400 shadow-lg shadow-red-400/25' : 
                                                emailFocused ? 'border-blue-400 shadow-lg shadow-blue-400/25' : 'border-white/20'
                                            }`}
                                            placeholder="Email Address"
                                            animate={errors.email ? { x: [-10, 10, -10, 10, 0] } : {}}
                                            transition={{ duration: 0.4 }}
                                        />
                                        <motion.label
                                            className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                                                emailFocused || email ? 
                                                'top-2 text-xs text-blue-400' : 
                                                'top-4 text-base text-white/70'
                                            }`}
                                            animate={{
                                                y: emailFocused || email ? -8 : 0,
                                                scale: emailFocused || email ? 0.85 : 1,
                                            }}
                                        >
                                            Email Address
                                        </motion.label>
                                        {/* Animated underline */}
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: emailFocused ? '100%' : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        {/* Error message */}
                                        <AnimatePresence>
                                            {errors.email && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute -bottom-6 left-0 text-red-400 text-xs"
                                                >
                                                    {errors.email}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Password Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.6 }}
                                        className="relative"
                                    >
                                        <motion.input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setPasswordFocused(true)}
                                            onBlur={() => setPasswordFocused(false)}
                                            className={`w-full bg-white/5 border-2 rounded-xl py-4 px-4 pr-12 text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                                                errors.password ? 'border-red-400 shadow-lg shadow-red-400/25' : 
                                                passwordFocused ? 'border-blue-400 shadow-lg shadow-blue-400/25' : 'border-white/20'
                                            }`}
                                            placeholder="Password"
                                            animate={errors.password ? { x: [-10, 10, -10, 10, 0] } : {}}
                                            transition={{ duration: 0.4 }}
                                        />
                                        <motion.label
                                            className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                                                passwordFocused || password ? 
                                                'top-2 text-xs text-blue-400' : 
                                                'top-4 text-base text-white/70'
                                            }`}
                                            animate={{
                                                y: passwordFocused || password ? -8 : 0,
                                                scale: passwordFocused || password ? 0.85 : 1,
                                            }}
                                        >
                                            Password
                                        </motion.label>
                                        <motion.button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </motion.button>
                                        {/* Animated underline */}
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: passwordFocused ? '100%' : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        {/* Error message */}
                                        <AnimatePresence>
                                            {errors.password && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute -bottom-6 left-0 text-red-400 text-xs"
                                                >
                                                    {errors.password}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Forgot Password Link - Ensure clickability */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                        className="text-right pointer-events-auto"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors pointer-events-auto cursor-pointer"
                                        >
                                            Forgot Password?
                                        </button>
                                    </motion.div>

                                    {/* Submit Button - Ensure full clickability */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden pointer-events-auto cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                                            />
                                        ) : (
                                            'Sign In'
                                        )}
                                    </motion.button>
                                </form>

                                {/* Register Link - Ensure clickability */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.6 }}
                                    className="mt-6 text-center pointer-events-auto"
                                >
                                    <span className="text-white/70">Don't have an account? </span>
                                    <Link 
                                        to={redirect ? `/register?redirect=${redirect}` : '/register'} 
                                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors pointer-events-auto cursor-pointer"
                                    >
                                        Sign Up
                                    </Link>
                                </motion.div>
                            </motion.div>
                        ) : (
                            /* Forgot Password Form - Ensure full interactivity */
                            <motion.div
                                key="forgot"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.3 }}
                                className="pointer-events-auto"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                                    <p className="text-white/70">Enter your email to receive reset instructions</p>
                                </div>

                                {!resetSent ? (
                                    <form onSubmit={handleForgotPassword} className="space-y-6 pointer-events-auto">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1, duration: 0.6 }}
                                            className="relative"
                                        >
                                            <input
                                                type="email"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                className="w-full bg-white/5 border-2 border-white/20 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-blue-400 focus:shadow-lg focus:shadow-blue-400/25 transition-all duration-300 placeholder-white/50"
                                                placeholder="Enter your email address"
                                                required
                                            />
                                            <motion.div
                                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                                                initial={{ width: 0 }}
                                                animate={{ width: resetEmail ? '100%' : 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </motion.div>
                                        
                                        <motion.button
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.6 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl pointer-events-auto cursor-pointer"
                                        >
                                            Send Reset Link
                                        </motion.button>
                                    </form>
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center py-8"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring" }}
                                            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                                        >
                                            <FaCheck className="text-white text-2xl" />
                                        </motion.div>
                                        <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
                                        <p className="text-white/70">Check your inbox for reset instructions</p>
                                    </motion.div>
                                )}

                                <button
                                    onClick={() => setShowForgotPassword(false)}
                                    className="w-full mt-4 text-blue-400 hover:text-blue-300 transition-colors pointer-events-auto cursor-pointer"
                                >
                                    ← Back to Login
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginScreen;
