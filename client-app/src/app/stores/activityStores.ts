import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';

export default class ActivityStores {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;


  constructor() {
    makeAutoObservable(this)
  }

  get activitiesByDate() {
    return Array
      .from(this.activityRegistry.values())
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        this.setActivity(activity);
        this.activityRegistry.set(activity.id, activity);
      })
      this.setLoadingInitial(false);
    }
    catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
    this.setLoadingInitial(false);
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (!activity){
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
      } catch (error) {
        console.log(error);
      }
      this.setLoadingInitial(false);
    }
    runInAction(() => this.selectedActivity = activity);
    
    return activity;
  }

  private setActivity(activity: Activity){
    activity.date = activity.date.split('T')[0];

  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }


  // AM - 7 
  // This allow to handle the state via observable
  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  // AM - 7 
  // This allow to handle the state via observable
  setEditMode = (state: boolean) => {
    this.editMode = state;
  }

  setLoading(state: boolean) {
    this.loading = state;
  }

  // AM - 8
  // This form are no longer needs due to presence of the routes
  // // AM - 7
  // // This method is used to selected an acticity
  // selectActivity = (id: string) => {
  //   this.selectedActivity = this.activityRegistry.get(id);
  // }

  // // AM - 7
  // // This method is used to cancel the selected an acticity
  // cancelSelectedActivity = () => {
  //   this.selectedActivity = undefined;
  // }

  // openForm = (id?: string) => {
  //   id ? this.selectActivity(id) : this.cancelSelectedActivity();
  //   this.setEditMode(true);
  // }

  // closeForm = () => {
  //   this.setEditMode(false);
  // }

  createActivity = async (activity: Activity) => {
    this.setLoading(true);
    if (!activity.id){
      activity.id = uuid();
    }

    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.editMode = false;
        this.loading = false;
      })
    }
  }

  updateActivity = async (activity: Activity) => {
    this.setLoading(true);

    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        // AM - 7
        // filter activities exlcuding the ones under changes
        //            this.activities.filter(a => a.id !== activity.id);
        // add the edited activites at the bottom.
        //            this.activities.push(activity);

        // this can be also done spreading the activities and adding the one edited
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.editMode = false;
        this.loading = false;
      })
    }
  }

  deleteActivity = async (id: string) => {
    this.setLoading(true);
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.selectedActivity = undefined;
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }
}