export const formatTime = (time: Date | undefined) => {
  if (time) {
    const formattedTime = new Date(time).toLocaleString("de-DE", {
      day: "2-digit",
      year: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime + " Uhr";
  }
};

export const showTime = (time: any) => {
  if (!time) return "?";
  const convertedTime = new Date(time);
  const year = convertedTime.getUTCFullYear().toString().slice(-2);
  const month = convertedTime.getMonth() + 1;
  const day = convertedTime.getDate();
  const hours = convertedTime.getHours().toString().padStart(2, "0");
  const minutes = convertedTime.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
