//CHYŁKA
import kasacja from './chylka/Kasacja.json';
import zaginiecie from './chylka/Zaginiecie.json';
import rewizja from './chylka/Rewizja.json';
import immunitet from './chylka/Immunitet.json';
import inwigilacja from './chylka/Inwigilacja.json';
import oskarzenie from './chylka/Oskarzenie.json';
import testament from './chylka/Testament.json';
import kontratyp from './chylka/Kontratyp.json';
import umorzenie from './chylka/Umorzenie.json';
import wyrok from './chylka/Wyrok.json';
import ekstradycja from './chylka/Ekstradycja.json';
import precedens from './chylka/Precedens.json';
import afekt from './chylka/Afekt.json';
import egzekucja from './chylka/Egzekucja.json';
import skazanie from './chylka/Skazanie.json';
import werdykt from './chylka/Werdykt.json';
import zarzut from './chylka/Zarzut.json';
import obrona from './chylka/Obrona.json';
import substytucja from './chylka/Substytucja.json';



//FORST
import ekspozycja from './forst/Ekspozycja.json';
import przewieszenie from './forst/Przewieszenie.json';
import trawers from './forst/Trawers.json';
import deniwelacja from './forst/Deniwelacja.json';
import zerwa from './forst/Zerwa.json';



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
  ...wyrok.map((char: any) => ({ ...char, bookId: 'wyrok' })),
  ...ekstradycja.map((char: any) => ({ ...char, bookId: 'ekstradycja' })),
  ...precedens.map((char: any) => ({ ...char, bookId: 'precedens' })),
  ...afekt.map((char: any) => ({ ...char, bookId: 'afekt' })),
  ...egzekucja.map((char: any) => ({ ...char, bookId: 'egzekucja' })),
  ...skazanie.map((char: any) => ({ ...char, bookId: 'skazanie' })),
  ...werdykt.map((char: any) => ({ ...char, bookId: 'werdykt' })),
  ...zarzut.map((char: any) => ({ ...char, bookId: 'zarzut' })),
  ...obrona.map((char: any) => ({ ...char, bookId: 'obrona' })),
  ...substytucja.map((char: any) => ({ ...char, bookId: 'substytucja' })),



  //forst
  ...ekspozycja.map((char: any) => ({ ...char, bookId: 'ekspozycja' })),
  ...przewieszenie.map((char: any) => ({ ...char, bookId: 'przewieszenie' })),
  ...trawers.map((char: any) => ({ ...char, bookId: 'trawers' })),
  ...deniwelacja.map((char: any) => ({ ...char, bookId: 'deniwelacja' })),
  ...zerwa.map((char: any) => ({ ...char, bookId: 'zerwa' }))
];