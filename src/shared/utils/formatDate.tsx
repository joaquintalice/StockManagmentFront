import dayjs from "dayjs";
import "dayjs/locale/es";

const formatDatetime = (date: string) => {
    const formattedDate = dayjs(date).format("DD/MM/YY HH:mm");
    return formattedDate;
};

export default formatDatetime;