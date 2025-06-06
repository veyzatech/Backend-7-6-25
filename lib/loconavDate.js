export const parseLoconavDate = (dateString) => {
  if (!dateString) return null;

  const [datePart, timePart] = dateString.split(", ");
  const [day, month, year] = datePart.split("/").map(Number);

  // Convert "hh:mmAM/PM" into 24-hour format
  const timeMatch = timePart.match(/(\d+):(\d+)(AM|PM)/);
  if (!timeMatch) return null;

  let [_, hours, minutes, period] = timeMatch;
  hours = Number(hours);
  minutes = Number(minutes);

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  // Create a valid Date object
  const dateObj = new Date(year, month - 1, day, hours, minutes, 0);

  return isNaN(dateObj.getTime()) ? null : dateObj;
};
