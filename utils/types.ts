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
  user_id: number;
  name: string;
  rest_time: number;
  work_body_id: number;
};
// export type UserType = {
//   [id: number]: {
//     name: string;
//   };
// };

export type CategoryTypes = "muscle" | "exercise";
export type CategoryType = {
  id: number;
  name: string;
  type: CategoryTypes;
};

export type ExerciseArtType = "Machine" | "Bodyweight" | "Dumbbell";
export type ExerciseMetricType = "Weight" | "Time";
export type ExerciseType = {
  exercise_id: number;
  exercise_name: string;
  categories: CategoryType[];
  info: string;
  type: ExerciseArtType;
  metric: ExerciseMetricType;
};

export type ExerciseStatsType = {
  exercise_name: string;
  exercise_id: number;
  last_weight: number;
  max_weight: number;
  categories: CategoryType[];
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
  main_category: string;
};

export type SetType = {
  weight: string;
  reps: number;
  start: string;
};
export type DingensType = {
  user_name: string;
  user_id: number;
  sets: SetType[];
};
export type SetHelperType = {
  exercise_id: number;
  exercise_name: string;
  users: DingensType[];
};

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
  categories: CategoryType[];
  type: ExerciseArtType;
  metric: ExerciseMetricType;
};

export type MaybeWorkoutExercise = {
  workout_exercise_id?: number;
  exercise_name?: string;
  exercise_id?: number;
  categories: CategoryType[];
  type?: string;
  metric?: string;
}

export type StatsType = {
  stats_id: number;
  user_id: number;
  body_weight: number;
  bauchumfang: number;
  date: string;
  name: string;
};
export type NewStatsType = {
  body_weight?: number;
  bauchumfang?: number;
}

export type UserStatsType = {
  [key: string]: StatsType[];
  Florian: StatsType[];
  Sonja: StatsType[];
};

export type WorkoutRouterTypes =
  | "home"
  | "exerciseselection"
  | "workoutdetail"
  | "workoutstretch"
  | "workoutexercisedetail";

export type RouterTypes =
  | "workoutpage"
  | "exerciselist"
  | "categorylist"
  | "workouts"
  | "workoutexercises"
  | "stats"
  | "plans"
  | "test";

export type Plan = {
  id: number;
  name: string;
  day?: number;
  user_id: number;
};

export type PlanExercise = Plan & {
  exercise_id: number;
  sets: number;
  reps: number;
  reps_to: number;
  info: string;
  type: ExerciseArtType;
  metric: ExerciseMetricType;
  order: number;
  categories: CategoryType[];
};
