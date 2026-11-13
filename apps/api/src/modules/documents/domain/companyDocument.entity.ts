import type { CompanyDocumentCategory } from '@edhas/contracts';

export { COMPANY_DOCUMENT_CATEGORIES } from '@edhas/contracts';
export type { CompanyDocumentCategory } from '@edhas/contracts';

/** A file in the library. `everyone` and `userIds` are the audience: either every field employee, or the people named. */
export interface CompanyDocument {
  id: string;
  title: string;
  category: CompanyDocumentCategory;
  fileKind: 'pdf' | 'jpeg' | 'png';
  url: string;
  publicId: string;
  sizeBytes: number;
  everyone: boolean;
  userIds: string[];
  uploadedBy: string;
  uploadedAt: Date;
}
