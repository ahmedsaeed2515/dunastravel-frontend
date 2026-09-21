import { getOptimizedCloudinaryUrl } from '../utils/cloudinary';

const rawGalleryImages = [
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783023886/3776ecde-249e-4183-9840-e9fd900ad96b_xvmumu.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783023877/2ec72126-709b-4c8d-8f7b-a592d212cc3b_czpoig.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783023865/80f6f47a-4938-4684-aaf1-b1e61d44dab6_n8vdtl.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783023927/dad14822-455c-419c-8627-32b3daebef90_akfw3l.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783024003/d34eeca3-6bc8-4a19-aa18-bf13404bb11b_n0f8zn.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783024053/66dc2b5e-f90d-424f-b9a7-4164b52f4e5a_eoqd3p.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783024062/071f261a-2ab6-48b5-a370-c47ad7889be3_immde1.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783024072/400a841d-18b7-4915-8483-f9a3346651cf_ocdouu.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783024090/9788c6d2-7046-4ce0-aa64-a0adcbe1a54d_omcrnc.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/5_upvijm.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/6_q4vcdg.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/8_mpyvu4.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/11_xydddd.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/10_t3dnh6.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026772/12_fukk6b.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026772/14_z5msnu.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026772/15_rrczuy.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026773/17_wpxrtt.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026773/18_hbfrt1.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026773/13_wtazze.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026773/20_riy2ce.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026773/19_suxy3c.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026774/21_gqrhmg.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026774/1_uidqje.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026774/2_h2krys.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026775/22_gywthx.jpg", dest: "Gallery", tag: "Photo" },
  { src: "https://res.cloudinary.com/degbrq3ck/image/upload/v1783026775/3_rbjrys.jpg", dest: "Gallery", tag: "Photo" },
];

export const galleryImages = rawGalleryImages.map((img) => ({
  ...img,
  src: getOptimizedCloudinaryUrl(img.src, { width: 800 }),
}));

