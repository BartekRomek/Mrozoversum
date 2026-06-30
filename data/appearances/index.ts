// Importujesz TYLKO te pliki, które faktycznie istnieją w folderach!
import kasacja from './chylka/kasacja.json';
import zaginiecie from './chylka/zaginiecie.json';
import rewizja from './chylka/Rewizja.json';
import ekspozycja from './forst/Ekspozycja.json';
import przewieszenie from './forst/Przewieszenie.json';
import trawers from './forst/Trawers.json';
import immunitet from './chylka/immunitet.json';
import inwigilacja from './chylka/Inwigilacja.json';



export const appearancesData = [
  ...kasacja.map((char: any) => ({ ...char, bookId: 'kasacja' })),
  ...zaginiecie.map((char: any) => ({ ...char, bookId: 'zaginiecie' })),
  ...rewizja.map((char: any) => ({ ...char, bookId: 'rewizja' })),
  ...ekspozycja.map((char: any) => ({ ...char, bookId: 'ekspozycja' })),
  ...przewieszenie.map((char: any) => ({ ...char, bookId: 'przewieszenie' })),
  ...trawers.map((char: any) => ({ ...char, bookId: 'trawers' })),
  ...immunitet.map((char: any) => ({ ...char, bookId: 'immunitet' })),
  ...inwigilacja.map((char: any) => ({ ...char, bookId: 'inwigilacja' })),





];