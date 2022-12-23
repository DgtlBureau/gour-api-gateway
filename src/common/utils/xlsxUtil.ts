import * as XLSX from 'xlsx';

export function makeBook(titles: string[], rows: string[][]) {
  const ws = XLSX.utils.aoa_to_sheet([titles, ...rows]);

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');

  return wb;
}
