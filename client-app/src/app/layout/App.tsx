import React, { Fragment, useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css'
import './styles.css';
import { Container } from 'semantic-ui-react';
import NavBar from './navbar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname === '/' ?
        <HomePage /> :
        < >
          <NavBar />
          <Container style={{ marginTop: '7em' }}>
            <Outlet />
          </Container>
        </>
      }
    </>
  );
}

// AM - 7
// export an observer build on App will make App "observer" and will react to the event of 
export default observer(App);
