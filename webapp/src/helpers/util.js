const getDisplayName = (fistName, middleName, lastName) => {
  let displayName = fistName
  if (middleName) {
    displayName += ` ${middleName}`
  }
  if (lastName) {
    displayName += ` ${lastName}`
  }
  return displayName;
}

const monthNames =["Jan","Feb","Mar","Apr",
"May","Jun","Jul","Aug",
"Sep", "Oct","Nov","Dec"];

const getDateOfJoining = (date) => {
  if (!date) return "";

  const doj = new Date(date);
  return `${doj.getDate()}-${monthNames[doj.getMonth()]}-${doj.getFullYear()}`;
}

const getFormattedTime = (str) => {
  const date = new Date(str);
  return `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
}

export {
  getDisplayName,
  getDateOfJoining,
  getFormattedTime
}