import React from 'react';
import PageLayout from '../layouts/PageLayout';
import Roxik from '../components/Roxik/Roxik';
import './Home.scss';

const Home = () => (
  <PageLayout>
    <h1 className='site-title'>Babylon.js Roxik Sharikua</h1>
    <Roxik/>
  </PageLayout>
);

export default Home;
