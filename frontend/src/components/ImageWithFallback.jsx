import { useState, useEffect } from 'react';
import { imageUrl } from '../utils/urls';

const ImageWithFallback = ({ src, alt, className, ...props }) => {
    // Normalization logic: handled by parent or passed as 'src'. 
    // If 'src' is missing, we immediately fallback.
    const [imgSrc, setImgSrc] = useState(src || '/images/placeholder.svg');
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src || '/images/placeholder.svg');
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc('/images/placeholder.svg');
        }
    };

    return (
        <img
            {...props}
            src={imageUrl(imgSrc)}
            alt={alt || 'Product image'}
            className={`${className} ${hasError ? 'object-contain p-4 bg-gray-50' : ''}`}
            onError={handleError}
            loading="lazy"
        />
    );
};

export default ImageWithFallback;
