const date = new Date();

// Get the hours, minutes, and AM/PM indicator
let hours = date.getHours();
const minutes = ('0' + date.getMinutes()).slice(-2);
const ampm = hours >= 12 ? 'PM' : 'AM';

// Convert hours to 12-hour format
hours = hours % 12 || 12;

// Construct the formatted time string
const formattedTime = `${hours}:${minutes} ${ampm}`;

export const response = (message, status, data) => {
  let circularObject = {
    message,
    status,
    responseTime: formattedTime,
    data,
  };
  circularObject = JSON.stringify(circularObject);
  return JSON.parse(circularObject);
};
