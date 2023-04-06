import React, { Fragment, useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css'
import './styles.css';
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { Activity } from '../models/activity';
import NavBar from './navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/activities")
    .then(response => {
      setActivities(response.data);
    })
  }, [])


  return (
    < >
        <NavBar />
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard activities={activities} />
        </Container>
    </>
  );
}

export default App;
