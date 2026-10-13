import type { Locale } from "./messages";

export type ActivityText = {
  title: string;
  blurb: string;
  duration: string;
  imageAlt: string;
  offers?: string[];
};

export type CategoryText = {
  title: string;
  kicker: string;
  points?: string[];
};

export type CatalogText = {
  periods: Record<string, string>;
  categories: Record<string, CategoryText>;
  activities: Record<string, ActivityText>;
};

const pt: CatalogText = {
  periods: {
    dawn: "Madrugada",
    morning: "Manhã",
    midday: "Meio-dia",
    afternoon: "Tarde",
    sunset: "Pôr do sol",
    evening: "Noite",
  },
  categories: {
    cars: {
      title: "Passeios de carro",
      kicker: "Com motorista, num clássico, ou a costa no seu tempo.",
      points: ["Limusina", "Carros de época e clássicos", "Uma viatura sua", "Transfers"],
    },
    water: {
      title: "Passeios de barco privados",
      kicker: "As grutas, um iate só para si, e a hora que escolher.",
    },
    sport: {
      title: "Desportos náuticos",
      kicker: "A baía, a prancha e o mar aberto.",
    },
    aqua: {
      title: "Parques aquáticos",
      kicker: "Um dia inteiro na água, para todo o grupo.",
    },
    wine: {
      title: "Vinho e mesa",
      kicker: "Os vinhos da região, e uma mesa à altura.",
    },
    walking: {
      title: "A pé e a costa",
      kicker: "O trilho, as enseadas e as vilas logo no interior.",
    },
    balloon: {
      title: "Voos de balão",
      kicker: "A costa, logo após o amanhecer.",
    },
    land: {
      title: "Pelo interior",
      kicker: "Os trilhos do interior, de jipe, buggy ou moto-quatro.",
    },
    horse: {
      title: "Passeios a cavalo",
      kicker: "As dunas, a praia e um cavalo à medida de quem monta.",
      points: ["Passeios acompanhados", "Aulas privadas", "Qualquer nível", "Uma carruagem, se preferir não montar"],
    },
    more: {
      title: "Outras experiências",
      kicker: "O ar, a vila, e um dia feito à sua volta.",
    },
    rental: {
      title: "Aluguer de viatura",
      kicker: "Um carro à sua espera, entre as experiências.",
      points: ["Carros escolhidos", "Levantado no seu hotel", "Ao dia"],
    },
  },
  activities: {
    "classic-roadster": {
      title: "Passeios de roadster clássico",
      blurb: "Uma hora de capota aberta ao longo da costa, na luz do fim do dia.",
      duration: "Cerca de 2 horas",
      imageAlt: "Descapotável amarelo junto ao mar",
    },
    "vintage-cars": {
      title: "Passeios em carros de época",
      blurb: "Clássicos tratados, e uma tarde sem pressa entre aldeias.",
      duration: "Cerca de 3 horas",
      imageAlt: "Automóvel antigo com o seu condutor",
    },
    "benagil-boat": {
      title: "Passeios de barco e grutas de Benagil",
      blurb: "Uma aproximação privada à gruta, e o óculo lá em cima.",
      duration: "Cerca de 2 horas",
      imageAlt: "Barcos de passeio à boca de uma gruta",
    },
    "dolphin-watching": {
      title: "Observação de golfinhos",
      blurb: "Uma espera paciente pelos golfinhos selvagens, com quem conhece estas águas.",
      duration: "Cerca de 2,5 horas",
      imageAlt: "Golfinho a saltar do mar",
    },
    parasailing: {
      title: "Parasailing",
      blurb: "Uma subida breve sobre Albufeira, com a costa estendida em baixo.",
      duration: "Cerca de 1 hora",
      imageAlt: "Duas pessoas sob um para-quedas de tração",
    },
    "banana-boat": {
      title: "Banana boat",
      blurb: "Um reboque curto pela baía, para quem quer a espuma.",
      duration: "Cerca de 30 minutos",
      imageAlt: "Banana boat amarelo na areia",
    },
    airstream: {
      title: "Anel insuflável",
      blurb: "Um anel largo, rebocado num arco lento atrás do barco.",
      duration: "Cerca de 30 minutos",
      imageAlt: "Um insuflável rebocado atrás de um barco de recreio",
    },
    "drift-slider": {
      title: "Drift slider",
      blurb: "Um rebocável baixo, e uma longa curva ao longo do rasto.",
      duration: "Cerca de 30 minutos",
      imageAlt: "Uma prancha rebocável a cortar a água",
    },
    kayak: {
      title: "Caiaque",
      blurb: "Uma remada acompanhada até à gruta de Benagil, ao seu ritmo.",
      duration: "Cerca de 2 horas",
      imageAlt: "Caiaque com pagaia numa água calma",
    },
    sup: {
      title: "Paddle em pé",
      blurb: "Uma prancha e uma pagaia em água quieta, com as arribas perto.",
      duration: "Cerca de 1,5 horas",
      imageAlt: "Duas pessoas de pé em pranchas de paddle",
    },
    "pedal-boats": {
      title: "Barcos a pedais",
      blurb: "Uma hora fácil, perto da praia.",
      duration: "Cerca de 1 hora",
      imageAlt: "Pedalinho com quatro pessoas",
    },
    "yacht-charter": {
      title: "Charter de iate",
      blurb: "Um iate com tripulação, a partir da marina, reservado ao seu grupo.",
      duration: "Meio dia",
      imageAlt: "Iate à vela no mar aberto",
    },
    "yacht-exclusive": {
      title: "Iate exclusivo",
      blurb: "O iate só para si: os seus convidados, a sua rota, a sua hora.",
      duration: "Cerca de 3 horas",
      imageAlt: "Um grande iate a motor em mar aberto",
    },
    "watersports-private": {
      title: "Desportos náuticos, só para si",
      blurb: "Um barco e um skipper, e apenas os desportos que escolher.",
      duration: "Cerca de 2 horas",
      imageAlt: "Várias motas de água no mar aberto",
    },
    jetski: {
      title: "Jet ski",
      blurb: "Um percurso acompanhado ao largo de Albufeira, ao ritmo que marcar.",
      duration: "Cerca de 30 a 60 minutos",
      imageAlt: "Jet skis alinhados na água",
    },
    surfing: {
      title: "Aulas de surf",
      blurb: "Instrução na areia e depois na água. Uma onda mais mansa na costa sul, ou a ondulação da costa oeste.",
      duration: "Cerca de 2 horas",
      imageAlt: "Um surfista com a prancha ao longo da praia",
    },
    "speedboat-benagil": {
      title: "Lancha até Benagil",
      blurb: "Uma lancha de recreio ao longo das arribas e para dentro da gruta.",
      duration: "Cerca de 1,5 horas",
      imageAlt: "O barco branco a aproximar-se da gruta de Benagil",
    },
    "wine-food": {
      title: "Prova de vinhos",
      blurb: "Uma prova de vinhos do Algarve, com a cozinha da costa ao lado.",
      duration: "Cerca de 3 horas",
      imageAlt: "Copos de vinho junto a pão e um prato servido",
    },
    "cliff-walk": {
      title: "Caminhada costeira",
      blurb: "De Lagos em direção a Luz: passadiços, enseadas e a vista longa.",
      duration: "Cerca de 3 horas",
      imageAlt: "Pessoas num trilho acima do mar",
    },
    "balloon-flight": {
      title: "Balão de ar quente",
      blurb: "Um voo ao nascer do sol sobre a costa e o barrocal, e um brinde ao aterrar.",
      duration: "Manhã, voo de cerca de 1 hora",
      imageAlt: "Balões de ar quente sobre um lago",
    },
    "beach-history": {
      title: "Praia e história",
      blurb: "A Praia da Marinha, as enseadas e as vilas logo no interior.",
      duration: "Cerca de 3 horas",
      imageAlt: "Gruta e falésias ao longo da costa",
    },
    "jeep-safari": {
      title: "Safari de jipe",
      blurb: "Com guia ou ao seu volante, nos trilhos que a maior parte dos visitantes não vê.",
      duration: "Meio dia",
      imageAlt: "Jeep Wrangler verde",
    },
    "buggy-tours": {
      title: "Passeios de buggy",
      blurb: "Meio dia, ou o dia inteiro com almoço na serra. Buggies abertos por pinhal, trilho e estradas da arriba.",
      duration: "Meio dia ou dia inteiro",
      imageAlt: "Um buggy aberto a atravessar a areia",
    },
    "quad-half": {
      title: "Passeio de quad, meio dia",
      blurb: "Meio dia em trilhos do interior, um quad por pessoa.",
      duration: "Meio dia",
      imageAlt: "Quads estacionados na areia",
    },
    "private-tours": {
      title: "Como preferir",
      blurb: "Diga-nos como quer o dia. Organizamo-lo à volta do seu grupo.",
      duration: "O seu horário",
      imageAlt: "Enseada quieta e uma praia vazia",
    },
    "horse-riding": {
      title: "Passeios a cavalo",
      blurb: "Quinta da Saudade. Um cavalo à medida de quem monta.",
      duration: "Cerca de 1 a 2 horas",
      imageAlt: "Cavaleiros da Quinta da Saudade ao longo das dunas",
      offers: ["Passeio na praia e nas dunas", "Passeio ao pôr do sol", "Passeio acompanhado", "Aula privada"],
    },
    "chef-sunset": {
      title: "Chef a bordo ao pôr do sol",
      blurb: "Um serviço de alta cozinha a bordo, enquanto a costa escurece.",
      duration: "Cerca de 3 horas",
      imageAlt: "Um prato de alta cozinha com gambas",
    },
    "brunch-benagil": {
      title: "Brunch e grutas de Benagil",
      blurb: "Uma manhã nas grutas de Benagil e, depois, um brunch costeiro em terra.",
      duration: "Cerca de 4 horas",
      imageAlt: "Peixe grelhado, gambas e limão",
    },
    "sunset-party": {
      title: "Festa de barco ao pôr do sol",
      blurb: "Uma noite no convés, um copo na mão, a costa na última luz.",
      duration: "Cerca de 3 horas",
      imageAlt: "Pôr do sol sobre água calma",
    },
    catamaran: {
      title: "Passeios de catamarã",
      blurb: "Um convés largo e estável, sombra por cima e tempo para nadar.",
      duration: "Cerca de 3 horas",
      imageAlt: "O catamarã da Discover Tours ao longo das arribas",
    },
    "rent-a-car": {
      title: "Aluguer de viatura",
      blurb: "Uma viatura da Auto-Prudente, levantada quando o dia é seu.",
      duration: "Dia inteiro",
      imageAlt: "Uma cliente num descapotável, da Auto-Prudente",
    },
    limo: {
      title: "Limusina",
      blurb: "Um Mercedes para a noite, o aeroporto ou uma celebração ao longo da costa.",
      duration: "Conforme o combinado",
      imageAlt: "Convidados no interior de uma limusina do Algarve",
    },
    transfers: {
      title: "Transfers",
      blurb: "Um motorista e um carro entre o aeroporto, o hotel e a costa.",
      duration: "Conforme o combinado",
      imageAlt: "Um Mercedes preto à porta de um hotel",
    },
    "jet-boat": {
      title: "Lancha privada",
      blurb: "Uma lancha rápida e privada, a partir de Vilamoura, ao longo das arribas e até às grutas.",
      duration: "Cerca de 2 horas",
      imageAlt: "Uma lancha branca e vermelha, Take Off, na marina",
    },
    xride: {
      title: "Barco privado com a X-Ride",
      blurb: "Uma saída privada para golfinhos e grutas, com a X-Ride.",
      duration: "Cerca de 2 horas",
      imageAlt: "O barco laranja da X-Ride em andamento",
    },
    "water-ski": {
      title: "Esqui aquático",
      blurb: "Um reboque na baía de Vilamoura, com instrução se a quiser.",
      duration: "Cerca de 30 minutos",
      imageAlt: "Um esquiador aquático diante de arribas claras",
    },
    zoomarine: {
      title: "Zoomarine",
      blurb: "Um dia no parque marinho da Guia: os espetáculos, a água e os animais.",
      duration: "Um dia inteiro",
      imageAlt: "Zoomarine",
    },
    "slide-splash": {
      title: "Slide & Splash",
      blurb: "O parque aquático de Lagoa: escorregas, piscinas e um dia sem horário apertado.",
      duration: "Um dia inteiro",
      imageAlt: "Vista aérea do Slide & Splash, em Lagoa",
    },
    skydive: {
      title: "Paraquedismo",
      blurb: "Um salto em tandem sobre a costa, com a Skydive Algarve.",
      duration: "Cerca de meio dia",
      imageAlt: "Um salto de paraquedas em tandem sobre o Algarve",
    },
    "tuk-tuk": {
      title: "Tuk-tuk",
      blurb: "Um tuk-tuk elétrico pelas ruas antigas, ao passo de quem caminha.",
      duration: "Cerca de 1 hora",
      imageAlt: "Um tuk-tuk elétrico",
    },
    "tourist-train": {
      title: "Comboio turístico",
      blurb: "O comboio pequeno por Albufeira, para uma primeira vista da vila.",
      duration: "Cerca de 1 hora",
      imageAlt: "O comboio azul e amarelo da Turistrem",
    },
  },
};

