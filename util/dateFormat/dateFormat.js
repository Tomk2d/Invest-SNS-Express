const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  };

  const formattedDate = new Date(dateString)
    .toLocaleString("ko-KR", options)
    .replace(/\. /g, ".");

  return formattedDate;
};

module.exports = formatDate;
