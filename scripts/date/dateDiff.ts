export default class DateDiff {
  private day: number;
  
  private readonly ONE_DAY_SEC = 1000 * 60 * 60 * 24;

  constructor(date1: Date, date2: Date);
  constructor(day: number);
  constructor(arg1?: Date | number, arg2?: Date) {
    if (arg2 === undefined) {
      const day = arg1 as number
      this.day = day as number;
    } else {
      const date1 = arg1 as Date
      const date2 = arg2 as Date
      const milSecondDiff = date2.getTime() - date1.getTime()
      const dateDiff = milSecondDiff / this.ONE_DAY_SEC
      this.day = dateDiff
    }
  };

  getShiftedDate(date: Date) {
    const result = new Date()
    result.setTime(date.getTime())
    result.setDate(result.getDate() + this.day)
    return result
  }

  divide(num: number, takeUpperBound: boolean = false) {
    if (takeUpperBound) {
      this.day = Math.ceil(this.day / num)
    } else {
      this.day = Math.floor(this.day / num)
    }
  }

  getDay() {
    return this.day
  }
}