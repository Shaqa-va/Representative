export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ":" + time.getMinutes() + ":00";

  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const day = date.getDate();
  const dateString = `${year}-${month}-${day}`;

  return new Date(dateString + " " + timeString);
};
