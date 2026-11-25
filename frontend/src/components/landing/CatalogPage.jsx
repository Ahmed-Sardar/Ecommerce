import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import { ProductSkeleton } from '../Skeleton';
import Paginate from '../Paginate';
import EditorialProductCard from './EditorialProductCard';

const CatalogPage = () => {
    const { keyword, pageNumber } = useParams();
    const { data, isFetching, error, refetch } = useGetProductsQuery({ keyword, pageNumber: pageNumber || 1 });
    return <div className="luxe-catalog">
        <Link className="luxe-text-link" to="/"><FiArrowLeft /> Back to the edit</Link>
        <header className="luxe-catalog-heading">
            <p className="luxe-eyebrow">THE LUXESTORE COLLECTION</p>
            <h1>{keyword ? <>Find your <em>{keyword}.</em></> : <>Good things, <em>all here.</em></>}</h1>
            <p>{keyword ? `Discover products matching “${keyword}”.` : 'The pieces for your everyday. Explore something that feels like you.'}</p>
        </header>
        {isFetching ? <div className="luxe-product-grid" aria-label="Loading products" aria-busy="true">{Array.from({ length: 8 }, (_, i) => <ProductSkeleton key={i} />)}</div>
            : error ? <div className="luxe-state" role="alert"><h2>We couldn’t load this collection.</h2><p>Please try again in a moment.</p><button className="luxe-button" onClick={refetch}>Try again</button></div>
                : !data?.products?.length ? <div className="luxe-state"><FiSearch size={32} /><h2>A little more exploring?</h2><p>No products matched this search. Try another word or browse the collection.</p><Link className="luxe-button" to="/page/1">Explore all products</Link></div>
                    : <><div className="luxe-collection-count"><span>{data.products.length} pieces on this page</span><span>Page {data.page} of {data.pages}</span></div><div className="luxe-product-grid">{data.products.map((product) => <EditorialProductCard product={product} key={product._id} />)}</div>
                        <Paginate pages={data.pages} page={data.page} keyword={keyword || ''} /></>}
    </div>;
};

export default CatalogPage;
