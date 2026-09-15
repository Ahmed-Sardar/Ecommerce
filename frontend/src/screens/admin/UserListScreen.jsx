import { Link } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaTrash, FaTimes, FaCheck, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserListScreen = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();

    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure')) {
            try {
                await deleteUser(id);
                refetch();
                toast.success('User deleted');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error}</Message>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">ID</th>
                                <th className="py-2 px-4 border-b text-left">NAME</th>
                                <th className="py-2 px-4 border-b text-left">EMAIL</th>
                                <th className="py-2 px-4 border-b text-left">ADMIN</th>
                                <th className="py-2 px-4 border-b"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="py-2 px-4 border-b">{user._id}</td>
                                    <td className="py-2 px-4 border-b">{user.name}</td>
                                    <td className="py-2 px-4 border-b">
                                        <a href={`mailto:${user.email}`} className="text-blue-600 underline">{user.email}</a>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {user.isAdmin ? (
                                            <FaCheck className="text-green-600" />
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b space-x-2">
                                        {/* Link to edit if we had edit user screen */}
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => deleteHandler(user._id)}
                                            disabled={user.isAdmin}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default UserListScreen;
