import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Stats from './Stats';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [assetInfo, setAssetInfo] = useState({});

  useEffect(() => {
    // fetch asset info from django db
    let url = '/api/assets/' + window.location.pathname.split('/').pop();
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setAssetInfo(data);
      });
  }, []);

  return (
    <Container>
      <h1>{isLoading ? 'Loading' : assetInfo.name}</h1>
      <Tabs
        defaultActiveKey="stats"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="stats" title="Stats At-A-Glance">
          <Stats count={isLoading ? 0 : Number(assetInfo.count)} />
        </Tab>
        <Tab eventKey="explorer" title="Trade Explorer">
          <p>Hi</p>
        </Tab>
        <Tab eventKey="all" title="All Trades" disabled></Tab>
      </Tabs>
    </Container>
  );
}

export default App;
