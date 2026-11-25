import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Appliances', 'Kitchen', 'Accessories'
];

const SearchBox = ({ onNavigate }) => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef(null);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${encodeURIComponent(keyword.trim())}`);
            setShowSuggestions(false);
        } else {
            navigate('/');
        }
        onNavigate?.();
    };

    const suggestionHandler = (category) => {
        setKeyword(category);
        navigate(`/search/${encodeURIComponent(category)}`);
        setShowSuggestions(false);
        onNavigate?.();
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-lg">
            <form onSubmit={submitHandler} className="relative group">
                <input
                    type="text"
                    aria-label="Search products, brands and categories"
                    name="q"
                    onChange={(e) => setKeyword(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    value={keyword}
                    placeholder="Search for products, brands and more"
                    className="w-full py-2.5 pl-10 pr-4 text-sm bg-gray-100/50 border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300 placeholder-gray-400"
                    autoComplete="off"
                />
                <button type="submit" aria-label="Submit product search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <FiSearch className="text-lg" />
                </button>
            </form>

            <AnimatePresence>
                {showSuggestions && (
                    <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2"
                    >
                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Suggested Categories
                        </div>
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => suggestionHandler(category)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors flex items-center"
                            >
                                <span className="w-2 h-2 rounded-full bg-gray-300 mr-3"></span>
                                {category}
                            </button>
                        ))}
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBox;
