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
export default formatTime;
