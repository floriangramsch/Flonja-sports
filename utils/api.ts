// api.ts
export const fetchUsers = async () => {
  const response = await fetch("/api/getUsers");
  if (!response.ok) throw new Error("Fehler beim Abrufen der Ausrüstungen");
  return response.json();
};

export const fetchEquipment = async () => {
  const response = await fetch("/api/getEquipments");
  if (!response.ok) throw new Error("Fehler beim Abrufen der Ausrüstungen");
  return response.json();
};

export const fetchWorkouts = async () => {
  const response = await fetch("/api/getWorkouts");
  if (!response.ok) throw new Error("Fehler beim Abrufen der Workouts");
  return response.json();
};

export const fetchMuscles = async () => {
  const response = await fetch("/api/getMuscles");
  if (!response.ok) throw new Error("Fehler beim Abrufen der Muskeln");
  return response.json();
};
