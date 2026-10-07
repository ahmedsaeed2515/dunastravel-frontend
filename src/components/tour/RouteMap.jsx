import { useEffect, useRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { fadeInUp } from '../../animations/variants';
import useInViewport from '../../hooks/useInViewport';

const COORDINATES_DATABASE = {
  // Egypt
  "cairo": [30.0444, 31.2357],
  "giza": [29.9792, 31.1342],
  "pyramids": [29.9792, 31.1342],
  "sphinx": [29.9753, 31.1376],
  "luxor": [25.6872, 32.6396],
  "aswan": [24.0889, 32.8998],
  "alexandria": [31.2001, 29.9187],
  "hurghada": [27.2579, 33.8116],
  "sharm": [27.9158, 34.3299],
  "siwa": [29.2032, 25.5189],
  "abu simbel": [22.3372, 31.6258],
  "kom ombo": [24.4711, 32.9469],
  "edfu": [24.9781, 32.8789],
  "philae": [24.0250, 32.8844],
  "karnak": [25.7188, 32.6573],
  "valley of the kings": [25.7402, 32.6014],

  // Turkey
  "istanbul": [41.0082, 28.9784],
  "cappadocia": [38.6431, 34.8281],
  "pamukkale": [37.9221, 29.1212],
  "ephesus": [37.9394, 27.3410],
  "antalya": [36.8969, 30.7133],
  "ankara": [39.9334, 32.8597],
  "konya": [37.8714, 32.4988],
  "bursa": [40.1885, 29.0610],
  "canakkale": [40.1450, 26.4064],
  "troy": [39.9575, 26.2386],
  "kusadasi": [37.8596, 27.2590],
  "pergamum": [39.1325, 27.1842],
  "izmir": [38.4192, 27.1287],

  // Jordan
  "amman": [31.9454, 35.9284],
  "petra": [30.3285, 35.4444],
  "wadi rum": [29.5781, 35.4206],
  "dead sea": [31.5590, 35.4732],
  "jerash": [32.2723, 35.8914],
  "aqaba": [29.5321, 35.0063],
  "madaba": [31.7174, 35.7937],
  "mount nebo": [31.7683, 35.7253],

  // UAE / Dubai
  "dubai": [25.2048, 55.2708],
  "abu dhabi": [24.4539, 54.3773],
  "sharjah": [25.3463, 55.4209],
  "dubai airport": [25.2532, 55.3657],
  "old dubai": [25.2632, 55.2972],
  "jumeirah": [25.1124, 55.1390],
  "burj khalifa": [25.1972, 55.2744],
  "dubai marina": [25.0805, 55.1403],
  "dubai desert": [24.9744, 55.5926],
  "yas island": [24.4970, 54.6063],

  // Morocco
  "marrakech": [31.6295, -7.9811],
  "casablanca": [33.5731, -7.5898],
  "fes": [34.0181, -5.0078],
  "fez": [34.0181, -5.0078],
  "rabat": [34.0209, -6.8416],
  "chefchaouen": [35.1688, -5.2636],
  "tangier": [35.7595, -5.8340],
  "ouarzazate": [30.9189, -6.8931],
  "meknes": [33.8938, -5.5547],
  "essaouira": [31.5085, -9.7595],
  "ait benhaddou": [31.0470, -7.1306],

  // Holy Land
  "jerusalem": [31.7683, 35.2137],
  "bethlehem": [31.7058, 35.2007],
  "nazareth": [32.6996, 35.3035],
  "tel aviv": [32.0853, 34.7818],
  "galilee": [32.8155, 35.5908],
  "jericho": [31.8560, 35.4443],
  "haifa": [32.7940, 34.9896],
  "jaffa": [32.0518, 34.7522],
  "tiberias": [32.7922, 35.5312],
  "cana": [32.7471, 35.3789],

  // Greece
  "athens": [37.9838, 23.7275],
  "mykonos": [37.4467, 25.3289],
  "santorini": [36.3932, 25.4615],
  "delphi": [38.4800, 22.4939],
  "meteora": [39.7135, 21.6253],
  "olympia": [37.6437, 21.6244],
  "thessaloniki": [40.6401, 22.9444],
  "crete": [35.2401, 24.8093],

  // Tunisia
  "tunis": [36.8065, 10.1815],
  "carthage": [36.8578, 10.3276],
  "sidi bou said": [36.8702, 10.3411],
  "hammamet": [36.4000, 10.6167],
  "testour": [36.5510, 9.4447],
  "dougga": [36.4222, 9.2201],
  "el jem": [35.2964, 10.7092],
  "matmata": [33.5424, 9.9674],
  "douz": [33.4667, 9.0167],
  "chott el jerid": [33.7222, 8.4111],
  "tozeur": [33.9198, 8.1335],
  "kairouan": [35.6781, 10.0963]
};

const KEYWORDS_MAP = {
  "cairo": "cairo", "القاهرة": "cairo", "قاهرة": "cairo",
  "giza": "giza", "guiza": "giza", "الجيزة": "giza", "جيزة": "giza",
  "pirâmide": "pyramids", "pirámide": "pyramids", "pyramid": "pyramids", "piramide": "pyramids", "piramidi": "pyramids", "الأهرامات": "pyramids",
  "esfinge": "sphinx", "sphinx": "sphinx", "أبو الهول": "sphinx",
  "luxor": "luxor", "الأقصر": "luxor",
  "aswan": "aswan", "أسوان": "aswan",
  "alexandria": "alexandria", "الإسكندرية": "alexandria",
  "hurghada": "hurghada", "الغردقة": "hurghada",
  "sharm": "sharm", "شرم الشيخ": "sharm",
  "siwa": "siwa", "سيوة": "siwa",
  "abu simbel": "abu simbel", "أبو سمبل": "abu simbel",
  "kom ombo": "kom ombo", "كوم أمبو": "kom ombo",
  "edfu": "edfu", "إدفو": "edfu",
  "philae": "philae", "فيلة": "philae",
  "vales dos reis": "valley of the kings", "valle de los reyes": "valley of the kings", "valley of the kings": "valley of the kings",
  "istanbul": "istanbul", "إسطنبول": "istanbul",
  "cappadocia": "cappadocia", "كبادوكيا": "cappadocia",
  "pamukkale": "pamukkale", "باموكالي": "pamukkale",
  "ephesus": "ephesus", "أفسس": "ephesus",
  "antalya": "antalya", "أنطاليا": "antalya",
  "ankara": "ankara", "أنقرة": "ankara",
  "konya": "konya", "قونية": "konya",
  "bursa": "bursa", "بورصة": "bursa",
  "izmir": "izmir", "إزمير": "izmir",
  "kusadasi": "kusadasi", "كوشاداسي": "kusadasi",
  "canakkale": "canakkale", "جناق قلعة": "canakkale",
  "troy": "troy", "طروادة": "troy",
  "amman": "amman", "عمان": "amman",
  "petra": "petra", "البتراء": "petra",
  "wadi rum": "wadi rum", "وادي رم": "wadi rum",
  "dead sea": "dead sea", "البحر الميت": "dead sea",
  "jerash": "jerash", "جرش": "jerash",
  "aqaba": "aqaba", "العقبة": "aqaba",
  "dubai": "dubai", "دبي": "dubai",
  "dubai airport": "dubai airport", "old dubai": "old dubai",
  "jumeirah": "jumeirah", "burj khalifa": "burj khalifa",
  "dubai marina": "dubai marina", "dubai desert": "dubai desert",
  "yas island": "yas island", "abu dhabi": "abu dhabi",
  "marrakech": "marrakech", "مراكش": "marrakech",
  "casablanca": "casablanca", "الدار البيضاء": "casablanca",
  "fes": "fes", "فاس": "fes", "rabat": "rabat", "الرباط": "rabat",
  "jerusalem": "jerusalem", "القدس": "jerusalem",
  "bethlehem": "bethlehem", "بيت لحم": "bethlehem",
  "nazareth": "nazareth", "الناصرة": "nazareth",
  "tel aviv": "tel aviv", "تل أبيب": "tel aviv",
  "galilee": "galilee", "الجليل": "galilee",
  "athens": "athens", "أثينا": "athens",
  "mykonos": "mykonos", "ميكونوس": "mykonos",
  "santorini": "santorini", "سانتوريني": "santorini",
  "crete": "crete", "كريت": "crete",
  "tunis": "tunis", "تونس": "tunis",
  "carthage": "carthage", "قرطاج": "carthage",
  "sidi bou said": "sidi bou said", "سيدي بوسعيد": "sidi bou said",
  "hammamet": "hammamet", "الحمامات": "hammamet",
  "testour": "testour", "تستور": "testour",
  "dougga": "dougga", "دقة": "dougga",
  "el jem": "el jem", "الجم": "el jem",
  "matmata": "matmata", "مطماطة": "matmata",
  "douz": "douz", "دوز": "douz",
  "chott el jerid": "chott el jerid", "شط الجريد": "chott el jerid",
  "tozeur": "tozeur", "توزر": "tozeur",
  "kairouan": "kairouan", "القيروان": "kairouan"
};

const getCurvePoints = (from, to, numPoints = 50) => {
  const points = [];
  const lat1 = from[0];
  const lng1 = from[1];
  const lat2 = to[0];
  const lng2 = to[1];

  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  const curvature = 0.15;
  const pLat = -dLng * curvature;
  const pLng = dLat * curvature;

  const cLat = midLat + pLat;
  const cLng = midLng + pLng;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * cLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * cLng + t * t * lng2;
    points.push([lat, lng]);
  }
  return points;
};

