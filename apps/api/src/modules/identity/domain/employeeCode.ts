export const EMPLOYEE_CODE_PREFIX = 'EH';

/** The first number handed out: EH001. */
export const EMPLOYEE_CODE_FIRST = 1;

/** EH001, EH002 …, padded to three digits; past 999 it simply grows (EH1000). */
export function formatEmployeeCode(sequence: number): string {
  return `${EMPLOYEE_CODE_PREFIX}${String(sequence).padStart(3, '0')}`;
}

/** The number in an EH code, or `null` for any other code (hand-typed ones). */
export function parseEmployeeCode(code: string): number | null {
  const match = new RegExp(`^${EMPLOYEE_CODE_PREFIX}(\\d+)$`).exec(code);
  return match ? Number(match[1]) : null;
}

export const ADMIN_CODE_PREFIX = 'ADMIN';

/** ADMIN01, ADMIN02 …, padded to two digits; past 99 it simply grows (ADMIN100). Admins count on their own, apart from EH. */
export function formatAdminCode(sequence: number): string {
  return `${ADMIN_CODE_PREFIX}${String(sequence).padStart(2, '0')}`;
}

/** The number in an ADMIN code, or `null` for any other code. */
export function parseAdminCode(code: string): number | null {
  const match = /^ADMIN(\d+)$/.exec(code);
  return match ? Number(match[1]) : null;
}
