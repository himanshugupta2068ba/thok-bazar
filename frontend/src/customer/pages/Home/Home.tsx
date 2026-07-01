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
const HomeProducts = lazy(() => import('./HomeProducts'));


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

                {shouldLoadCategories ? (
                    <Suspense fallback={<RouteLoader label="Loading products..." />}>
                        <HomeProducts/>
                    </Suspense>
                ) : null}

                <section className='px-4 pt-12 sm:px-6 sm:pt-16 lg:px-20'>
                    <div className='overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm'>
                        <div className='grid gap-5 bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_48%,#fff7ed_100%)] p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)] lg:items-center lg:p-10'>
                            <div className='max-w-xl'>
                                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-teal-700'>Seller Program</p>
                                <h2 className='mt-3 text-xl font-black text-slate-900 sm:text-4xl'>
                                    Grow with GrowLine
                                </h2>
                                <p className='mt-4 text-sm leading-7 text-slate-600 sm:text-base'>
                                    Reach wholesale buyers faster, manage your catalog in one place, and start growing your business with a cleaner seller flow.
                                </p>
                                <div className='mt-6'>
                                    <Button
                                        startIcon={<Storefront/>}
                                        variant='contained'
                                        className='w-full sm:w-auto'
                                        onClick={() => navigate('/become-seller')}
                                        sx={{
                                            borderRadius: "999px",
                                            px: 3,
                                            py: 1.2,
                                            textTransform: "none",
                                            fontWeight: 700,
                                            boxShadow: "none",
                                        }}
                                    >
                                        Grow on GrowLine
                                    </Button>
                                </div>
                            </div>

                            <div className='overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]'>
                                <img
                                    className='h-45 w-full object-cover sm:h-70 lg:h-90'
                                    src={optimizeImageUrl('https://static-assets-web.flixcart.com/fk-sp-static/images/prelogin/banner/Desktop_sell.webp', { width: 1440, quality: 75 })}
                                    alt='Become a seller with GrowLine'
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </SoftPageBackground>
    )
}

export default Home;