const CITY_TRANSLATIONS = {
  ar: {
    "cairo": "القاهرة", "giza": "الجيزة", "pyramids": "الأهرامات", "sphinx": "أبو الهول",
    "luxor": "الأقصر", "aswan": "أسوان", "alexandria": "الإسكندرية", "hurghada": "الغردقة",
    "sharm": "شرم الشيخ", "siwa": "سيوة", "abu simbel": "أبو سمبل", "kom ombo": "كوم أمبو",
    "edfu": "إدفو", "philae": "فيلة", "karnak": "الكرنك", "valley of the kings": "وادي الملوك",
    "istanbul": "إسطنبول", "cappadocia": "كبادوكيا", "pamukkale": "باموكالي", "ephesus": "أفسس",
    "antalya": "أنطاليا", "ankara": "أنقرة", "konya": "قونية", "bursa": "بورصة",
    "canakkale": "جناق قلعة", "troy": "طروادة", "kusadasi": "كوشاداسي", "pergamum": "برغامة",
    "izmir": "إزمير", "amman": "عمان", "petra": "البتراء", "wadi rum": "وادي رم",
    "dead sea": "البحر الميت", "jerash": "جرش", "aqaba": "العقبة", "madaba": "مادبا",
    "mount nebo": "جبل نيبو", "dubai": "دبي", "abu dhabi": "أبوظبي", "sharjah": "الشارقة",
    "dubai airport": "مطار دبي", "old dubai": "دبي القديمة", "jumeirah": "جميرا",
    "burj khalifa": "برج خليفة", "dubai marina": "مرسى دبي", "dubai desert": "صحراء دبي",
    "yas island": "جزيرة ياس", "marrakech": "مراكش", "casablanca": "الدار البيضاء",
    "fes": "فاس", "fez": "فاس", "rabat": "الرباط", "chefchaouen": "شفشاون",
    "tangier": "طنجة", "ouarzazate": "ورزازات", "meknes": "مكناس", "essaouira": "الصويرة",
    "ait benhaddou": "آيت بن حدو", "jerusalem": "القدس", "bethlehem": "بيت لحم",
    "nazareth": "الناصرة", "tel aviv": "تل أبيب", "galilee": "الجليل", "jericho": "أريحا",
    "haifa": "حيفا", "jaffa": "يافا", "tiberias": "طبريا", "cana": "قانا",
    "athens": "أثينا", "mykonos": "ميكونوس", "santorini": "سانتوريني", "delphi": "دلفي",
    "meteora": "ميتيورا", "olympia": "أوليمبيا", "thessaloniki": "سالونيك", "crete": "كريت",
    "tunis": "تونس", "carthage": "قرطاج", "sidi bou said": "سيدي بوسعيد", "hammamet": "الحمامات",
    "testour": "تستور", "dougga": "دقة", "el jem": "الجم", "matmata": "مطماطة",
    "douz": "دوز", "chott el jerid": "شط الجريد", "tozeur": "توزر", "kairouan": "القيروان"
  },
  es: {
    "cairo": "El Cairo", "giza": "Guiza", "pyramids": "Pirámides", "sphinx": "Esfinge",
    "luxor": "Lúxor", "aswan": "Aswán", "alexandria": "Alejandría", "hurghada": "Hurghada",
    "sharm": "Sharm El Sheikh", "siwa": "Siwa", "abu simbel": "Abu Simbel", "kom ombo": "Kom Ombo",
    "edfu": "Edfu", "philae": "Philae", "karnak": "Karnak", "valley of the kings": "Valle de los Reyes",
    "istanbul": "Estambul", "cappadocia": "Capadocia", "pamukkale": "Pamukkale", "ephesus": "Éfeso",
    "antalya": "Antalya", "ankara": "Ankara", "konya": "Konya", "bursa": "Bursa",
    "canakkale": "Canakkale", "troy": "Troya", "kusadasi": "Kusadasi", "pergamum": "Pérgamo",
    "izmir": "Esmirna", "amman": "Amán", "petra": "Petra", "wadi rum": "Wadi Rum",
    "dead sea": "Mar Muerto", "jerash": "Jerash", "aqaba": "Áqaba", "madaba": "Mádaba",
    "mount nebo": "Monte Nebo", "dubai": "Dubái", "abu dhabi": "Abu Dabi", "sharjah": "Sharjah",
    "dubai airport": "Aeropuerto de Dubái", "old dubai": "Dubái Antiguo", "jumeirah": "Jumeirah",
    "burj khalifa": "Burj Khalifa", "dubai marina": "Marina de Dubái", "dubai desert": "Desierto de Dubái",
    "yas island": "Isla de Yas", "marrakech": "Marrakech", "casablanca": "Casablanca",
    "fes": "Fez", "fez": "Fez", "rabat": "Rabat", "chefchaouen": "Chaouen",
    "tangier": "Tánger", "ouarzazate": "Uarzazate", "meknes": "Mequinez", "essaouira": "Essaouira",
    "ait benhaddou": "Ait Ben Hadu", "jerusalem": "Jerusalén", "bethlehem": "Belén",
    "nazareth": "Nazaret", "tel aviv": "Tel Aviv", "galilee": "Galilea", "jericho": "Jericó",
    "haifa": "Haifa", "jaffa": "Jaffa", "tiberias": "Tiberíades", "cana": "Caná",
    "athens": "Atenas", "mykonos": "Miconos", "santorini": "Santorini", "delphi": "Delfos",
    "meteora": "Meteora", "olympia": "Olimpia", "thessaloniki": "Tesalónica", "crete": "Creta",
    "tunis": "Túnez", "carthage": "Cartago", "sidi bou said": "Sidi Bou Said", "hammamet": "Hammamet",
    "testour": "Testour", "dougga": "Dougga", "el jem": "El Jem", "matmata": "Matmata",
    "douz": "Douz", "chott el jerid": "Chott el Jerid", "tozeur": "Tozeur", "kairouan": "Kairuán"
  },
  en: {
    "cairo": "Cairo", "giza": "Giza", "pyramids": "Pyramids", "sphinx": "Sphinx",
    "luxor": "Luxor", "aswan": "Aswan", "alexandria": "Alexandria", "hurghada": "Hurghada",
    "sharm": "Sharm El Sheikh", "siwa": "Siwa", "abu simbel": "Abu Simbel", "kom ombo": "Kom Ombo",
    "edfu": "Edfu", "philae": "Philae", "karnak": "Karnak", "valley of the kings": "Valley of the Kings",
    "istanbul": "Istanbul", "cappadocia": "Cappadocia", "pamukkale": "Pamukkale", "ephesus": "Ephesus",
    "antalya": "Antalya", "ankara": "Ankara", "konya": "Konya", "bursa": "Bursa",
    "canakkale": "Canakkale", "troy": "Troy", "kusadasi": "Kusadasi", "pergamum": "Pergamum",
    "izmir": "Izmir", "amman": "Amman", "petra": "Petra", "wadi rum": "Wadi Rum",
    "dead sea": "Dead Sea", "jerash": "Jerash", "aqaba": "Aqaba", "madaba": "Madaba",
    "mount nebo": "Mount Nebo", "dubai": "Dubai", "abu dhabi": "Abu Dhabi", "sharjah": "Sharjah",
    "dubai airport": "Dubai Airport", "old dubai": "Old Dubai", "jumeirah": "Jumeirah",
    "burj khalifa": "Burj Khalifa", "dubai marina": "Dubai Marina", "dubai desert": "Dubai Desert",
    "yas island": "Yas Island", "marrakech": "Marrakech", "casablanca": "Casablanca",
    "fes": "Fes", "fez": "Fez", "rabat": "Rabat", "chefchaouen": "Chefchaouen",
    "tangier": "Tangier", "ouarzazate": "Ouarzazate", "meknes": "Meknes", "essaouira": "Essaouira",
    "ait benhaddou": "Ait Benhaddou", "jerusalem": "Jerusalem", "bethlehem": "Bethlehem",
    "nazareth": "Nazareth", "tel aviv": "Tel Aviv", "galilee": "Galilee", "jericho": "Jericho",
    "haifa": "Haifa", "jaffa": "Jaffa", "tiberias": "Tiberias", "cana": "Cana",
    "athens": "Athens", "mykonos": "Mykonos", "santorini": "Santorini", "delphi": "Delphi",
    "meteora": "Meteora", "olympia": "Olympia", "thessaloniki": "Thessaloniki", "crete": "Crete",
    "tunis": "Tunis", "carthage": "Carthage", "sidi bou said": "Sidi Bou Said", "hammamet": "Hammamet",
    "testour": "Testour", "dougga": "Dougga", "el jem": "El Jem", "matmata": "Matmata",
    "douz": "Douz", "chott el jerid": "Chott el Jerid", "tozeur": "Tozeur", "kairouan": "Kairouan"
  },
  it: {
    "cairo": "Il Cairo", "giza": "Giza", "pyramids": "Piramidi", "sphinx": "Sfingi",
    "luxor": "Luxor", "aswan": "Assuan", "alexandria": "Alessandria", "hurghada": "Hurghada",
    "sharm": "Sharm El Sheikh", "siwa": "Siwa", "abu simbel": "Abu Simbel", "kom ombo": "Kom Ombo",
    "edfu": "Edfu", "philae": "File", "karnak": "Karnak", "valley of the kings": "Valle dei Re",
    "istanbul": "Istanbul", "cappadocia": "Cappadocia", "pamukkale": "Pamukkale", "ephesus": "Efeso",
    "antalya": "Antalya", "ankara": "Ankara", "konya": "Konya", "bursa": "Bursa",
    "canakkale": "Çanakkale", "troy": "Troia", "kusadasi": "Kuşadası", "pergamum": "Pergamo",
    "izmir": "Izmir", "amman": "Amman", "petra": "Petra", "wadi rum": "Wadi Rum",
    "dead sea": "Mar Morto", "jerash": "Jerash", "aqaba": "Aqaba", "madaba": "Madaba",
    "mount nebo": "Monte Nebo", "dubai": "Dubai", "abu dhabi": "Abu Dhabi", "sharjah": "Sharjah",
    "dubai airport": "Aeroporto di Dubai", "old dubai": "Vecchia Dubai", "jumeirah": "Jumeirah",
    "burj khalifa": "Burj Khalifa", "dubai marina": "Marina di Dubai", "dubai desert": "Deserto di Dubai",
    "yas island": "Isola Yas", "marrakech": "Marrakech", "casablanca": "Casablanca",
    "fes": "Fez", "fez": "Fez", "rabat": "Rabat", "chefchaouen": "Chefchaouen",
    "tangier": "Tangeri", "ouarzazate": "Ouarzazate", "meknes": "Meknès", "essaouira": "Essaouira",
    "ait benhaddou": "Ait-Ben-Haddou", "jerusalem": "Gerusalemme", "bethlehem": "Betlemme",
    "nazareth": "Nazareth", "tel aviv": "Tel Aviv", "galilee": "Galilea", "jericho": "Gerico",
    "haifa": "Haifa", "jaffa": "Giaffa", "tiberias": "Tiberiade", "cana": "Cana",
    "athens": "Atene", "mykonos": "Mykonos", "santorini": "Santorini", "delphi": "Delfi",
    "meteora": "Meteora", "olympia": "Olimpia", "thessaloniki": "Salonicco", "crete": "Creta",
    "tunis": "Tunisi", "carthage": "Cartagine", "sidi bou said": "Sidi Bou Saïd", "hammamet": "Hammamet",
    "testour": "Testour", "dougga": "Dougga", "el jem": "El Jem", "matmata": "Matmata",
    "douz": "Douz", "chott el jerid": "Chott el Jerid", "tozeur": "Tozeur", "kairouan": "Kairouan"
  },
  pt: {
    "cairo": "Cairo", "giza": "Gizé", "pyramids": "Pirâmides", "sphinx": "Esfinge",
    "luxor": "Luxor", "aswan": "Assuão", "alexandria": "Alexandria", "hurghada": "Hurghada",
    "sharm": "Sharm El Sheikh", "siwa": "Siwa", "abu simbel": "Abu Simbel", "kom ombo": "Kom Ombo",
    "edfu": "Edfu", "philae": "Philae", "karnak": "Karnak", "valley of the kings": "Vale dos Reis",
    "istanbul": "Istambul", "cappadocia": "Capadócia", "pamukkale": "Pamukkale", "ephesus": "Éfeso",
    "antalya": "Antália", "ankara": "Ancara", "konya": "Konya", "bursa": "Bursa",
    "canakkale": "Çanakkale", "troy": "Tróia", "kusadasi": "Kuşadası", "pergamum": "Pérgamo",
    "izmir": "Esmirna", "amman": "Amã", "petra": "Petra", "wadi rum": "Wadi Rum",
    "dead sea": "Mar Morto", "jerash": "Jerash", "aqaba": "Áqaba", "madaba": "Madaba",
    "mount nebo": "Monte Nebo", "dubai": "Dubai", "abu dhabi": "Abu Dhabi", "sharjah": "Sharjah",
    "dubai airport": "Aeroporto de Dubai", "old dubai": "Dubai Antiga", "jumeirah": "Jumeirah",
    "burj khalifa": "Burj Khalifa", "dubai marina": "Marina de Dubai", "dubai desert": "Deserto de Dubai",
    "yas island": "Ilha de Yas", "marrakech": "Marraquexe", "casablanca": "Casablanca",
    "fes": "Fes", "fez": "Fez", "rabat": "Rabat", "chefchaouen": "Chefchaouen",
    "tangier": "Tânger", "ouarzazate": "Ouarzazate", "meknes": "Meknes", "essaouira": "Essaouira",
    "ait benhaddou": "Ait-Ben-Haddou", "jerusalem": "Jerusalém", "bethlehem": "Belém",
    "nazareth": "Nazaré", "tel aviv": "Tel Aviv", "galilee": "Galileia", "jericho": "Jericó",
    "haifa": "Haifa", "jaffa": "Jaffa", "tiberias": "Tiberíades", "cana": "Caná",
    "athens": "Atenas", "mykonos": "Míconos", "santorini": "Santorini", "delphi": "Delfos",
    "meteora": "Meteora", "olympia": "Olímpia", "thessaloniki": "Tessalónica", "crete": "Creta",
    "tunis": "Túnis", "carthage": "Cartago", "sidi bou said": "Sidi Bou Said", "hammamet": "Hammamet",
    "testour": "Testour", "dougga": "Dougga", "el jem": "El Jem", "matmata": "Matmata",
    "douz": "Douz", "chott el jerid": "Chott el Jerid", "tozeur": "Tozeur", "kairouan": "Kairouan"
  }
};

