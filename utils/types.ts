export type LoggedType = {
  isLogged: boolean;
  user: LoggedUser | undefined;
  loggedWorkout: number | undefined;
};

export type ShowType = {
  showNew: boolean; // show dropdown
  showDialogEquip: boolean; // show equip dialog
  showDialogMuskle: boolean; // show muscle dialog
  showLogin: boolean; // show login
  showRouter: string;
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
  equip_muscle_name: string;
  FloPB: number | null;
  SonjaPB: number | null;
  FloLast: number | null;
  SonjaLast: number | null;
  exercises: Record<number, any>;
};

export type EquipType = {
  [id: number]: EquipSpecialType;
};

export type WorkoutType = {
  [workout_id: number]: {
    start: Date;
    end: Date;
    user: LoggedUser;
    equips: {
      [equip_id: number]: number | null;
    };
  };
};

export type AllType = {
  equips: EquipType;
  users: UserType;
  muscles: MuscleType;
  workouts: WorkoutType;
};
