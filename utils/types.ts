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

export type CategoryType = {
  category_id: number;
  category_name: string;
};

export type ExerciseArtType = 'Machine' | 'Bodyweight' | 'Dumbbell';
export type ExerciseMetricType = 'Weight' | 'Time';
export type ExerciseType = {
  exercise_id: number;
  exercise_name: string;
  category_id: number;
  category_name: string;
  info: string;
  type: ExerciseArtType;
  metric: ExerciseMetricType;
};

export type ExerciseStatsType = {
  exercise_name: string;
  exercise_id: number;
  category_id: number;
  category_name: string;
  last_weight: number;
  max_weight: number;
  user_id: number;
  user_name: string;
  info: string;
  type: ExerciseArtType;
  metric: ExerciseMetricType;
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
  weight: string;
  reps: number;
  start: string;
}
export type DingensType = {
  user_name: string;
  sets: SetType[]
}
export type SetHelperType = {
  exercise_id: number;
  exercise_name: string;
  users: DingensType[]
}

export type SetOriginalType = {
  weight: number;
  reps: number;
  exercise_id: number;
  exercise_name: string;
  start: Date;
  user_name: string;
};

export type WorkoutExerciseType = {
  workout_exercise_id: number;
  exercise_name: string;
  exercise_id: number;
  category_id: number;
  category_name: string;
  type: ExerciseArtType;
  metric: ExerciseMetricType;
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
  | "exerciselist"
  | "categorylist"
  | "workouts"
  | "workoutexercises"
  | "stats";

export type ShowType = {
  showLogin: false; // show login
  showRouter: RouterTypes;
};

export type WorkoutRouterTypes =
  | "home"
  | "exerciseselection"
  | "workoutdetail"
  | "workoutexercisedetail";
export type workoutShowType = {
  showRouter: WorkoutRouterTypes;
};

export type Plan = {
  id: number;
  name: string;
  day?: number;
}

export type PlanExercise = Plan & {
  exercise_id: number;
  sets: number;
  reps: number;
  weight: number;
  category_id: number;
  info: string;
  type: ExerciseArtType;
  metric: ExerciseMetricType;
}