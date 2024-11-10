export type LoggedType = {
  isLogged: boolean;
  user: LoggedUser | undefined;
  loggedWorkoutId: number | undefined;
  // loggedWorkoutTest: ComputedRef<LoggedWorkout | undefined>;
};

export type LoggedUser = {
  id: number;
  name: string;
};

export type LoggedWorkout = {
  id: number | undefined;
  start: Date;
  end: Date;
  user: LoggedUser;
  locker: number;
  equips: {
    [equip_id: number]: number | null;
  };
};

export type UserType = {
  [id: number]: {
    name: string;
  };
};

export type MuscleType = {
  [id: number]: {
    muscle_name: string;
    muscle_group_id: number;
  };
};

export type EquipSpecialType = {
  id: number;
  equip_name: string;
  muscle_name: string;
  FloPB: number | null;
  SonjaPB: number | null;
  FloLast: number | null;
  SonjaLast: number | null;
  exercises: Record<number, any>;
};

export type EquipType = {
  equip_id: number;
  equip_name: string;
  muscle_name: string;
};

export type WorkoutType = {
  workout_id: number;
  user_id: number;
  name: string;
  start: Date;
  end: Date;
  locker: number;
};

export type AllType = {
  equips: EquipType;
  users: UserType;
  muscles: MuscleType;
  workouts: WorkoutType;
};

export type routerTypes =
  | "workoutdetail"
  | "equiplist"
  | "workouts"
  | "exercises";
export type showType = {
  showNew: false; // show dropdown
  showDialogEquip: false; // show equip dialog
  showDialogMuskle: false; // show muscle dialog
  showLogin: false; // show login
  showRouter: routerTypes;
};

export type workoutRouterTypes =
  | "home"
  | "equipselection"
  | "workoutdetail"
  | "exercisedetail";
export type workoutShowType = {
  showRouter: workoutRouterTypes;
};
