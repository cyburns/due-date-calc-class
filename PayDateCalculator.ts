class DueDateCalculator {
  private fundDay: Date;
  private loopType: string;
  private directDeposit: boolean;
  private holidays: Date[];

  constructor(
    fundDay: Date,
    loopType: string,
    directDeposit: boolean,
    holidays: Date[]
  ) {
    this.fundDay = fundDay;
    this.loopType = loopType;
    this.directDeposit = directDeposit;
    this.holidays = holidays;
  }

  calculateDueDate(): Date {
    let dueDate = new Date(this.fundDay);

    while (true) {
      if (this.directDeposit) {
        if (this.isWeekend(dueDate)) {
          if (this.loopType === "forward") {
            dueDate.setDate(dueDate.getDate() + 1);
            continue;
          } else if (this.loopType === "reverse") {
            dueDate.setDate(dueDate.getDate() - 1);
            continue;
          }
        }
        if (this.isHoliday(dueDate)) {
          this.loopType = "reverse";
          continue;
        }
      }

      if (dueDate >= this.addDays(this.fundDay, 10)) {
        return dueDate;
      }

      dueDate = this.getNextPayDay(dueDate);
      this.loopType = "forward";
    }
  }

  private getNextPayDay(date: Date): Date {
    return date;
  }

  private isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  private isHoliday(date: Date): boolean {
    return this.holidays.some(
      (holiday) => holiday.getTime() === date.getTime()
    );
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

// Example usage:
const fundDay = new Date("2024-05-09");
const holidays = [new Date("2024-05-13"), new Date("2024-05-20")];
const calculator = new DueDateCalculator(fundDay, "forward", true, holidays);
const dueDate = calculator.calculateDueDate();

console.log(dueDate);
