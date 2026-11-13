/**
 * The seller block printed at the head of every Tax Invoice, as on the invoice the office issues today (Sale 3452, 26-10-2026). Hard-coded: the app
 * keeps no company settings, and nothing about the printout is stored. Change it here when the company's details change.
 */
export const COMPANY = {
  name: 'EDHAS PHARMA',
  // Phone and email are from https://www.edhas.co.in/. GSTIN and the Siliguri address are as supplied (GST record of Edhas Organics Private Limited). TODO(client): confirm the invoicing entity and its full street address (the website shows 28/A Pocket-F, Mayur Vihar, Delhi 110091), and fill in the licence numbers.
  addressLines: ['SILIGURI', 'WEST BENGAL 734001', 'FSSAI NO - TODO', 'Drug Licence No. - TODO'],
  phone: '+918906934562',
  email: 'edhaspharma@gmail.com',
  gstin: '19AAHCE5668A1ZK',
  state: '19-West Bengal',
} as const;

/** The state code that starts a GSTIN (`19` = West Bengal). A buyer whose GSTIN starts with it is taxed SGST + CGST; any other (or none on file) IGST. */
export const SELLER_STATE_CODE = COMPANY.gstin.slice(0, 2);
