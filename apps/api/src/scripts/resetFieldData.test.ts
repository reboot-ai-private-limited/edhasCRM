import { describe, expect, it } from 'vitest';
import { collectPublicIds, databaseName, refusalReason, RESET_COLLECTIONS } from './resetFieldData.js';

const uri = 'mongodb+srv://u:p@c.mongodb.net/edhasnew?retryWrites=true';

describe('collectPublicIds', () => {
  it('gathers attachments and photos once each', () => {
    expect(collectPublicIds([{ attachments: [{ publicId: 'a' }, { publicId: 'b' }] }, { photo: { publicId: 'a' } }, { photo: null }, {}])).toEqual(['a', 'b']);
  });
});

describe('databaseName', () => {
  it('reads the path segment', () => expect(databaseName(uri)).toBe('edhasnew'));
  it('is null without one', () => expect(databaseName('mongodb+srv://u:p@c.mongodb.net/?x=1')).toBeNull());
});

describe('refusalReason', () => {
  it('allows a confirmed database', () => expect(refusalReason({ mongoUri: uri, confirmDb: 'edhasnew' })).toBeNull());
  it('wants the name passed', () => expect(refusalReason({ mongoUri: uri, confirmDb: undefined })).toMatch(/--confirm-db=edhasnew/));
  it('refuses a mismatch', () => expect(refusalReason({ mongoUri: uri, confirmDb: 'other' })).toMatch(/does not match/));
});

describe('RESET_COLLECTIONS', () => {
  it('removes routes after everything that points at them', () => {
    const at = (c: string) => RESET_COLLECTIONS.indexOf(c as never);
    for (const c of ['doctors', 'chemists', 'dailyplans', 'routeassignments']) expect(at(c)).toBeLessThan(at('routes'));
  });
});
