import type { RoleName } from '@edhas/contracts';

export interface Actor {
  id: string;
  role: RoleName;
}

export const isHrOrAdmin = (actor: Actor): boolean => actor.role === 'HR' || actor.role === 'ADMIN';
