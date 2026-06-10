// src/lib/state.tsx
import React, { createContext, useReducer, Dispatch, ReactNode, useEffect } from "react";
import { UserProfile } from "../models/userProfile";
import { storage } from "./storage";

/**
 * Global application state. Extend as needed.
 */
export interface AppState {
  /** Current user profile persisted in LocalStorage */
  userProfile: UserProfile;
}

/** Action types for state management */
export type AppAction =
  | { type: "SET_USER_PROFILE"; payload: UserProfile }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<UserProfile["preferences"]> }
  | { type: "ADD_ACTIVITY"; payload: UserProfile["activityLog"][number] }
  | { type: "SET_CARBON_REPORT"; payload: UserProfile["carbonReport"] }
  | { type: "SET_RECOMMENDATIONS"; payload: UserProfile["recommendations"] }
  | { type: "SET_CHALLENGES"; payload: UserProfile["challenges"] }
  | { type: "SET_PREFERENCES"; payload: UserProfile["preferences"] }
  | { type: "SET_LAST_CALCULATED_AT"; payload: string }
  | { type: "SET_CURRENT_SCORE"; payload: number }
  | { type: "SET_STREAK_COUNT"; payload: number };

/** Reducer handling state transitions */
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_USER_PROFILE":
      return { ...state, userProfile: action.payload };
    case "UPDATE_PREFERENCES":
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          preferences: { ...state.userProfile.preferences, ...action.payload },
        },
      };
    case "ADD_ACTIVITY":
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          activityLog: [...state.userProfile.activityLog, action.payload],
        },
      };
    case "SET_CARBON_REPORT":
      return {
        ...state,
        userProfile: { ...state.userProfile, carbonReport: action.payload },
      };
    case "SET_RECOMMENDATIONS":
      return {
        ...state,
        userProfile: { ...state.userProfile, recommendations: action.payload },
      };
    case "SET_CHALLENGES":
      return {
        ...state,
        userProfile: { ...state.userProfile, challenges: action.payload },
      };
    case "SET_PREFERENCES":
      return {
        ...state,
        userProfile: { ...state.userProfile, preferences: action.payload },
      };
    case "SET_LAST_CALCULATED_AT":
      return {
        ...state,
        userProfile: { ...state.userProfile, lastCalculatedAt: action.payload },
      };
    case "SET_CURRENT_SCORE":
      return {
        ...state,
        userProfile: { ...state.userProfile, currentScore: action.payload },
      };
    case "SET_STREAK_COUNT":
      return {
        ...state,
        userProfile: { ...state.userProfile, streakCount: action.payload },
      };
    default:
      return state;
  }
};

/** Context objects */
export const AppStateContext = createContext<AppState | undefined>(undefined);
export const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined);

/** Provider component that loads persisted state */
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const persisted = storage.get<AppState>("appState");
  const initialState: AppState = persisted ?? {
    userProfile: {
      uid: crypto.randomUUID(),
      preferences: {
        transport: true,
        food: true,
        energy: true,
        waste: true,
        shopping: true,
      },
      activityLog: [],
    },
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist state on every change
  useEffect(() => {
    storage.set("appState", state);
  }, [state]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

/** Helper hooks */
export const useAppState = () => {
  const ctx = React.useContext(AppStateContext);
  if (ctx === undefined) throw new Error("useAppState must be used within AppProvider");
  return ctx;
};
export const useAppDispatch = () => {
  const ctx = React.useContext(AppDispatchContext);
  if (ctx === undefined) throw new Error("useAppDispatch must be used within AppProvider");
  return ctx;
};
