import type { RoleName } from '@edhas/contracts';

/** Hands out the next employee code, never the same one twice: ADMIN01, ADMIN02 … for an Admin, EH001, EH002 … for everyone else. */
export interface EmployeeCodeGeneratorPort {
  next(role?: RoleName): Promise<string>;
}
