//CHYŁKA
import kasacja from './chylka/kasacja.json';
import zaginiecie from './chylka/zaginiecie.json';
import rewizja from './chylka/Rewizja.json';
import immunitet from './chylka/immunitet.json';
import inwigilacja from './chylka/Inwigilacja.json';
import oskarzenie from './chylka/Oskarzenie.json';
import testament from './chylka/Testament.json';
import kontratyp from './chylka/Kontratyp.json';
import umorzenie from './chylka/Umorzenie.json';

//FORST
import ekspozycja from './forst/Ekspozycja.json';
import przewieszenie from './forst/Przewieszenie.json';
import trawers from './forst/Trawers.json';
import deniwelacja from './forst/Deniwelacja.json';





export const appearancesData = [
  //chylka
  ...kasacja.map((char: any) => ({ ...char, bookId: 'kasacja' })),
  ...zaginiecie.map((char: any) => ({ ...char, bookId: 'zaginiecie' })),
  ...rewizja.map((char: any) => ({ ...char, bookId: 'rewizja' })),
  ...immunitet.map((char: any) => ({ ...char, bookId: 'immunitet' })),
  ...inwigilacja.map((char: any) => ({ ...char, bookId: 'inwigilacja' })),
  ...oskarzenie.map((char: any) => ({ ...char, bookId: 'oskarzenie' })),
  ...testament.map((char: any) => ({ ...char, bookId: 'testament' })),
  ...kontratyp.map((char: any) => ({ ...char, bookId: 'kontratyp' })),
  ...umorzenie.map((char: any) => ({ ...char, bookId: 'umorzenie' })),


  //forst
  ...ekspozycja.map((char: any) => ({ ...char, bookId: 'ekspozycja' })),
  ...przewieszenie.map((char: any) => ({ ...char, bookId: 'przewieszenie' })),
  ...trawers.map((char: any) => ({ ...char, bookId: 'trawers' })),
  ...deniwelacja.map((char: any) => ({ ...char, bookId: 'deniwelacja' })),



];