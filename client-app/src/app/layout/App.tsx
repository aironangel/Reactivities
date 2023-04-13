import React, { Fragment, useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css'
import './styles.css';
import {  Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  // AM - 7 - {} means we are destructuring the object because intereseted only in activityStore of "useStore" 
  // returned object.
  const {activityStore} = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])

  
  if (activityStore.loadingInitial) return <LoadingComponent content={'Loading App...'}/>


  return (
    < >
        <NavBar />
        <Container style={{marginTop: '7em'}}>
          
          <ActivityDashboard />
        </Container>
    </>
  );
}

// AM - 7
// export an observer build on App will make App "observer" and will react to the event of 
export default observer(App);