export const videos = [
  {
    publicId: "Despu%C3%A9s_de_una_intensa_jornada_en_Bogot%C3%A1__en_Dunas_Travel_compartimos_una_cena_exclusiva_con_nuestros_partners_estrat%C3%A9gicos._480P_SD_sv2pei",
    title: {
      ar: "عشاء خاص مع الشركاء في بوغوتا",
      en: "Dinner with Partners in Bogotá",
      es: "Cena con Socios en Bogotá",
      pt: "Jantar com Parceiros em Bogotá",
      it: "Cena con i Partner a Bogotá"
    },
    description: {
      ar: "لقاء عشاء حصري للاحتفال بشراكاتنا الإستراتيجية بعد حدث ناجح في كولومبيا.",
      en: "An exclusive dinner event celebrating our strategic partnerships after a successful event in Colombia.",
      es: "Un evento de cena exclusivo celebrando nuestras alianzas estratégicas tras un exitoso evento en Colombia.",
      pt: "Um evento exclusivo de jantar celebrando nossas parcerias estratégicas após um evento de sucesso na Colômbia.",
      it: "Un evento cenacolo esclusivo per celebrare le nostre partnership strategiche dopo un successo in Colombia."
    }
  },
  {
    publicId: "Somos_Dunas_Travel_Group__480P_SD_gxfsxm",
    title: {
      ar: "العرض التقديمي لمجموعة دوناس ترافيل",
      en: "Dunas Travel Group Presentation",
      es: "Presentación del Grupo Dunas Travel",
      pt: "Apresentação do Grupo Dunas Travel",
      it: "Presentazione del Gruppo Dunas Travel"
    },
    description: {
      ar: "استعراض شامل لخدماتنا الفاخرة وقيمنا والتزامنا بتقديم أعلى معايير السفر والسياحة.",
      en: "A comprehensive presentation showcasing our premium services, values, and commitment to luxury travel.",
      es: "Una presentación completa que muestra nuestros servicios de alta gama, valores y compromiso con los viajes de lujo.",
      pt: "Uma apresentação abrangente demonstrando nossos serviços premium, valores e compromisso com viagens de luxo.",
      it: "Una presentazione completa che mostra i nostri servizi di alto livello, i valori e l'impegno per i viaggi di lusso."
    }
  },
  {
    publicId: "VID-20260611-WA0001_az82kl",
    title: {
      ar: "ذكريات رحلة كروز النيل",
      en: "Nile Cruise Memories",
      es: "Recuerdos del Crucero por el Nilo",
      pt: "Memórias do Cruzeiro no Nilo",
      it: "Ricordi della Crociera sul Nilo"
    },
    description: {
      ar: "مشاهد بانورامية ولحظات فاخرة تم التقاطها على متن رحلاتنا البحرية الخالدة في نهر النيل.",
      en: "Scenic views and luxury moments captured on board our premium Nile Cruise journey.",
      es: "Vistas panorámicas y momentos de lujo capturados a bordo de nuestro crucero por el Nilo.",
      pt: "Vistas panorâmicas e momentos de luxo capturados a bordo da nossa viagem de cruzeiro no Nilo.",
      it: "Viste panoramiche e momenti di lusso immortalati a bordo della nostra crociera sul Nilo."
    }
  },
  {
    publicId: "VID-20260623-WA0112_xmyc5z",
    title: {
      ar: "مغامرة الصحراء وسحر الكثبان",
      en: "Desert Adventure",
      es: "Aventura en el Desierto",
      pt: "Aventura no Deserto",
      it: "Avventura nel Deserto"
    },
    description: {
      ar: "تجربة سفاري مثيرة بين الكثبان الذهبية وعشاء سفاري تقليدي في دبي.",
      en: "Thrilling dune bashing and traditional desert camp experience in Dubai's golden dunes.",
      es: "Emocionante recorrido por las dunas y experiencia en un campamento tradicional en Dubái.",
      pt: "Emocionante passeio pelas dunas e experiência em acampamento tradicional nas dunas de Dubai.",
      it: "Emozionante tour tra le dune ed esperienza in un campo tradizionale nel deserto di Dubai."
    }
  },
  {
    publicId: "VID-20260611-WA0000_mwgayg",
    title: {
      ar: "جولة بين آثار ومعابد مصر الخالدة",
      en: "Egypt Historical Sites Walkthrough",
      es: "Recorrido por los Sitios Históricos de Egipto",
      pt: "Passeio pelos Sítios Históricos do Egito",
      it: "Tour dei Siti Storici dell'Egitto"
    },
    description: {
      ar: "استكشاف الأهرامات والمعابد التاريخية برفقة أفضل مرشدينا السياحيين.",
      en: "Discovering ancient relics, pyramids, and columns with our expert guides.",
      es: "Descubriendo reliquias antiguas, pirámides y templos con nuestros guías expertos.",
      pt: "Descobrindo relíquias antigas, pirâmides e templos com nossos guias especialistas.",
      it: "Alla scoperta di antiche reliquie, piramidi e templi con le nostre guide esperte."
    }
  },
  {
    publicId: "%EF%B8%8F_Viagem_inteligente_come%C3%A7a_no_planejamento_certo_480P_SD_s3dyjb",
    title: {
      ar: "دليل التخطيط الذكي للسفر",
      en: "Smart Travel Planning Guide",
      es: "Guía de Planificación Inteligente de Viajes",
      pt: "Guia de Planejamento Inteligente de Viagem",
      it: "Guida alla Pianificazione Intelligente dei Viaggi"
    },
    description: {
      ar: "نصائح ذهبية وكيفية الاستعداد لعطلتك القادمة مع خبراء دوناس ترافيل.",
      en: "Pro tips on how to prepare for your next holiday with expert advice from Dunas Travel advisors.",
      es: "Consejos profesionales sobre cómo prepararse para sus próximas vacaciones con asesores de Dunas Travel.",
      pt: "Dicas profissionais sobre como se preparar para suas próximas férias com especialistas da Dunas Travel.",
      it: "Consigli di esperti su come prepararsi per la prossima vacanza con gli consulenti Dunas Travel."
    }
  },
  {
    publicId: "VID-20260623-WA0109_lxcv2r",
    title: {
      ar: "جولة الفنادق والقصور الفاخرة",
      en: "Palace and Luxury Hotels Tour",
      es: "Tour de Palacios y Hoteles de Lujo",
      pt: "Tour por Palácios e Hotéis de Luxo",
      it: "Tour di Palazzi e Hotel di Lusso"
    },
    description: {
      ar: "استعراض لأفخم الفنادق 5 نجوم والأجنحة الملكية مع إطلالات ساحرة.",
      en: "A tour of selected 5-star accommodations, pool suites, and stunning room views.",
      es: "Un recorrido por alojamientos de 5 estrellas, suites con piscina y vistas espectaculares.",
      pt: "Um passeio por acomodações 5 estrelas selecionadas, suítes com piscina e vistas deslumbrantes.",
      it: "Un tour di sistemazioni a 5 stelle selezionate, suite con piscina e viste mozzafiato."
    }
  },
  {
    publicId: "Temos_grande_honra_em_receber_este_reconhecimento_da_Lusanova_como__Melhores_Parceiros_2025_._480P_SD_rgbhr5",
    title: {
      ar: "جائزة لوزانوفا لأفضل شريك 2025",
      en: "Lusanova Best Partners 2025 Award",
      es: "Premio Lusanova Mejores Socios 2025",
      pt: "Prêmio Lusanova Melhores Parceiros 2025",
      it: "Premio Lusanova Migliori Partner 2025"
    },
    description: {
      ar: "الاحتفال بتكريمنا كأفضل شريك سياحي من لوزانوفا لعام 2025.",
      en: "Celebrating our recognition as a top travel partner by Lusanova in 2025.",
      es: "Celebrando nuestro reconocimiento como uno de los mejores socios de viajes por Lusanova en 2025.",
      pt: "Celebrando nosso reconhecimento como um dos melhores parceiros de viagem pela Lusanova em 2025.",
      it: "Festeggiando il nostro riconoscimento come uno dei migliori partner di viaggio da Lusanova nel 2025."
    }
  }
];
