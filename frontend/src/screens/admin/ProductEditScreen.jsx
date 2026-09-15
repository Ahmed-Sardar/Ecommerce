import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    useGetProductDetailsQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const ProductEditScreen = () => {
    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductDetailsQuery(productId);

    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

    const [uploadProductImage, { isLoading: loadingUpload }] =
        useUploadProductImageMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
            }).unwrap();
            toast.success('Product updated');
            refetch();
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success('Image uploaded');
            setImage(res.image || res); // Handle if backend returns object or string
            // our uploadRoutes returns string path
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <Link to="/admin/productlist" className="text-gray-600 hover:text-gray-900 mb-4 inline-block">
                Go Back
            </Link>
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            {loadingUpdate && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            placeholder="Enter name"
                            className="w-full border rounded p-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Price</label>
                        <input
                            type="number"
                            placeholder="Enter price"
                            className="w-full border rounded p-2"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Image</label>
                        <input
                            type="text"
                            placeholder="Enter image url"
                            className="w-full border rounded p-2 mb-2"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                        <input
                            type="file"
                            className="w-full"
                            onChange={uploadFileHandler}
                            accept="image/*"
                        />
                        {loadingUpload && <Loader />}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Brand</label>
                        <input
                            type="text"
                            placeholder="Enter brand"
                            className="w-full border rounded p-2"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Count In Stock</label>
                        <input
                            type="number"
                            placeholder="Enter countInStock"
                            className="w-full border rounded p-2"
                            value={countInStock}
                            onChange={(e) => setCountInStock(Number(e.target.value))}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Category</label>
                        <input
                            type="text"
                            placeholder="Enter category"
                            className="w-full border rounded p-2"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            placeholder="Enter description"
                            className="w-full border rounded p-2"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
                    >
                        Update
                    </button>
                </form>
            )}
        </div>
    );
};

export default ProductEditScreen;
