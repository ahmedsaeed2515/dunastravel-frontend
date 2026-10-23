const fs = require('fs');
const locales = ['en','ar','es','it','pt'];
const data = {
  en:{loc:'Giza, Egypt',star:'3-Star Hotel'},
  ar:{loc:'الجيزة، مصر',star:'فندق ٣ نجوم'},
  es:{loc:'Giza, Egipto',star:'Hotel 3 estrellas'},
  it:{loc:'Giza, Egitto',star:'Hotel 3 stelle'},
  pt:{loc:'Gizé, Egito',star:'Hotel 3 estrelas'}
};
for (const l of locales) {
  const f = 'src/i18n/locales/' + l + '.json';
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!j.hotel) j.hotel = {};
  if (!j.hotel.overview) j.hotel.overview = {};
  if (!j.hotel.room) j.hotel.room = {};
  j.hotel.overview.locationGiza = data[l].loc;
  j.hotel.overview.threeStarHotel = data[l].star;
  if (l === 'ar') j.hotel.room.viewRooms = 'عرض الغرف المتاحة';
  else if (l === 'es') j.hotel.room.viewRooms = 'Ver habitaciones disponibles';
  else if (l === 'it') j.hotel.room.viewRooms = 'Visualizza le camere disponibili';
  else if (l === 'pt') j.hotel.room.viewRooms = 'Ver quartos disponíveis';
  else j.hotel.room.viewRooms = 'View Available Rooms';
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
}
console.log('done');
