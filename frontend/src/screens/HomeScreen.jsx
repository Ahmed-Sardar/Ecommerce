import { useParams } from 'react-router-dom';
import LandingPage from '../components/landing/LandingPage';
import CatalogPage from '../components/landing/CatalogPage';

const HomeScreen = () => {
    const { keyword, pageNumber } = useParams();
    return keyword || pageNumber ? <CatalogPage /> : <LandingPage />;
};

export default HomeScreen;
