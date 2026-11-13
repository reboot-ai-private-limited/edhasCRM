import type { AccessTokenPayload } from '@edhas/contracts';
import type { FinancialYearContext } from './financialYear.middleware.js';

/**
 * Augments Express's `Request` with the authenticated caller, set by `authenticate.middleware.ts`.
 * Lives in `shared/` (below every module) since the type it references, `AccessTokenPayload`,
 * itself lives in `@edhas/contracts` for the same boundary reason — see `jwt.util.ts`.
 */
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
      /** Set only while a past financial year is being viewed (`X-Financial-Year`). */
      financialYear?: FinancialYearContext;
    }
  }
}

export {};
