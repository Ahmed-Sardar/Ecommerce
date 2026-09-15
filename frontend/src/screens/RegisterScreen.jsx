import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash, FaCheck, FaTimes, FaUser, FaEnvelope, FaLock, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import '../styles/auth-animations.css';

const RegisterScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [errors, setErrors] = useState({});
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    // Password strength calculation
    useEffect(() => {
        const calculateStrength = (password) => {
            let strength = 0;
            if (password.length >= 8) strength += 25;
            if (/[a-z]/.test(password)) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 25;
            return strength;
        };
        setPasswordStrength(calculateStrength(formData.password));
    }, [formData.password]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear errors when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'Name is required';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        } else if (step === 2) {
            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
            else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(2);
        }
    };

    const prevStep = () => {
        setCurrentStep(1);
        setErrors({});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateStep(2)) return;
        
        try {
            const res = await register({ 
                name: formData.name, 
                email: formData.email, 
                password: formData.password 
            }).unwrap();
            setRegisterSuccess(true);
            setShowConfetti(true);
            setTimeout(() => {
                dispatch(setCredentials(res));
                navigate(redirect);
            }, 2500);
        } catch (err) {
            setErrors({ general: err?.data?.message || err.error });
            toast.error(err?.data?.message || err.error);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 50) return 'from-red-500 to-red-600';
        if (passwordStrength < 75) return 'from-yellow-500 to-orange-500';
        return 'from-green-500 to-emerald-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength < 25) return 'Very Weak';
        if (passwordStrength < 50) return 'Weak';
        if (passwordStrength < 75) return 'Good';
        return 'Strong';
    };

    // Confetti particles component
    const ConfettiParticle = ({ delay }) => (
        <motion.div
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
            initial={{ 
                opacity: 0, 
                y: 0, 
                x: Math.random() * 400 - 200,
                rotate: 0 
            }}
            animate={{ 
                opacity: [0, 1, 0], 
                y: [0, -100, -200], 
                rotate: 360 
            }}
            transition={{ 
                duration: 2, 
                delay: delay,
                ease: "easeOut" 
            }}
        />
    );

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
                {registerSuccess && (
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
                            className="bg-white rounded-full p-8 shadow-2xl relative pointer-events-none"
                        >
                            <motion.div
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <FaCheck className="text-6xl text-green-500" />
                            </motion.div>
                            
                            {/* Subtle Confetti - No pointer events */}
                            {showConfetti && Array.from({ length: 12 }).map((_, i) => (
                                <ConfettiParticle key={i} delay={i * 0.1} />
                            ))}
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute bottom-1/3 text-center pointer-events-none"
                        >
                            <h3 className="text-2xl font-bold text-white mb-2">Welcome aboard!</h3>
                            <p className="text-white/80">Redirecting you in a moment...</p>
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
                    
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-white/70">Join us and start your journey</p>
                        
                        {/* Step Indicator */}
                        <div className="flex justify-center mt-6 space-x-2">
                            <motion.div
                                className={`w-8 h-2 rounded-full transition-all duration-300 ${
                                    currentStep >= 1 ? 'bg-blue-400' : 'bg-white/20'
                                }`}
                                animate={{ scaleX: currentStep >= 1 ? 1 : 0.5 }}
                            />
                            <motion.div
                                className={`w-8 h-2 rounded-full transition-all duration-300 ${
                                    currentStep >= 2 ? 'bg-blue-400' : 'bg-white/20'
                                }`}
                                animate={{ scaleX: currentStep >= 2 ? 1 : 0.5 }}
                            />
                        </div>
                    </motion.div>

                    {/* Social Login Buttons - Only on Step 1, ensure full interactivity */}
                    {currentStep === 1 && (
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

                            {/* Divider */}
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="relative my-6"
                            >
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-transparent text-white/70">or continue with email</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Multi-Step Form - Ensure all forms are interactive */}
                    <AnimatePresence mode="wait">
                        <motion.form
                            key={currentStep}
                            initial={{ opacity: 0, x: currentStep === 2 ? 50 : -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: currentStep === 2 ? -50 : 50 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); nextStep(); } : submitHandler}
                            className="space-y-6 pointer-events-auto"
                        >
                            {currentStep === 1 ? (
                                <>
                                    {/* Name Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.6 }}
                                        className="relative"
                                    >
                                        <motion.input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField('')}
                                            className={`w-full bg-white/5 border-2 rounded-xl py-4 px-4 pl-12 text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                                                errors.name ? 'border-red-400' : 
                                                focusedField === 'name' ? 'border-blue-400 shadow-lg shadow-blue-400/25' : 'border-white/20'
                                            }`}
                                            placeholder="Full Name"
                                            animate={errors.name ? { x: [-10, 10, -10, 10, 0] } : {}}
                                            transition={{ duration: 0.4 }}
                                        />
                                        <FaUser className="absolute left-4 top-4 text-white/70" />
                                        <motion.label
                                            className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                                                focusedField === 'name' || formData.name ? 
                                                'top-2 text-xs text-blue-400' : 
                                                'top-4 text-base text-white/70'
                                            }`}
                                            animate={{
                                                y: focusedField === 'name' || formData.name ? -8 : 0,
                                                scale: focusedField === 'name' || formData.name ? 0.85 : 1,
                                            }}
                                        >
                                            Full Name
                                        </motion.label>
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: focusedField === 'name' ? '100%' : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        {/* Error message */}
                                        <AnimatePresence>
                                            {errors.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                                    className="absolute -bottom-6 left-0 text-red-400 text-xs font-medium"
                                                >
                                                    {errors.name}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Email Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="relative"
                                    >
                                        <motion.input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField('')}
                                            className={`w-full bg-white/5 border-2 rounded-xl py-4 px-4 pl-12 text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                                                errors.email ? 'border-red-400' : 
                                                focusedField === 'email' ? 'border-blue-400 shadow-lg shadow-blue-400/25' : 'border-white/20'
                                            }`}
                                            placeholder="Email Address"
                                            animate={errors.email ? { x: [-10, 10, -10, 10, 0] } : {}}
                                            transition={{ duration: 0.4 }}
                                        />
                                        <FaEnvelope className="absolute left-4 top-4 text-white/70" />
                                        <motion.label
                                            className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                                                focusedField === 'email' || formData.email ? 
                                                'top-2 text-xs text-blue-400' : 
                                                'top-4 text-base text-white/70'
                                            }`}
                                            animate={{
                                                y: focusedField === 'email' || formData.email ? -8 : 0,
                                                scale: focusedField === 'email' || formData.email ? 0.85 : 1,
                                            }}
                                        >
                                            Email Address
                                        </motion.label>
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: focusedField === 'email' ? '100%' : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        {/* Error message */}
                                        <AnimatePresence>
                                            {errors.email && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                                    className="absolute -bottom-6 left-0 text-red-400 text-xs font-medium"
                                                >
                                                    {errors.email}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Next Button - Ensure clickability */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 pointer-events-auto cursor-pointer"
                                    >
                                        <span>Continue</span>
                                        <FaArrowRight className="text-sm" />
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    {/* Password Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.6 }}
                                        className="relative"
                                    >
                                        <motion.input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField('')}
                                            className={`w-full bg-white/5 border-2 rounded-xl py-4 px-4 pl-12 pr-12 text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                                                errors.password ? 'border-red-400' : 
                                                focusedField === 'password' ? 'border-blue-400 shadow-lg shadow-blue-400/25' : 'border-white/20'
                                            }`}
                                            placeholder="Password"
                                            animate={errors.password ? { x: [-10, 10, -10, 10, 0] } : {}}
                                            transition={{ duration: 0.4 }}
                                        />
                                        <FaLock className="absolute left-4 top-4 text-white/70" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                        <motion.label
                                            className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                                                focusedField === 'password' || formData.password ? 
                                                'top-2 text-xs text-blue-400' : 
                                                'top-4 text-base text-white/70'
                                            }`}
                                            animate={{
                                                y: focusedField === 'password' || formData.password ? -8 : 0,
                                                scale: focusedField === 'password' || formData.password ? 0.85 : 1,
                                            }}
                                        >
                                            Password
                                        </motion.label>
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: focusedField === 'password' ? '100%' : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        
                                        {/* Error message */}
                                        <AnimatePresence>
                                            {errors.password && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                                    className="absolute -bottom-6 left-0 text-red-400 text-xs font-medium"
                                                >
                                                    {errors.password}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        
                                        {/* Password Strength Meter */}
                                        {formData.password && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2"
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-white/70">Password Strength</span>
                                                    <span className={`text-xs font-medium ${
                                                        passwordStrength < 50 ? 'text-red-400' :
                                                        passwordStrength < 75 ? 'text-yellow-400' : 'text-green-400'
                                                    }`}>
                                                        {getPasswordStrengthText()}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-2">
                                                    <motion.div
                                                        className={`h-2 rounded-full bg-gradient-to-r ${getPasswordStrengthColor()}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${passwordStrength}%` }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    {/* Confirm Password Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="relative"
                                    >
                                        <motion.input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            onFocus={() => setFocusedField('confirmPassword')}
                                            onBlur={() => setFocusedField('')}
                                            className={`w-full bg-white/5 border-2 rounded-xl py-4 px-4 pl-12 pr-12 text-white placeholder-transparent focus:outline-none transition-all duration-300 ${
                                                errors.confirmPassword ? 'border-red-400' : 
                                                focusedField === 'confirmPassword' ? 'border-blue-400 shadow-lg shadow-blue-400/25' : 'border-white/20'
                                            }`}
                                            placeholder="Confirm Password"
                                            animate={errors.confirmPassword ? { x: [-10, 10, -10, 10, 0] } : {}}
                                            transition={{ duration: 0.4 }}
                                        />
                                        <FaLock className="absolute left-4 top-4 text-white/70" />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                        <motion.label
                                            className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                                                focusedField === 'confirmPassword' || formData.confirmPassword ? 
                                                'top-2 text-xs text-blue-400' : 
                                                'top-4 text-base text-white/70'
                                            }`}
                                            animate={{
                                                y: focusedField === 'confirmPassword' || formData.confirmPassword ? -8 : 0,
                                                scale: focusedField === 'confirmPassword' || formData.confirmPassword ? 0.85 : 1,
                                            }}
                                        >
                                            Confirm Password
                                        </motion.label>
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                                            initial={{ width: 0 }}
                                            animate={{ width: focusedField === 'confirmPassword' ? '100%' : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        
                                        {/* Password Match Indicator */}
                                        {formData.confirmPassword && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute right-16 top-4"
                                            >
                                                {formData.password === formData.confirmPassword ? (
                                                    <FaCheck className="text-green-400" />
                                                ) : (
                                                    <FaTimes className="text-red-400" />
                                                )}
                                            </motion.div>
                                        )}
                                        
                                        {/* Error message */}
                                        <AnimatePresence>
                                            {errors.confirmPassword && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                                    className="absolute -bottom-6 left-0 text-red-400 text-xs font-medium"
                                                >
                                                    {errors.confirmPassword}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Action Buttons - Ensure both are clickable */}
                                    <div className="flex space-x-4 pointer-events-auto">
                                        <motion.button
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.6 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 pointer-events-auto cursor-pointer"
                                        >
                                            <FaArrowLeft className="text-sm" />
                                            <span>Back</span>
                                        </motion.button>
                                        
                                        <motion.button
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4, duration: 0.6 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden pointer-events-auto cursor-pointer"
                                        >
                                            {isLoading ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                                                />
                                            ) : (
                                                'Create Account'
                                            )}
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </motion.form>
                    </AnimatePresence>

                    {/* Login Link - Ensure clickability */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-6 text-center pointer-events-auto"
                    >
                        <span className="text-white/70">Already have an account? </span>
                        <Link 
                            to={redirect ? `/login?redirect=${redirect}` : '/login'} 
                            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors pointer-events-auto cursor-pointer"
                        >
                            Sign In
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterScreen;
