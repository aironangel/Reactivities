import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { hasSubscribers } from "diagnostics_channel";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from "uuid";

export default observer(function ActivityForm(){

  const {activityStore} = useStore();
  const {selectedActivity, createActivity, updateActivity, 
    loading, loadActivity, loadingInitial} = activityStore;

  const {id} = useParams();
  const navigate=useNavigate()

  // AM - 8 - useState create a pair of entity/function that allow to set the entity
  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  })

  // AM - 8 - useEffect do something when the component is loaded.
  // in this case it load activity via setActivity method.
  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(activity!));
  }, [id, loadActivity])

function handleSubmit(){
  if (!activity.id){
    activity.id = uuid();
    createActivity(activity).then(() => navigate('/activities/' + activity.id))
  }
  else{
    updateActivity(activity).then(() => navigate('/activities/' + activity.id))
  }


  activity.id ? updateActivity(activity) : createActivity(activity)
}

function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
  //distruct the event in name and value.
  const {name, value} = event.target;
  setActivity({...activity, [name]: value});
}

if (loadingInitial) return <LoadingComponent content="Loading Activity ..."/>

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete='off'>
        <Form.Input placeholder='Title' value={activity.title} name='title'  onChange={handleInputChange}/>
        <Form.TextArea placeholder='Description' value={activity.description} name='description'  onChange={handleInputChange} />
        <Form.Input placeholder='Category' value={activity.category} name='category'  onChange={handleInputChange} />
        <Form.Input type='date' placeholder='Date' value={activity.date} name='date'  onChange={handleInputChange} />
        <Form.Input placeholder='City' value={activity.city} name='city'  onChange={handleInputChange} />
        <Form.Input placeholder='Venue'  value={activity.venue} name='venue'  onChange={handleInputChange}/>
        <Button loading={loading} floated='right' positive type='submit' content='Submit' />
        <Button floated='right' type='button' content='Cancel' />
      </Form>
    </Segment>
  )
})