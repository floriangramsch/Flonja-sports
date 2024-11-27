// api.ts
export const fetchUsers = async () => {
  const response = await fetch("/api/user");
  if (!response.ok) throw new Error("Fehler beim Abrufen der Ausrüstungen");
  return response.json();
};

export const fetchEquipment = async () => {
  const response = await fetch("/api/equip");
  if (!response.ok) throw new Error("Fehler beim Abrufen der Ausrüstungen");
  return response.json();
};

export const fetchEquipStats = async () => {
  const response = await fetch("/api/equipStats");
  if (!response.ok) throw new Error("Fehler beim Abrufen der Equip Stats");
  return response.json();
};

export const fetchWorkouts = async () => {
  const response = await fetch("/api/workout");
  if (!response.ok) throw new Error("Fehler beim Abrufen der Workouts");
  return response.json();
};

export const fetchWorkout = async (id: number | undefined) => {
  if (id) {
    const response = await fetch("/api/workout" + "?workout_id=" + id);
    if (!response.ok) throw new Error("Fehler beim Abrufen der Workouts");
    return response.json();
  }
};

export const fetchMuscles = async () => {
  const response = await fetch("/api/muscle");
  if (!response.ok) throw new Error("Fehler beim Abrufen der Muskeln");
  return response.json();
};

export const fetchExercisesByWorkout = async (id: number) => {
  if (id) {
    const response = await fetch("/api/getExercisesByWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error("Fehler beim Abrufen der Exercises");
    return response.json();
  }
};

export const fetchStats = async () => {
  const response = await fetch("/api/stats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Fehler beim Abrufen der Stats");
  return response.json();
};
