class PayDateCalculator {
  private fundDay: Date;
  private holidays: Date[];
  private paySpan: string;
  private payDay: Date;
  private isDirectDeposit: boolean;
  private dueDate: Date | null;
  private loopType: string;

  constructor(
    fundDay: Date,
    holidays: Date[],
    paySpan: string,
    payDay: Date,
    isDirectDeposit: boolean
  ) {
    this.fundDay = new Date(fundDay);
    this.holidays = holidays.map((date) => new Date(date));
    this.paySpan = paySpan;
    this.payDay = new Date(payDay);
    this.isDirectDeposit = isDirectDeposit;
    this.dueDate = null;
    this.loopType = "FORWARD";
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  private isHoliday(date: Date): boolean {
    return this.holidays.some(
      (holiday) => holiday.getTime() === date.getTime()
    );
  }

  private findNextPayDate(date: Date, payDay: Date): Date {
    let nextPayDate = new Date(payDay);
    while (nextPayDate <= date) {
      nextPayDate.setDate(nextPayDate.getDate() + 1);
    }

    return nextPayDate;
  }

  private adjustDueDate(): void {
    if (this.loopType === "FORWARD") {
      this.dueDate!.setDate(this.dueDate!.getDate() + 1);
      if (this.isWeekend(this.dueDate!)) {
        this.adjustDueDate();
      }
    } else if (this.loopType === "REVERSE") {
      this.dueDate!.setDate(this.dueDate!.getDate() - 1);
      if (this.isWeekend(this.dueDate!)) {
        this.adjustDueDate();
      }
    }
    if (this.isHoliday(this.dueDate!)) {
      this.loopType = "REVERSE";
      this.adjustDueDate();
    }
  }

  calculateDueDate(): Date {
    this.dueDate = new Date(this.fundDay);
    this.dueDate.setDate(this.fundDay.getDate() + 10);

    if (this.isDirectDeposit) {
      this.dueDate.setDate(this.dueDate.getDate() + 1);
      if (this.isWeekend(this.dueDate)) {
        this.adjustDueDate();
      }
    }

    if (this.isWeekend(this.dueDate) || this.isHoliday(this.dueDate)) {
      this.adjustDueDate();
    }

    if (this.dueDate < this.payDay) {
      this.dueDate = this.findNextPayDate(this.dueDate, this.payDay);
      this.loopType = "FORWARD";
      if (this.isDirectDeposit) {
        this.dueDate.setDate(this.dueDate.getDate() + 1);
        if (this.isWeekend(this.dueDate)) {
          this.adjustDueDate();
        }
      }
    }

    return this.dueDate!;
  }
}
