import React from 'react';
import ElectronicCategory from './ElectronicCategory/ElectronicCategory';
import Grid from './Grid/Grid';

const Home = () => {
    return(
        <div className='space-y-10'>
            <ElectronicCategory />
            <section>
                <Grid/>
            </section>
        </div>
    )
}

export default Home;