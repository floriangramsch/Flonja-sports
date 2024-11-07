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

export const fetchMuscles = async () => {
  const response = await fetch("/api/muscle");
  if (!response.ok) throw new Error("Fehler beim Abrufen der Muskeln");
  return response.json();
};
