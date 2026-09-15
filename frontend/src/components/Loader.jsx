import { Spinner } from 'react-bootstrap';

const Loader = () => {
    return (
        <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );
};

export default Loader;
