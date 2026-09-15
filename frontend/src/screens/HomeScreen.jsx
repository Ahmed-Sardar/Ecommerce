import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Hero from '../components/Hero';
import HeroPage2 from '../components/HeroPage2';
import HeroPage3 from '../components/HeroPage3';
import HeroPage4 from '../components/HeroPage4';
import HeroPage5 from '../components/HeroPage5';
import HeroSearch from '../components/HeroSearch';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();
    const currentPage = parseInt(pageNumber) || 1;

    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber: pageNumber || 1,
    });

    // ── Product grid — plain divs, zero animation, always visible ────────────
    const renderProducts = () => {
        if (!data?.products) return null;
        const products = data.products;

        if (currentPage === 1) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} pageType="luxe" />
                    ))}
                </div>
            );
        }
        if (currentPage === 2) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} rounded={true} pageType="glassmorphic" />
                    ))}
                </div>
            );
        }
        if (currentPage === 3) {
            return (
                <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
                    {products.map((product) => (
                        <div key={product._id} className="break-inside-avoid">
                            <ProductCard product={product} pageType="browse-heavy" />
                        </div>
                    ))}
                </div>
            );
        }
        if (currentPage === 4) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} variant="horizontal" pageType="price-sensitive" />
                    ))}
                </div>
            );
        }
        if (currentPage === 5) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            className={index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
                            pageType="fashion"
                        />
                    ))}
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} pageType="luxe" />
                ))}
            </div>
        );
    };

    // ── Full-screen hero per page ─────────────────────────────────────────────
    const renderHero = () => {
        if (keyword)        return <HeroSearch keyword={keyword} />;
        if (currentPage === 2) return <HeroPage2 />;
        if (currentPage === 3) return <HeroPage3 />;
        if (currentPage === 4) return <HeroPage4 />;
        if (currentPage === 5) return <HeroPage5 />;
        return <Hero />;
    };

    return (
        <div className="min-h-screen pb-20">
            {/*
              Break out of App.jsx's <main className="container px-4 pt-24">
              so the hero covers the full viewport width and sits flush to top.
              -mt-24 cancels the pt-24; negative side margins + 100vw width
              cancel the container centering. body has overflow-x:hidden so
              no horizontal scroll is created.
            */}
            <div
                className="-mx-4 -mt-24"
                style={{
                    marginLeft: 'calc(-50vw + 50%)',
                    marginRight: 'calc(-50vw + 50%)',
                    width: '100vw',
                }}
            >
                {renderHero()}
            </div>

            {/* ── Products — shown after scroll ── */}
            <div className="container mx-auto px-6 py-16">

                {/* Back link — search results only */}
                {keyword && (
                    <Link
                        to="/"
                        className="inline-flex items-center text-secondary hover:text-primary mb-10 transition-colors"
                    >
                        ← Back to Collection
                    </Link>
                )}

                {/* Section heading */}
                {!keyword && (
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                            {currentPage === 1 ? 'Latest Arrivals' : `Page ${currentPage} Collection`}
                        </h2>
                        <div className="w-20 h-1 bg-accent mx-auto"></div>
                    </div>
                )}

                {/* States */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <Message variant="danger">
                        {error?.data?.message || error.error}
                    </Message>
                ) : data?.products?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-100 p-8 rounded-full mb-6">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found for &quot;{keyword}&quot;</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            We could not find any products matching your search. Try different keywords.
                        </p>
                        <Link to="/" className="btn-primary">View All Products</Link>
                    </div>
                ) : (
                    <>
                        {/* Products — plain div wrapper, no Framer Motion, no opacity tricks */}
                        <div>
                            {renderProducts()}
                        </div>

                        <div className="mt-16 flex justify-center">
                            <Paginate
                                pages={data.pages}
                                page={data.page}
                                keyword={keyword ? keyword : ''}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HomeScreen;
