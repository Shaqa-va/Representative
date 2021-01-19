import {
  makeObservable,
  observable,
  action,
  computed,
  configure,
  runInAction,
} from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

configure({ enforceActions: "always" });

class ActivityStore {
  constructor() {
    makeObservable(this, {
      activities: observable,
      loadingInitial: observable,
      selectedActivity: observable,
      activityRegistery: observable,
      target: observable,
      editMode: observable,
      submitting: observable,
      loadActivities: action,
      selectActivity: action,
      createActivity: action,
      openCreateForm: action,
      editActivity: action,
      openEditForm: action,
      cancelSelectedActivity: action,
      cancelFormOpen: action,
      deleteActvity: action,
      activitiesByDate: computed,
    });
  }
  activities: IActivity[] = [];
  loadingInitial = false;
  selectedActivity: IActivity | undefined;
  editMode = false;
  submitting = false;
  activityRegistery = new Map();
  target = "";

  get activitiesByDate() {
    return Array.from(this.activityRegistery.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }
  loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistery.set(activity.id, activity);
        });
      });

      this.loadingInitial = false;
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistery.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistery.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });

      console.log(error);
    }
  };

  deleteActvity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistery.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };

  openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistery.get(id);
    this.editMode = true;
  };
  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  cancelFormOpen = () => {
    this.editMode = false;
  };

  openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistery.get(id);
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
