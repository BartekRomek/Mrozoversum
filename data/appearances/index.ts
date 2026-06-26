// Importujesz TYLKO te pliki, które faktycznie istnieją w folderach!
import kasacja from './chylka/kasacja.json';
import zaginiecie from './chylka/zaginiecie.json';
// import ekspozycja from './forst/ekspozycja.json';    <-- zakomentowane
// import langer from './langer/langer.json';           <-- zakomentowane

export const appearancesData = [
  ...kasacja.map((char: any) => ({ ...char, bookId: 'kasacja' })),
  ...zaginiecie.map((char: any) => ({ ...char, bookId: 'zaginiecie' })),
  // Te odkomentujesz dopiero, jak dodasz ich pliki .json:
  // ...ekspozycja.map((char: any) => ({ ...char, bookId: 'ekspozycja' })),
  // ...langer.map((char: any) => ({ ...char, bookId: 'langer' })),
];