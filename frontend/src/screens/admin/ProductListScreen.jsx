import { Link, useParams } from 'react-router-dom';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Paginate from '../../components/Paginate';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
    const { pageNumber } = useParams();

    const { data, isLoading, error, refetch } = useGetProductsQuery({
        pageNumber: pageNumber || 1,
    });

    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                refetch();
                toast.success('Product deleted');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct();
                refetch();
                toast.success('Sample product created');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Products</h1>
                <button
                    className="bg-gray-800 text-white px-4 py-2 rounded flex items-center hover:bg-gray-700"
                    onClick={createProductHandler}
                >
                    <FaPlus className="mr-2" />
                    Create Product
                </button>
            </div>

            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">ID</th>
                                    <th className="py-2 px-4 border-b text-left">NAME</th>
                                    <th className="py-2 px-4 border-b text-left">PRICE</th>
                                    <th className="py-2 px-4 border-b text-left">CATEGORY</th>
                                    <th className="py-2 px-4 border-b text-left">BRAND</th>
                                    <th className="py-2 px-4 border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="py-2 px-4 border-b">{product._id}</td>
                                        <td className="py-2 px-4 border-b">{product.name}</td>
                                        <td className="py-2 px-4 border-b">₹{product.price}</td>
                                        <td className="py-2 px-4 border-b">{product.category}</td>
                                        <td className="py-2 px-4 border-b">{product.brand}</td>
                                        <td className="py-2 px-4 border-b space-x-2">
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                                className="text-gray-600 hover:text-gray-900 mx-2"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => deleteHandler(product._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Paginate pages={data.pages} page={data.page} isAdmin={true} />
                </>
            )}
        </>
    );
};

export default ProductListScreen;
