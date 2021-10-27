import React, { useEffect } from 'react';

import useApiData from '../common/hooks/useApiData';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import mcconnell from './images/mcconnell.jpg';
import rickscott from './images/rickscott.jpg';

import wellsFargoImg from './images/wellsfargo.png';
import exxonImg from './images/exxon.png';

import { FeaturedSenator, FeaturedAsset } from './FeatureCards';
import Hero from './Hero';

export default function Home() {
  const featuredAssetOne = useApiData('/api/assets/2376'),
    featuredAssetTwo = useApiData('api/assets/2391'),
    featuredSenatorOne = useApiData('api/senators/124'),
    featuredSenatorTwo = useApiData('api/senators/135');

  return (
    <>
      <Hero />
      <Row className="mt-3 mb-5 justify-content-evenly">
        <h3 className="mb-3 text-center">
          Or explore these assets and senators:
        </h3>
        <FeaturedSenator senator={featuredSenatorOne} img={mcconnell} />
        <FeaturedSenator senator={featuredSenatorTwo} img={rickscott} />
        <FeaturedAsset asset={featuredAssetOne} img={wellsFargoImg} />
        <FeaturedAsset asset={featuredAssetTwo} img={exxonImg} />
      </Row>
    </>
  );
}
