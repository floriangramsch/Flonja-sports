export type LoggedType = {
  isLogged: boolean;
  user:
    | {
        id: number;
        name: string;
      }
    | undefined;
  loggedWorkoutId: number | undefined;
};

export type UserType = {
  [id: number]: {
    name: string;
  };
};

export type MuscleType = {
  muscle_name: string;
  muscle_group_id: number;
};

export type EquipType = {
  equip_id: number;
  equip_name: string;
  muscle_name: string;
  muscle_id: number;
  info: string;
};

export type EquipStatsType = {
  max_weight: number;
  user_id: number;
  name: string;
  muscle_name: string;
  muscle_id: number;
  equip_id: number;
  user_name: string;
  last_weight: number;
};

export type GroupedEquipStatsType = {
  equip_name: string;
  equip_id: number;
  muscle_id: number;
  muscle_name: string;
  last_weight: number;
  max_weight: number;
  user_id: number;
  user_name: string;
}[];

export type WorkoutType = {
  workout_id: number;
  user_id: number;
  name: string;
  start: Date;
  end: Date;
  locker: number;
};

export type SetType = {
  weight: number;
  reps: number;
  equip_id: number;
  equip_name: string;
  start: Date;
  user_name: string;
};

export type ExerciseType = {
  equipName: string;
  equip_id: number;
  exercice_id: number;
};

export type RouterTypes =
  | "workoutdetail"
  | "equiplist"
  | "workouts"
  | "exercises";
export type ShowType = {
  showNew: false; // show dropdown
  showDialogEquip: false; // show equip dialog
  showDialogMuskle: false; // show muscle dialog
  showLogin: false; // show login
  showRouter: RouterTypes;
};

export type WorkoutRouterTypes =
  | "home"
  | "equipselection"
  | "workoutdetail"
  | "exercisedetail";
export type workoutShowType = {
  showRouter: WorkoutRouterTypes;
};
