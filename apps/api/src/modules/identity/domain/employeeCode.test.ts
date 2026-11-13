import { describe, expect, it } from 'vitest';
import { formatEmployeeCode, parseEmployeeCode } from './employeeCode.js';

describe('employee code', () => {
  it('pads to three digits and grows past 999', () => {
    expect(formatEmployeeCode(1)).toBe('EH001');
    expect(formatEmployeeCode(42)).toBe('EH042');
    expect(formatEmployeeCode(999)).toBe('EH999');
    expect(formatEmployeeCode(1000)).toBe('EH1000');
  });

  it('reads only EH codes', () => {
    expect(parseEmployeeCode('EH142')).toBe(142);
    expect(parseEmployeeCode('EH007')).toBe(7);
    expect(parseEmployeeCode('GH142')).toBeNull();
    expect(parseEmployeeCode('GRN0042')).toBeNull();
    expect(parseEmployeeCode('EMP-7')).toBeNull();
    expect(parseEmployeeCode('EH')).toBeNull();
  });
});
