export const formateDate = (dateString) => {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    const date = new Date(dateString);
    const formatedDate = date.toLocaleDateString("US-en", options);

    const hour = date.getHours();
    const minutes = date.getMinutes();
    const period = hour >= 12 ? "PM" : "AM";
    const formatedTime = `${hour % 12}:${minutes.toString().padStart(2, "0")} ${period}`;

    return `${formatedDate} | ${formatedTime}`;
}