const fr: CatalogText = {
  periods: {
    dawn: "Aube",
    morning: "Matin",
    midday: "Midi",
    afternoon: "Après-midi",
    sunset: "Coucher du soleil",
    evening: "Soir",
  },
  categories: {
    cars: {
      title: "Tours en voiture",
      kicker: "Avec chauffeur, dans une classique, ou la côte à votre rythme.",
      points: ["Limousine", "Voitures anciennes et classiques", "Une voiture à vous", "Transferts"],
    },
    water: {
      title: "Sorties en bateau privées",
      kicker: "Les grottes, un yacht pour vous seuls, et l’heure que vous choisissez.",
    },
    sport: {
      title: "Sports nautiques",
      kicker: "La baie, la planche, et la mer ouverte.",
    },
    aqua: {
      title: "Parcs aquatiques",
      kicker: "Une journée dans l’eau, pour tout le groupe.",
    },
    wine: {
      title: "Vin et table",
      kicker: "Les vins de la région, et une table à leur mesure.",
    },
    walking: {
      title: "À pied et la côte",
      kicker: "Le sentier, les criques, et les villages juste à l’intérieur.",
    },
    balloon: {
      title: "Vols en montgolfière",
      kicker: "La côte, juste après l’aube.",
    },
    land: {
      title: "À terre",
      kicker: "Les pistes de l’intérieur, en jeep, buggy ou quad.",
    },
    horse: {
      title: "Équitation",
      kicker: "Les dunes, le rivage, et un cheval adapté à celui qui monte.",
      points: ["Promenades guidées", "Leçons privées", "Tous les niveaux", "Une calèche, si vous préférez ne pas monter"],
    },
    more: {
      title: "Autres expériences",
      kicker: "L’air, la ville, et une journée arrangée autour de vous.",
    },
    rental: {
      title: "Location de voiture",
      kicker: "Une voiture qui vous attend, entre les expériences.",
      points: ["Des voitures choisies", "Prise à votre hôtel", "À la journée"],
    },
  },
  activities: {
    "classic-roadster": {
      title: "Tours en roadster classique",
      blurb: "Une heure décapotée le long de la côte, dans la lumière tardive.",
      duration: "Environ 2 heures",
      imageAlt: "Cabriolet jaune garé au bord de la mer",
    },
    "vintage-cars": {
      title: "Tours en voitures anciennes",
      blurb: "Des classiques soignés, et un après-midi sans hâte entre les villages.",
      duration: "Environ 3 heures",
      imageAlt: "Automobile ancienne avec son conducteur",
    },
    "benagil-boat": {
      title: "Bateau et grottes de Benagil",
      blurb: "Une approche privée de la grotte marine, et l’oculus au-dessus.",
      duration: "Environ 2 heures",
      imageAlt: "Bateaux de promenade à l’entrée d’une grotte",
    },
    "dolphin-watching": {
      title: "Observation des dauphins",
      blurb: "Une attente patiente des dauphins sauvages, avec quelqu’un qui connaît cette eau.",
      duration: "Environ 2 h 30",
      imageAlt: "Dauphin bondissant hors de la mer",
    },
    parasailing: {
      title: "Parachute ascensionnel",
      blurb: "Une courte montée au-dessus d’Albufeira, la côte déployée en dessous.",
      duration: "Environ 1 heure",
      imageAlt: "Deux personnes sous un parachute ascensionnel",
    },
    "banana-boat": {
      title: "Banana boat",
      blurb: "Un court remorquage dans la baie, pour qui aime l’écume.",
      duration: "Environ 30 minutes",
      imageAlt: "Banana boat jaune sur le sable",
    },
    airstream: {
      title: "Bouée ronde",
      blurb: "Une large bouée, remorquée en arc lent derrière le bateau.",
      duration: "Environ 30 minutes",
      imageAlt: "Une bouée tractée derrière un bateau de plaisance",
    },
    "drift-slider": {
      title: "Drift slider",
      blurb: "Une bouée basse, et une longue courbe le long du sillage.",
      duration: "Environ 30 minutes",
      imageAlt: "Une planche tractée fendant l’eau",
    },
    kayak: {
      title: "Kayak",
      blurb: "Une pagaie guidée jusque dans la grotte de Benagil, à votre rythme.",
      duration: "Environ 2 heures",
      imageAlt: "Kayakiste avec une pagaie sur une eau calme",
    },
    sup: {
      title: "Stand up paddle",
      blurb: "Une planche et une pagaie sur une eau calme, les falaises tout près.",
      duration: "Environ 1 h 30",
      imageAlt: "Deux personnes debout sur des planches de paddle",
    },
    "pedal-boats": {
      title: "Pédalos",
      blurb: "Une heure facile, près du rivage.",
      duration: "Environ 1 heure",
      imageAlt: "Pédalo avec quatre personnes",
    },
    "yacht-charter": {
      title: "Location de yacht",
      blurb: "Un yacht avec équipage, depuis la marina, réservé à votre groupe.",
      duration: "Demi-journée",
      imageAlt: "Yacht à voile au large",
    },
    "yacht-exclusive": {
      title: "Yacht exclusif",
      blurb: "Le yacht rien que pour vous : vos invités, votre route, votre heure.",
      duration: "Environ 3 heures",
      imageAlt: "Un grand yacht à moteur au large",
    },
    "watersports-private": {
      title: "Sports nautiques, rien que pour vous",
      blurb: "Un bateau et un skipper, et seulement les sports que vous choisissez.",
      duration: "Environ 2 heures",
      imageAlt: "Plusieurs jet-skis en mer",
    },
    jetski: {
      title: "Jet-ski",
      blurb: "Un parcours guidé au large d’Albufeira, au rythme que vous fixez.",
      duration: "Environ 30 à 60 minutes",
      imageAlt: "Jets-skis alignés au bord de l’eau",
    },
    surfing: {
      title: "Cours de surf",
      blurb: "L’instruction sur le sable, puis dans l’eau. Une vague plus douce sur la côte sud, ou la houle de la côte ouest.",
      duration: "Environ 2 heures",
      imageAlt: "Un surfeur portant une planche le long du rivage",
    },
    "speedboat-benagil": {
      title: "Hors-bord jusqu’à Benagil",
      blurb: "Un hors-bord de plaisance le long des falaises et dans la grotte.",
      duration: "Environ 1 h 30",
      imageAlt: "Le bateau blanc à l’approche de la grotte de Benagil",
    },
    "wine-food": {
      title: "Dégustation de vin",
      blurb: "Une dégustation des vins de l’Algarve, avec la cuisine de la côte à côté.",
      duration: "Environ 3 heures",
      imageAlt: "Verres de vin près du pain et d’une assiette dressée",
    },
    "cliff-walk": {
      title: "Marche côtière",
      blurb: "De Lagos vers Luz : passerelles, criques, et la longue vue.",
      duration: "Environ 3 heures",
      imageAlt: "Des personnes sur un sentier au-dessus de la mer",
    },
    "balloon-flight": {
      title: "Montgolfière",
      blurb: "Un vol au lever du soleil au-dessus du rivage et du barrocal, et un toast à l’atterrissage.",
      duration: "Matin, vol d’environ 1 heure",
      imageAlt: "Montgolfières au-dessus d’un lac",
    },
    "beach-history": {
      title: "Plage et histoire",
      blurb: "Praia da Marinha, les criques, et les villes juste à l’intérieur.",
      duration: "Environ 3 heures",
      imageAlt: "Grotte marine et falaises le long de la côte",
    },
    "jeep-safari": {
      title: "Safari en jeep",
      blurb: "Guidé ou au volant, sur les pistes que la plupart des visiteurs ne voient pas.",
      duration: "Demi-journée",
      imageAlt: "Jeep Wrangler verte",
    },
    "buggy-tours": {
      title: "Tours en buggy",
      blurb: "Une demi-journée, ou la journée avec déjeuner dans les collines. Buggys ouverts à travers pins, pistes et routes des falaises.",
      duration: "Demi-journée ou journée",
      imageAlt: "Un buggy ouvert traversant le sable",
    },
    "quad-half": {
      title: "Tour en quad, demi-journée",
      blurb: "Une demi-journée sur les pistes de l’intérieur, un quad par personne.",
      duration: "Demi-journée",
      imageAlt: "Quads garés sur le sable",
    },
    "private-tours": {
      title: "À votre façon",
      blurb: "Dites-nous comment vous voulez la journée. Nous l’organisons autour de votre groupe.",
      duration: "Votre horaire",
      imageAlt: "Crique calme et plage vide",
    },
    "horse-riding": {
      title: "Équitation",
      blurb: "Quinta da Saudade. Un cheval adapté à celui qui monte.",
      duration: "Environ 1 à 2 heures",
      imageAlt: "Cavaliers de Quinta da Saudade le long des dunes",
      offers: ["Promenade sur la plage et les dunes", "Promenade au coucher du soleil", "Promenade guidée", "Leçon privée"],
    },
    "chef-sunset": {
      title: "Chef à bord au coucher du soleil",
      blurb: "Un service de haute cuisine à bord, tandis que la côte s’assombrit.",
      duration: "Environ 3 heures",
      imageAlt: "Une assiette de haute cuisine aux crevettes",
    },
    "brunch-benagil": {
      title: "Brunch et grottes de Benagil",
      blurb: "Une matinée aux grottes de Benagil, puis un brunch côtier à terre.",
      duration: "Environ 4 heures",
      imageAlt: "Poisson grillé, crevettes et citron",
    },
    "sunset-party": {
      title: "Soirée en bateau au coucher du soleil",
      blurb: "Une soirée sur le pont, un verre à la main, la côte dans la dernière lumière.",
      duration: "Environ 3 heures",
      imageAlt: "Coucher de soleil sur une eau calme",
    },
    catamaran: {
      title: "Tours en catamaran",
      blurb: "Un pont large et stable, de l’ombre au-dessus, et le temps de nager.",
      duration: "Environ 3 heures",
      imageAlt: "Le catamaran Discover Tours le long des falaises",
    },
    "rent-a-car": {
      title: "Location de voiture",
      blurb: "Une voiture d’Auto-Prudente, prise quand la journée est à vous.",
      duration: "Journée",
      imageAlt: "Une cliente dans un cabriolet, chez Auto-Prudente",
    },
    limo: {
      title: "Limousine",
      blurb: "Une Mercedes pour la soirée, l’aéroport, ou une célébration le long de la côte.",
      duration: "Selon l’arrangement",
      imageAlt: "Des hôtes dans l’habitacle d’une limousine de l’Algarve",
    },
    transfers: {
      title: "Transferts",
      blurb: "Un chauffeur et une voiture entre l’aéroport, l’hôtel et la côte.",
      duration: "Selon l’arrangement",
      imageAlt: "Une Mercedes noire devant un hôtel",
    },
    "jet-boat": {
      title: "Hors-bord privé",
      blurb: "Un hors-bord rapide et privé, au départ de Vilamoura, le long des falaises et jusque dans les grottes.",
      duration: "Environ 2 heures",
      imageAlt: "Un hors-bord blanc et rouge, Take Off, à la marina",
    },
    xride: {
      title: "Bateau privé avec X-Ride",
      blurb: "Une sortie privée pour les dauphins et les grottes, avec X-Ride.",
      duration: "Environ 2 heures",
      imageAlt: "Le bateau orange de X-Ride en route",
    },
    "water-ski": {
      title: "Ski nautique",
      blurb: "Un remorquage dans la baie de Vilamoura, avec instruction si vous le souhaitez.",
      duration: "Environ 30 minutes",
      imageAlt: "Un skieur nautique devant des falaises claires",
    },
    zoomarine: {
      title: "Zoomarine",
      blurb: "Une journée au parc marin de Guia : les spectacles, l’eau et les animaux.",
      duration: "Une journée",
      imageAlt: "Zoomarine",
    },
    "slide-splash": {
      title: "Slide & Splash",
      blurb: "Le parc aquatique de Lagoa : toboggans, bassins, et une journée sans horaire serré.",
      duration: "Une journée",
      imageAlt: "Vue aérienne de Slide & Splash, à Lagoa",
    },
    skydive: {
      title: "Saut en parachute",
      blurb: "Un saut en tandem au-dessus de la côte, avec Skydive Algarve.",
      duration: "Environ une demi-journée",
      imageAlt: "Un saut en tandem au-dessus de l’Algarve",
    },
    "tuk-tuk": {
      title: "Tuk-tuk",
      blurb: "Un tuk-tuk électrique dans les vieilles rues, au pas de la marche.",
      duration: "Environ 1 heure",
      imageAlt: "Un tuk-tuk électrique",
    },
    "tourist-train": {
      title: "Petit train touristique",
      blurb: "Le petit train à travers Albufeira, pour un premier regard sur la ville.",
      duration: "Environ 1 heure",
      imageAlt: "Le train bleu et jaune de Turistrem",
    },
  },
};

export const catalogCopy: Record<Exclude<Locale, "en">, CatalogText> = { pt, fr };

export const emptyCatalog: CatalogText = { periods: {}, categories: {}, activities: {} };
