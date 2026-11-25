import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiCheck, FiStar, FiArrowUpRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { addToCart } from '../../slices/cartSlice';
import { money, productImage } from './catalogUtils';

const EditorialProductCard = ({ product, number }) => {
    const dispatch = useDispatch();
    const quantity = useSelector((state) => state.cart.cartItems.find((item) => item._id === product._id)?.qty || 0);
    const soldOut = product.countInStock <= 0;
    const atLimit = quantity >= product.countInStock;
    const secondary = product.images?.find((image) => image !== product.image);
    const add = () => {
        if (soldOut || atLimit) return;
        dispatch(addToCart({ ...product, qty: quantity + 1 }));
        toast.success(`${product.name} added to your bag`, { autoClose: 2200 });
    };
    return <article className="luxe-product">
        <div className="luxe-product-visual">
            <span className="luxe-product-index">{number ? String(number).padStart(2, '0') : product.brand}</span>
            {soldOut && <span className="luxe-stock-label">Sold out</span>}
            <Link to={`/product/${product._id}`} className="luxe-product-image" aria-label={`View ${product.name}`}>
                <img src={productImage(product.image, 700)} alt={product.name} loading="lazy" decoding="async"
                    onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/placeholder.svg'; }} />
                {secondary && <img className="luxe-secondary-image" src={productImage(secondary, 700)} alt="" loading="lazy" decoding="async"
                    onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
            </Link>
            <button type="button" className={`luxe-add ${quantity ? 'has-product' : ''}`} onClick={add}
                disabled={soldOut || atLimit} aria-label={soldOut ? `${product.name} is sold out` : atLimit ? `All available ${product.name} are in your bag` : `Add ${product.name} to bag`}>
                <span>{soldOut ? 'Sold out' : atLimit ? 'In your bag' : 'Add to bag'}</span>
                {quantity ? <FiCheck aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
            </button>
        </div>
        <div className="luxe-product-meta"><span>{product.category}</span>
            {product.numReviews > 0 && <span className="luxe-product-rating"><FiStar aria-hidden="true" /> {product.rating.toFixed(1)} <span>({product.numReviews})</span></span>}
        </div>
        <Link className="luxe-product-name" to={`/product/${product._id}`}><h3>{product.name}</h3><FiArrowUpRight aria-hidden="true" /></Link>
        <p className="luxe-price">{money(product.price)}
            {product.originalPrice > product.price && <del>{money(product.originalPrice)}</del>}
        </p>
    </article>;
};

export default EditorialProductCard;
