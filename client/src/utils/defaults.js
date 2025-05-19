export const alignment = {
  vertical: 'middle',
  horizontal: 'center',
  wrapText: true,
  shrinkToFit: true,
};

export const headerFill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFF4B083' },
};

export const subHeader1Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFD99594' },
};

export const subHeader2Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFD0E1E9' },
};

export const subHeader3Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFD7D9B2' },
};

export const headerFont = {
  name: 'Times New Roman',
  family: 2,
  size: 12,
  bold: true,
};

export const dataFont = {
  name: 'Times New Roman',
  family: 2,
  size: 12,
};

export const border = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

export const oddSems = ['1', '3', '5', '7'];

export const evenSems = ['2', '4', '6', '8'];

export const allSems = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const headers = [
  'Charotar University of Science and Technology, Changa',
  'FACULTY OF TECHNOLOGY AND ENGINEERING',
  'CHANDUBHAI S.PATEL INSTITUTE OF TECHNOLOGY(CSPIT)',
  'U and P U.Patel Department of Computer Engineering',
];

export const colnumString = (num) => {
  let s = '',
    t;
  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = ((num - t) / 26) | 0;
  }
  return s || undefined;
};
