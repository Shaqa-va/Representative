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
      loadingInitial: observable,
      activity: observable,
      activityRegistery: observable,
      target: observable,
      submitting: observable,
      loadActivities: action,
      loadActivity: action,
      createActivity: action,
      editActivity: action,
      deleteActvity: action,
      activitiesByDate: computed,
    });
  }
  loadingInitial = false;
  activity: IActivity | null = null;
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

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction(() => {
          this.activity = activity;
          this.loadingInitial = false;
        });
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistery.get(id);
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistery.set(activity.id, activity);

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
        this.activity = activity;
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
}

export default createContext(new ActivityStore());
