import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';

export default class ActivityStores {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;


  constructor() {
    makeAutoObservable(this)
  }

  get activitiesByDate() {
    return Array
      .from(this.activityRegistry.values())
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
      })
      this.setLoadingInitial(false);
    }
    catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
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


  // AM - 7
  // This method is used to selected an acticity
  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  }

  // AM - 7
  // This method is used to cancel the selected an acticity
  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity();
    this.setEditMode(true);
  }

  closeForm = () => {
    this.setEditMode(false);
  }

  createActivity = async (activity: Activity) => {
    this.setLoading(true);
    activity.id = uuid();

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
    activity.id = uuid();

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