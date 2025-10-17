const formatDate = (dateString) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(dateString)
    .toLocaleDateString("en-GB", options)
    .replace(",", "");
};

export default formatDate;
