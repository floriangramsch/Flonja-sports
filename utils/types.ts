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
  type: 'machine' | 'bodyweight';
  metric: 'weight' | 'time';
};

export type EquipStatsType = {
  equip_name: string;
  equip_id: number;
  muscle_id: number;
  muscle_name: string;
  last_weight: number;
  max_weight: number;
  user_id: number;
  user_name: string;
  info: string;
};

export type WorkoutType = {
  workout_id: number;
  user_id: number;
  name: string;
  start: Date;
  end: Date;
  locker: number;
  rest_time: number;
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
  exercice_id: number;
  equipName: string;
  equip_id: number;
  muscle_group_id: number;
  muscleName: string;
  type: 'machine' | 'bodyweight';
  metric: 'weight' | 'time';
};

export type StatsType = {
  stats_id: number;
  user_id: number;
  body_weight: number;
  date: string;
  name: string;
};

export type UserStatsType = {
  Florian: StatsType[];
  Sonja: StatsType[];
  // [key: string]: StatsType[];
};

export type RouterTypes =
  | "workoutdetail"
  | "equiplist"
  | "musclelist"
  | "workouts"
  | "exercises"
  | "stats";

export type ShowType = {
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
