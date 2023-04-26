import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';

interface Props{
  activities: Activity[];
  deleteActivity: (id: string) => void;
  submitting: boolean;
}

export default observer(function ActivityDashboard(){

const {activityStore} = useStore();

  // AM - 7 - {} means we are destructuring the object because intereseted only in activityStore of "useStore" 
  // returned object.
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])

  
  if (activityStore.loadingInitial) return <LoadingComponent content={'Loading App...'}/>




  return(
    <Grid>
      <Grid.Column width='10'>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width='6'>
        <h2>Activity Filters</h2>
      </Grid.Column>
    </Grid>
  )
})


         /* {selectedActivity && //this means that the ActivityDetails is showed only when selectedActivity is not null 
          !editMode &&
        <ActivityDetails />}
        {
          editMode && 
          <ActivityForm />
        }  */
