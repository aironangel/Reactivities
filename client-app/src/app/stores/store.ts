import { createContext, useContext } from "react";
import ActivityStores from "./activityStores";

// AM - 7
// We use this to expone the Activity Stores into the React context.
// the store will expone all the Stores that we will needs into the application 

interface Store{
  activityStore: ActivityStores
}

export const store: Store = {
  activityStore: new ActivityStores()
}

export const StoreContext = createContext(store);

// AM - 7 
// This is a hook which return the context
export function useStore() { 
  return useContext(StoreContext);
}