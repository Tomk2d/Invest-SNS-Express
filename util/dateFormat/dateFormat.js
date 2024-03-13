const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  };
  const formattedDate = new Date(dateString)
    .toLocaleDateString("en-US", options)
    .replace(/(\d+)\/(\d+)\/(\d+)/, "$3.$1.$2");
  return formattedDate;
};

module.exports = formatDate;
