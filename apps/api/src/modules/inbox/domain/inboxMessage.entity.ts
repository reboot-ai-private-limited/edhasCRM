import type { InboxAudienceDto, InboxKind } from '@edhas/contracts';
import type { InboxAttachment } from './attachment.js';

export { INBOX_KINDS } from '@edhas/contracts';
export type { InboxKind } from '@edhas/contracts';

/** A message an Admin (or, for `createdBy: null`, the system) sent to an audience. */
export interface InboxMessage {
  id: string;
  title: string;
  body: string;
  kind: InboxKind;
  audience: InboxAudienceDto;
  /** Files sent with it, in the order attached; none for a system message. */
  attachments: InboxAttachment[];
  recipientCount: number;
  createdBy: string | null;
  createdAt: Date;
  expiresAt: Date | null;
  retractedAt: Date | null;
}