const getDayLabel = (days, langCode) => {
  if (!days || days.length === 0) return '';
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  let rangeStr = '';
  if (sorted.length === 1) {
    rangeStr = `${sorted[0]}`;
  } else if (sorted.length > 1) {
    const isConsecutive = sorted.every((val, i) => i === 0 || val === sorted[i - 1] + 1);
    if (isConsecutive) {
      rangeStr = `${sorted[0]}-${sorted[sorted.length - 1]}`;
    } else {
      rangeStr = sorted.join(', ');
    }
  }

  const dayWordMap = {
    ar: 'اليوم',
    en: 'Day',
    es: 'Día',
    it: 'Giorno',
    pt: 'Dia',
  };
  const word = dayWordMap[langCode] || 'Day';
  return `${word} ${rangeStr}`;
};

const RouteMap = ({ itinerary, highlights, tourTitle, routeMap }) => {
  const [sectionRef, isVisible] = useInViewport({ rootMargin: '200px', once: false });
  const [leafletInstance, setLeafletInstance] = useState(null);
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  const { t, i18n } = useTranslation();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const timelineRef = useRef(null);
  const animationRef = useRef(null);

  // Lazy load Leaflet library dynamically only when map section enters near-viewport
  useEffect(() => {
    if (!isVisible || leafletInstance) return undefined;
    let active = true;

    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css')
    ]).then(([leafletModule]) => {
      if (!active) return;
      const L = leafletModule.default || leafletModule;
      
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      setLeafletInstance(L);
    }).catch(() => {
      // Ignore load error gracefully
    });

    return () => {
      active = false;
    };
  }, [isVisible, leafletInstance]);

  const locations = useMemo(() => {
    const extracted = [];
    const langCode = (i18n.language || 'en').split('-')[0].toLowerCase();
    const langTranslations = CITY_TRANSLATIONS[langCode] || CITY_TRANSLATIONS['en'];

    const extractText = (val) => {
      if (!val) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'object') {
        return (
          val[langCode] ||
          val.en ||
          val.ar ||
          val.es ||
          val.it ||
          val.pt ||
          val.title ||
          val.description ||
          val.text ||
          ''
        );
      }
      return String(val);
    };

    // 0. If routeMap custom data is passed from dashboard, use it directly!
    const customMapData = routeMap || itinerary?.routeMap || itinerary?.routeMapJsonb;
    if (customMapData && Array.isArray(customMapData.locations) && customMapData.locations.length > 0) {
      return customMapData.locations.map((item, index) => {
        const dbKey = (item.dbKey || 'cairo').toLowerCase();
        const coords = (typeof item.lat === 'number' && typeof item.lng === 'number' && (item.lat !== 0 || item.lng !== 0))
          ? [item.lat, item.lng]
          : (COORDINATES_DATABASE[dbKey] || [30.0444, 31.2357]);

        const nameFromDict = langTranslations[dbKey] || (dbKey.charAt(0).toUpperCase() + dbKey.slice(1));
        const localizedName = extractText(item.nameJsonb) || extractText(item.name) || nameFromDict;
        const localizedDesc = extractText(item.descriptionJsonb) || extractText(item.description) || localizedName;

        const daysArr = Array.isArray(item.daysVisited)
          ? item.daysVisited
          : (typeof item.daysVisited === 'string'
              ? item.daysVisited.split(',').map(n => parseInt(n.trim(), 10)).filter(Boolean)
              : []);

        const dayLabelText = daysArr.length > 0
          ? getDayLabel(daysArr, langCode)
          : `${t('tour.stop', 'Stop')} ${index + 1}`;

        return {
          name: localizedName,
          dbKey: dbKey,
          coords: coords,
          daysVisited: daysArr,
          descriptions: [localizedDesc],
          dayLabel: dayLabelText,
          displayIndex: index + 1,
        };
      });
    }

    const addOrUpdateLocation = (dbKey, descText, dayNum) => {
      const coords = COORDINATES_DATABASE[dbKey];
      if (!coords) return;

      const translatedName = langTranslations[dbKey] || (dbKey.charAt(0).toUpperCase() + dbKey.slice(1));
      const cleanDesc = (descText || '').trim();

      const existingLoc = extracted.find(
        (item) => item.coords[0] === coords[0] && item.coords[1] === coords[1]
      );

      if (existingLoc) {
        if (dayNum && !existingLoc.daysVisited.includes(dayNum)) {
          existingLoc.daysVisited.push(dayNum);
          existingLoc.daysVisited.sort((a, b) => a - b);
        }
        if (cleanDesc && !existingLoc.descriptions.includes(cleanDesc)) {
          existingLoc.descriptions.push(cleanDesc);
        }
      } else {
        extracted.push({
          name: translatedName,
          dbKey: dbKey,
          coords: coords,
          daysVisited: dayNum ? [dayNum] : [],
          descriptions: cleanDesc ? [cleanDesc] : [translatedName],
        });
      }
    };

    // 1. Scan Itinerary FIRST in strict chronological order (Day 1, Day 2, Day 3...)
    const rawItinerary = Array.isArray(itinerary)
      ? itinerary
      : Array.isArray(itinerary?.days)
        ? itinerary.days
        : Array.isArray(itinerary?.itinerary)
          ? itinerary.itinerary
          : [];

    rawItinerary.forEach((day, idx) => {
      const dayNum = day.day || day.dayLabel || idx + 1;
      const rawTexts = [
        extractText(day.title),
        extractText(day.description),
        extractText(day.morning),
        extractText(day.afternoon),
        extractText(day.evening),
        extractText(day.titleDefault),
        extractText(day.descDefault),
        day.titleKey ? t(day.titleKey) : null,
        day.descKey ? t(day.descKey) : null,
      ].filter(Boolean);

      const translatedTexts = [];
      rawTexts.forEach((text) => {
        translatedTexts.push(text);
        const t1En = t(text, { lng: 'en' });
        if (t1En && t1En !== text) translatedTexts.push(t1En);
      });

      const texts = translatedTexts.map((s) => String(s).toLowerCase());
      const combinedText = texts.join(' ');

      const dayMatches = [];
      Object.keys(KEYWORDS_MAP).forEach((keyword) => {
        const index = combinedText.indexOf(keyword);
        if (index !== -1) {
          dayMatches.push({
            keyword,
            dbKey: KEYWORDS_MAP[keyword],
            index,
          });
        }
      });

      // Sort matches by appearance in text so first mentioned city comes first
      dayMatches.sort((a, b) => a.index - b.index);

      const addedInDay = new Set();
      dayMatches.forEach((m) => {
        if (!addedInDay.has(m.dbKey)) {
          addedInDay.add(m.dbKey);
          const rawTitle = extractText(day.title) || extractText(day.titleDefault) || `${t('tour.day', 'Day')} ${dayNum}`;
          const firstLineTitle = rawTitle.split('\n')[0].replace(/^اليوم\s+\S+\s*—?\s*/i, '').trim();
          addOrUpdateLocation(m.dbKey, `${t('tour.day', 'Day')} ${dayNum}: ${firstLineTitle}`, dayNum);
        }
      });
    });

    // 2. Scan Key Highlights SECOND (only for extra details/unlisted cities)
    const rawHighlights = Array.isArray(highlights) ? highlights.filter(Boolean) : [];
    rawHighlights.forEach((hlItem) => {
      const itemText = extractText(hlItem);
      if (!itemText) return;
      const translatedItem = t(itemText, { defaultValue: itemText });
      const textToSearch = `${itemText} ${translatedItem}`.toLowerCase();

      const itemMatches = [];
      Object.keys(KEYWORDS_MAP).forEach((keyword) => {
        const index = textToSearch.indexOf(keyword);
        if (index !== -1) {
          itemMatches.push({
            keyword,
            dbKey: KEYWORDS_MAP[keyword],
            index,
          });
        }
      });

      itemMatches.sort((a, b) => b.keyword.length - a.keyword.length);

      if (itemMatches.length > 0) {
        addOrUpdateLocation(itemMatches[0].dbKey, translatedItem || itemText, null);
      }
    });

    // 3. Fallback coordinates if zero or only 1 location extracted
    const contextSearch = `${tourTitle || ''} ${JSON.stringify(highlights || '')} ${JSON.stringify(itinerary || '')}`.toLowerCase();

    let fallbackKey1 = 'cairo';
    let fallbackKey2 = 'luxor';

    if (contextSearch.includes('turkey') || contextSearch.includes('تركيا') || contextSearch.includes('turquía') || contextSearch.includes('türkiye') || contextSearch.includes('istanbul')) {
      fallbackKey1 = 'istanbul';
      fallbackKey2 = 'cappadocia';
    } else if (contextSearch.includes('jordan') || contextSearch.includes('أردن') || contextSearch.includes('jordania') || contextSearch.includes('petra')) {
      fallbackKey1 = 'amman';
      fallbackKey2 = 'petra';
    } else if (contextSearch.includes('dubai') || contextSearch.includes('uae') || contextSearch.includes('دبي') || contextSearch.includes('إمارات')) {
      fallbackKey1 = 'dubai';
      fallbackKey2 = 'abu dhabi';
    } else if (contextSearch.includes('morocco') || contextSearch.includes('مغرب') || contextSearch.includes('marruecos')) {
      fallbackKey1 = 'marrakech';
      fallbackKey2 = 'fes';
    } else if (contextSearch.includes('greece') || contextSearch.includes('يونان') || contextSearch.includes('grecia')) {
      fallbackKey1 = 'athens';
      fallbackKey2 = 'santorini';
    }

    if (extracted.length === 0) {
      addOrUpdateLocation(fallbackKey1, langTranslations[fallbackKey1] || fallbackKey1, 1);
      addOrUpdateLocation(fallbackKey2, langTranslations[fallbackKey2] || fallbackKey2, 2);
    } else if (extracted.length === 1) {
      const firstCoords = extracted[0].coords;
      const fb1Coords = COORDINATES_DATABASE[fallbackKey1];
      const fb2Coords = COORDINATES_DATABASE[fallbackKey2];

      if (fb1Coords && (fb1Coords[0] !== firstCoords[0] || fb1Coords[1] !== firstCoords[1])) {
        addOrUpdateLocation(fallbackKey1, langTranslations[fallbackKey1] || fallbackKey1, 2);
      } else if (fb2Coords && (fb2Coords[0] !== firstCoords[0] || fb2Coords[1] !== firstCoords[1])) {
        addOrUpdateLocation(fallbackKey2, langTranslations[fallbackKey2] || fallbackKey2, 2);
      }
    }

    return extracted.map((item, index) => {
      const dayLabel = getDayLabel(item.daysVisited, langCode);
      return {
        ...item,
        stepIndex: index + 1,
        dayLabel,
        description: item.descriptions.join('<br/>• '),
      };
    });
  }, [itinerary, highlights, tourTitle, t, i18n.language]);

  useEffect(() => {
    if (!isVisible || !leafletInstance || !mapContainerRef.current || locations.length === 0) return undefined;

    const L = leafletInstance;
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false, // Disable scroll wheel hijacking by default until focused
      attributionControl: false,
    }).setView(locations[0].coords, 10);

    // Enable scroll wheel zoom on click/tap to prevent page scroll trapping on touch devices
    map.once('focus', () => {
      map.scrollWheelZoom.enable();
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    const markers = [];
    locations.forEach((loc, idx) => {
      // Create custom blue badge icon with Day & City Name clearly visible on the map
      const customBlueIcon = L.divIcon({
        className: 'custom-blue-city-marker',
        html: `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -100%);
            cursor: pointer;
            pointer-events: auto;
            white-space: nowrap;
            font-family: 'Cairo', 'Inter', system-ui, -apple-system, sans-serif;
            filter: drop-shadow(0px 4px 12px rgba(15, 23, 42, 0.5));
            user-select: none;
          ">
            <!-- Blue Badge with Day & City Name -->
            <div style="
              background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%);
              color: #ffffff;
              padding: 6px 14px;
              border-radius: 22px;
              font-size: 13px;
              font-weight: 800;
              letter-spacing: 0.3px;
              border: 2px solid #93c5fd;
              box-shadow: 0 4px 14px rgba(37, 99, 235, 0.5);
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 5px;
            ">
              <span style="
                background: #ffffff;
                color: #1d4ed8;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: 900;
                box-shadow: inset 0 0 2px rgba(0,0,0,0.25);
              ">${idx + 1}</span>
              <div style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1.25;">
                ${loc.dayLabel ? `<span style="font-size: 10px; font-weight: 900; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.5px;">${loc.dayLabel}</span>` : ''}
                <span style="text-shadow: 0 1px 2px rgba(0,0,0,0.3); font-size: 14px; font-weight: 800;">${loc.name}</span>
              </div>
            </div>
            
            <!-- Pin Pointer -->
            <div style="
              width: 14px;
              height: 14px;
              background: #2563eb;
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 12px #3b82f6, inset 0 0 4px rgba(0,0,0,0.3);
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker(loc.coords, { icon: customBlueIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Cairo', 'Inter', sans-serif; padding: 6px 4px; min-width: 190px;">
            <div style="font-size: 12px; font-weight: 900; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">
              ${loc.dayLabel || `${t('tour.stop', 'Stop')} ${idx + 1}`}
            </div>
            <div style="font-size: 16px; font-weight: 900; color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; margin-bottom: 7px; display: flex; align-items: center; gap: 6px;">
              <span>📍</span> <span>${loc.name}</span>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #334155; line-height: 1.55;">
              ${loc.description || ''}
            </div>
          </div>
        `);

      marker.on('click', () => {
        setActiveLocationIndex(idx);
      });

      markers.push(marker);
    });

    markersRef.current = markers;

    const latlngs = locations.map((l) => l.coords);
    if (latlngs.length === 1) {
      map.setView(latlngs[0], 11);
      if (markers[0]) {
        setTimeout(() => markers[0].openPopup(), 300);
      }
    } else if (latlngs.length > 1) {
      const bounds = L.latLngBounds(latlngs);
      if (bounds.getSouthWest().equals(bounds.getNorthEast())) {
        map.setView(latlngs[0], 11);
        if (markers[0]) {
          setTimeout(() => markers[0].openPopup(), 300);
        }
      } else {
        map.fitBounds(bounds, { padding: [65, 65] });
      }
    }

    if (locations.length > 1) {
      const pathPoints = [];
      for (let i = 0; i < latlngs.length - 1; i++) {
        const segmentPoints = getCurvePoints(latlngs[i], latlngs[i + 1], 50);
        if (i > 0) segmentPoints.shift();
        pathPoints.push(...segmentPoints);
      }

      L.polyline(pathPoints, {
        color: '#2563eb',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 8',
      }).addTo(map);

      const planeIcon = L.divIcon({
        className: 'plane-marker',
        html: `
          <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transition: transform 0.1s linear; pointer-events: none; will-change: transform;">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" style="filter: drop-shadow(0px 2px 5px rgba(0,0,0,0.55));">
              <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const plane = L.marker(pathPoints[0], { icon: planeIcon }).addTo(map);

      let currentIndex = 0;
      const speed = 0.15;
      const animate = () => {
        if (pathPoints.length < 2) return;
        
        const indexToUse = Math.floor(currentIndex);
        if (indexToUse >= pathPoints.length) {
          currentIndex = 0;
        }

        const currentPoint = pathPoints[Math.floor(currentIndex)];
        plane.setLatLng(currentPoint);

        const nextPoint = pathPoints[Math.floor(currentIndex) + 1] || pathPoints[0];
        if (nextPoint) {
          const dLat = nextPoint[0] - currentPoint[0];
          const dLng = nextPoint[1] - currentPoint[1];
          const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
          const planeDiv = plane.getElement()?.querySelector('div');
          if (planeDiv) {
            planeDiv.style.transform = `rotate(${angle}deg)`;
          }
        }

        currentIndex += speed;
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, [isVisible, leafletInstance, locations]);

  const handleSelectLocation = (loc, index) => {
    setActiveLocationIndex(index);
    if (mapRef.current) {
      mapRef.current.flyTo(loc.coords, Math.max(mapRef.current.getZoom(), 10), {
        duration: 1,
      });
    }
    if (markersRef.current[index]) {
      markersRef.current[index].openPopup();
    }
    if (timelineRef.current) {
      const btn = timelineRef.current.children[index];
      if (btn) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handlePrev = () => {
    if (locations.length === 0) return;
    const newIdx = (activeLocationIndex - 1 + locations.length) % locations.length;
    handleSelectLocation(locations[newIdx], newIdx);
  };

  const handleNext = () => {
    if (locations.length === 0) return;
    const newIdx = (activeLocationIndex + 1) % locations.length;
    handleSelectLocation(locations[newIdx], newIdx);
  };

  const handleResetBounds = () => {
    if (!mapRef.current || locations.length === 0) return;
    const latlngs = locations.map((l) => l.coords);
    if (latlngs.length === 1) {
      mapRef.current.setView(latlngs[0], 11);
    } else if (leafletInstance) {
      const bounds = leafletInstance.latLngBounds(latlngs);
      mapRef.current.fitBounds(bounds, { padding: [65, 65] });
    }
  };

  const scrollTimeline = (direction) => {
    if (timelineRef.current) {
      const isRtl = document.documentElement.dir === 'rtl' || (i18n.language || '').startsWith('ar');
      let offset = direction === 'next' ? 240 : -240;
      if (isRtl) {
        offset = -offset;
      }
      timelineRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (locations.length === 0) return null;

  const currentLocation = locations[activeLocationIndex] || locations[0];

  return (
    <motion.div
      ref={sectionRef}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mt-12 sm:mt-16 w-full max-w-7xl mx-auto px-2 sm:px-4"
    >
      {/* Header */}
      <div className="mb-6 sm:mb-10 text-center relative">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 dark:bg-gold-500/25 border border-amber-300/70 dark:border-gold-400/50 mb-3 shadow-sm">
          <FaMapMarkedAlt className="text-amber-800 dark:text-gold-300 text-xs" />
          <span className="text-amber-900 dark:text-gold-300 font-black text-[11px] sm:text-xs md:text-sm tracking-[3px] sm:tracking-[4px] uppercase block">
            {t('tour.routeMapSub', 'EXPLORE THE JOURNEY ROUTE')}
          </span>
        </div>
        <h2
          className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white dark:drop-shadow-[0_2px_15px_rgba(255,255,255,0.35)] leading-snug font-display tracking-tight"
          style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
        >
          {t('tour.routeMapTitle', 'Interactive Itinerary Journey Map')}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gold-500 to-amber-600 dark:via-gold-400 rounded-full" />
          <div className="w-3 h-3 rounded-full bg-gold-500 dark:bg-gold-400 shadow-[0_0_12px_rgba(245,166,35,0.9)] ring-4 ring-gold-500/20" />
          <div className="w-16 h-1 bg-gradient-to-l from-transparent via-gold-500 to-amber-600 dark:via-gold-400 rounded-full" />
        </div>
      </div>

      {/* Main Map Box with Floating HUD Overlay */}
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-500/40 dark:border-gold-500/60 h-[380px] sm:h-[460px] md:h-[540px] lg:h-[580px] relative z-10 bg-slate-950 [&_.leaflet-div-icon]:!bg-transparent [&_.leaflet-div-icon]:!border-none [&_.leaflet-tile-pane]:dark:filter [&_.leaflet-tile-pane]:dark:brightness-[0.85] [&_.leaflet-tile-pane]:dark:contrast-[1.15] [&_.leaflet-tile-pane]:dark:invert-[0.9] [&_.leaflet-tile-pane]:dark:hue-rotate-[180deg]">
        
        {/* Floating Quick Navigation HUD Control Bar */}
        {locations.length > 0 && isVisible && leafletInstance && (
          <div className="absolute top-3 left-3 right-3 sm:left-auto sm:right-3 z-[400] flex items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md border border-blue-500/30 text-white px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl shadow-xl max-w-full sm:max-w-md">
            <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-blue-400 tracking-wider truncate">
                  {currentLocation?.dayLabel || `${t('tour.stop', 'Stop')} ${activeLocationIndex + 1}`}
                </span>
                <span className="text-xs sm:text-sm font-extrabold truncate">{currentLocation?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handlePrev}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-blue-600 border border-slate-700 text-white flex items-center justify-center text-xs transition-all active:scale-95 shadow-md"
                title="Previous Stop"
              >
                ◀
              </button>
              <span className="text-[10px] sm:text-xs font-bold text-slate-300 px-1">
                {activeLocationIndex + 1}/{locations.length}
              </span>
              <button
                onClick={handleNext}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-blue-600 border border-slate-700 text-white flex items-center justify-center text-xs transition-all active:scale-95 shadow-md"
                title="Next Stop"
              >
                ▶
              </button>
              <button
                onClick={handleResetBounds}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-gold-500 border border-slate-700 text-white hover:text-slate-950 flex items-center justify-center text-xs transition-all ml-0.5 active:scale-95 shadow-md"
                title="Reset Map Bounds"
              >
                🔄
              </button>
            </div>
          </div>
        )}

        {(!isVisible || !leafletInstance) ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gold-400 font-bold bg-slate-900 rounded-2xl">
            <div className="w-9 h-9 border-3 border-gold-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest text-gold-300">{t('tour.loadingMap', 'Loading interactive route map...')}</span>
          </div>
        ) : (
          <div ref={mapContainerRef} className="w-full h-full touch-pan-x touch-pan-y" style={{ direction: 'ltr' }} />
        )}
      </div>

      {/* Interactive Day-by-Day Journey Route Timeline */}
      {locations.length > 0 && (
        <div className="mt-4 sm:mt-6 w-full bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gold-600 dark:text-gold-400 flex items-center gap-1.5">
              <span>🗺️</span> <span>{t('tour.dayByDayRoute', 'Day-by-Day Journey Route')}</span>
            </span>

            {/* Navigation Arrows Replacing Scrollbar */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollTimeline('prev')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-blue-600 border border-slate-700 text-white flex items-center justify-center text-xs sm:text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-md"
                title="Previous Cards"
              >
                {i18n.language === 'ar' ? '▶' : '◀'}
              </button>
              <button
                onClick={() => scrollTimeline('next')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-blue-600 border border-slate-700 text-white flex items-center justify-center text-xs sm:text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-md"
                title="Next Cards"
              >
                {i18n.language === 'ar' ? '◀' : '▶'}
              </button>
              <span className="text-[10px] sm:text-xs text-slate-400 font-extrabold bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700 ml-1">
                {locations.length} {t('tour.stops', 'Stops')}
              </span>
            </div>
          </div>

          <div
            ref={timelineRef}
            className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto py-2 px-1 scrollbar-none snap-x snap-mandatory [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {locations.map((loc, idx) => {
              const isActive = activeLocationIndex === idx;
              return (
                <button
                  key={loc.dbKey + idx}
                  onClick={() => handleSelectLocation(loc, idx)}
                  className={`flex-shrink-0 snap-center flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400 text-white shadow-lg shadow-blue-500/40 scale-105 z-10 ring-2 ring-blue-400/50'
                      : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:border-blue-500/50'
                  }`}
                >
                  <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black transition-colors ${
                    isActive ? 'bg-white text-blue-700 shadow-md' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="text-right flex flex-col min-w-0">
                    {loc.dayLabel && (
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                        isActive ? 'text-blue-100' : 'text-blue-400'
                      }`}>
                        {loc.dayLabel}
                      </span>
                    )}
                    <span className="text-xs sm:text-sm font-extrabold whitespace-nowrap">{loc.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RouteMap;
