export function dateToString(date: Date) {
    const year = date.getFullYear().toString();
    const num_month = date.getMonth() + 1;
    const month = num_month.toString();
    const day = date.getDate().toString();
    return `${year}/${month}/${day}`;
}

export function stringToDate(dateString: string) {
    const dateList = dateString.split("/");
    const dateNumList = dateList.map(
        (obj) => parseInt(obj)
    );
    return new Date(dateNumList[0], dateNumList[1] - 1, dateNumList[2]);
}

export function takeFullDate(date: Date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return result
}