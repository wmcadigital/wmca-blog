var options = {
  // weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const formatDate = (dateString) => {
  return new Date(dateString)
    .toLocaleDateString("en-UK", options)
    .replace(",", "");
};

export default formatDate;
