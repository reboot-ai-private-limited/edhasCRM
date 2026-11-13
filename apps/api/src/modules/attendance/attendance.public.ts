import type { AttendanceMonthDto } from '@edhas/contracts';

export type { AttendanceMonthDto } from '@edhas/contracts';

/** What Payroll takes from a month's attendance. */
export interface DeductibleDays {
  absentDays: number;
  strikeDays: number;
  /** Absent days while `ABSENT_DEDUCTS_SALARY` is on, plus strike days while `STRIKE_DEDUCTS_SALARY` is on; 0 when absent days are not deducted. */
  deductibleDays: number;
}

/** The only thing another module may import from `attendance/`. Months are `YYYY-MM`. */
export interface AttendancePublicContract {
  getMonth(userId: string, month: string): Promise<AttendanceMonthDto>;
  countDeductibleDays(userId: string, month: string): Promise<DeductibleDays>;
}
