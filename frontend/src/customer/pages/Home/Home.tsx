import { lazy, Suspense } from 'react';
import ElectronicCategory from './ElectronicCategory/ElectronicCategory';
import Grid from './Grid/Grid';
import { Button } from '@mui/material';
import { Storefront } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { SoftPageBackground } from '../../../common/SoftPageBackground';
import { useInView } from '../../../common/useInView';
import { optimizeImageUrl } from '../../../util/image';
import { RouteLoader } from '../../../common/RouteLoader';

const Deal = lazy(() => import('./Deal/Deal'));
const HomeCategory = lazy(() => import('./HomeCategory/HomeCategoryard'));


const Home = () => {
    const navigate = useNavigate();
    const { ref: dealSectionRef, inView: shouldLoadDeals } = useInView<HTMLElement>({
        rootMargin: '280px 0px',
    });
    const { ref: categorySectionRef, inView: shouldLoadCategories } = useInView<HTMLElement>({
        rootMargin: '280px 0px',
    });

    return(
        <SoftPageBackground className='min-h-screen'>
            <div className='space-y-10'>
                <ElectronicCategory />
                <section>
                    <Grid/>
                </section>
                <section ref={dealSectionRef} className='pt-20'>
                    <h1 className='text-3xl font-black text-center pb-5'>Today's Deal</h1>
                    {shouldLoadDeals ? (
                        <Suspense fallback={<RouteLoader label="Loading deals..." />}>
                            <Deal/>
                        </Suspense>
                    ) : (
                        <RouteLoader label="Deals will load as you scroll..." />
                    )}
                </section>
                 
                 <section ref={categorySectionRef} className='pt-20'>
                    <h1 className='text-3xl font-black text-center pb-5'>Shop By Category</h1>
                    {shouldLoadCategories ? (
                        <Suspense fallback={<RouteLoader label="Loading categories..." />}>
                            <HomeCategory/>
                        </Suspense>
                    ) : (
                        <RouteLoader label="Categories will load as you scroll..." />
                    )}
                </section>

                <section className='lg:px-20 relative h-[200px] lg:h-[450px] object-cover pt-20'>
                    <img
                        src={optimizeImageUrl('https://static-assets-web.flixcart.com/fk-sp-static/images/prelogin/banner/Desktop_sell.webp', { width: 1440, quality: 75 })}
                        alt='Become a seller with Thok Bazar'
                        loading="lazy"
                        decoding="async"
                    />
                    <div className='absolute top-1/2 left-4 lg:left-[15rem] transform -translate-y-1/2 font-semibold lg:text-4xl space-y-3'><h1>Sell Your Product</h1>
                    <p className='text-lg md:text-2xl'>With <strong className='logo text-3xl md:text-5xl pl-2'>Thok-Bazar</strong></p>

                    <div className='pt-5 flex justify-center'>
                        <Button
                            startIcon={<Storefront/>}
                            variant='contained'
                            onClick={() => navigate('/become-seller')}
                        >
                            Become Seller
                        </Button>
                    </div>
                    </div>
                </section>

            </div>
        </SoftPageBackground>
    )
}

export default Home;
