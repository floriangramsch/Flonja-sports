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

export const fetchCategories = async () => {
  const response = await fetch("/api/category");
  if (!response.ok) throw new Error("Fehler beim Abrufen der category");
  return response.json();
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
