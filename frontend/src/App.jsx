import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop';
import './styles/landing.css';

const App = () => {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main-content" className={pathname === '/' ? 'luxe-main' : 'luxe-app-main container mx-auto px-4 pb-16 min-h-[calc(100vh-100px)]'}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
