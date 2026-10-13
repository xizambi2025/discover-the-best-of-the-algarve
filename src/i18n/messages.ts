export type Locale = "en" | "pt" | "fr";

export const LOCALES: { id: Locale; label: string; name: string; html: string; date: string }[] = [
  { id: "en", label: "EN", name: "English", html: "en", date: "en-GB" },
  { id: "pt", label: "PT", name: "Português", html: "pt-PT", date: "pt-PT" },
  { id: "fr", label: "FR", name: "Français", html: "fr-FR", date: "fr-FR" },
];

export type LegalSection = { heading: string; body: string[] };

export type Messages = {
  skip: string;
  brand: string;
  navWater: string;
  navHorse: string;
  navBook: string;
  navAbout: string;
  navContact: string;
  contactWhatsapp: string;
  contactCalls: string;
  aboutKicker: string;
  footer: string;
  contactEmail: string;
  termsLink: string;
  privacyLink: string;
  langLabel: string;
  heroKicker: string;
  heroTitle: string;
  heroItalic: string;
  heroTags: string;
  heroLede: string;
  heroCta: string;
  heroAlt: string;
  promiseTitle: string;
  promise: string[];
  promiseCta: string;
  film: string;
  include: string;
  included: string;
  openDay: string;
  includeDay: string;
  watch: string;
  close: string;
  filmBy: string;
  bookEyebrow: string;
  bookTitle: string;
  bookLede: string;
  savedEyebrow: string;
  reference: string;
  savedBody: string;
  savedReach: string;
  savedWhatsapp: string;
  sendWhatsapp: string;
  copy: string;
  copied: string;
  another: string;
  who: string;
  name: string;
  email: string;
  contact: string;
  date: string;
  peopleLabel: string;
  from: string;
  until: string;
  addRange: string;
  remove: string;
  notes: string;
  notesPlaceholder: string;
  clash: string;
  requestStay: string;
  requestWhatsapp: string;
  boardTitle: string;
  boardLede: string;
  boardEmpty: string;
  programme: string;
  datePending: string;
  person: string;
  people: string;
  historyTitle: string;
  activity: string;
  activities: string;
  accept: string;
  summaryTitle: string;
  summaryName: string;
  summaryEmail: string;
  summaryContact: string;
  summaryNotes: string;
  errName: string;
  errEmail: string;
  errEmailFormat: string;
  errPhone: string;
  errActivity: string;
  errDate: (title: string) => string;
  errTime: (title: string) => string;
  errTerms: string;
  errSend: string;
  payStay: string;
  noticeOverlap: string;
  noticeOrder: string;
  noticeRange: string;
  legalUpdated: string;
  termsKicker: string;
  termsTitle: string;
  privacyKicker: string;
  privacyTitle: string;
  terms: LegalSection[];
  privacy: LegalSection[];
  pageTitle: string;
  pageDescription: string;
};

const en: Messages = {
  skip: "Skip to content",
  brand: "Discover the Best of the Algarve",
  navWater: "On the water",
  navHorse: "Horse riding",
  navBook: "Book experiences",
  navAbout: "About us",
  navContact: "Contact us",
  contactWhatsapp: "WhatsApp",
  contactCalls: "calls",
  aboutKicker: "Private arrangements",
  footer: "Private arrangements along the Algarve.",
  contactEmail: "hi@discoverthebestofthealgarve.com",
  termsLink: "Terms of service",
  privacyLink: "Privacy policy",
  langLabel: "Language",
  heroKicker: "Discover the best of",
  heroTitle: "the Algarve",
  heroItalic: "arranged for you",
  heroTags: "Private · Coastal · Unhurried",
  heroLede:
    "A considered programme of the coast: the water, the table, the horses, and the hour of light you prefer. A short film accompanies each arrangement.",
  heroCta: "Book experiences",
  heroAlt: "Praia da Marinha, limestone cliffs above a sandy cove",
  promiseTitle: "The day, looked after",
  promise: [
    "Hosts who know this coast",
    "Private departures",
    "The pace set by your party",
    "Confirmed before you travel",
  ],
  promiseCta: "Book experiences",
  film: "Film",
  include: "Include",
  included: "Included",
  openDay: "Open your day",
  includeDay: "Include in your day",
  watch: "Watch on YouTube",
  close: "Close",
  filmBy: "Film",
  bookEyebrow: "Arrangements",
  bookTitle: "Arrange the stay",
  bookLede: "Your name, email and contact, and for each experience the day, the guests and the hours.",
  savedEyebrow: "Request received",
  reference: "Reference",
  savedBody:
    "Thank you. We have your request and will arrange it as soon as we can. We will be in touch when everything is ready.",
  savedReach: "If you need anything else, write to",
  savedWhatsapp: "WhatsApp opens with this request ready to send.",
  sendWhatsapp: "Send on WhatsApp",
  copy: "Copy summary",
  copied: "Copied",
  another: "Arrange another stay",
  who: "Who is coming",
  name: "Name",
  email: "Email",
  contact: "Contact",
  date: "Date",
  peopleLabel: "People",
  from: "From",
  until: "Until",
  addRange: "Add this range",
  remove: "Remove",
  notes: "Notes",
  notesPlaceholder: "Anything your Guest Experience Assistant should know",
  clash: "Some times overlap on the same day. That is fine if the party splits. Change them if everyone stays together.",
  requestStay: "Request the experiences",
  requestWhatsapp: "Send these experiences on WhatsApp",
  boardTitle: "Through the stay",
  boardLede: "Each day runs from six in the morning until eleven at night.",
  boardEmpty: "Select an experience and it appears here, or begin from the",
  programme: "programme",
  datePending: "Date still to choose",
  person: "person",
  people: "people",
  historyTitle: "Saved on this device",
  activity: "activity",
  activities: "activities",
  accept: "I accept the terms of service",
  summaryTitle: "Algarve stay request",
  summaryName: "Name",
  summaryEmail: "Email",
  summaryContact: "Contact",
  summaryNotes: "Notes",
  errName: "Add the name the booking should be under.",
  errEmail: "Add an email address.",
  errEmailFormat: "That email address does not look complete. Use the form name@domain.com.",
  errPhone: "Add a contact number, with the country code if you are calling from abroad.",
  errActivity: "Choose at least one experience, with a date and the hours.",
  errDate: (title) => `${title} still needs a date.`,
  errTime: (title) => `${title} still needs a time.`,
  errTerms: "Accept the terms of service before sending this request.",
  errSend: "The request did not go through. Please try again.",
  payStay: "Pay for the stay",
  noticeOverlap: "That period overlaps a time you already chose.",
  noticeOrder: "The end time needs to be after the start.",
  noticeRange: "That range overlaps a time already on this activity.",
  legalUpdated: "22 September 2026",
  termsKicker: "The arrangement",
  termsTitle: "Terms of service",
  privacyKicker: "Your details",
  privacyTitle: "Privacy policy",
  terms: [
    {
      heading: "Your confirmation",
      body: [
        "You are on your way, or you have already arrived. Completing this form confirms the experiences you would like, with the day and the hours.",
        "That is how we arrange them around you.",
      ],
    },
    {
      heading: "What we need",
      body: [
        "Your name, an email address, a contact number, and at least one experience with its date and hours. Please accept these terms before you send the form.",
        "The notes are for anything we should know while looking after the day.",
      ],
    },
    {
      heading: "The programme",
      body: [
        "The experiences follow this coast: the water, the table, the horses, the road. The sea and the weather can change what feels right on the day. When they do, we tell you and agree another hour together.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "If the day should change, send the form again or say so in the notes. We arrange the new hours with you.",
      ],
    },
  ],
  privacy: [
    {
      heading: "What you tell us",
      body: [
        "To arrange the experiences, the form asks for your name, email, a contact number, the experiences you choose, the dates, how many people are coming, the hours, and a note if you wish. You also accept the terms of service.",
      ],
    },
    {
      heading: "Where it is kept",
      body: [
        "These details are kept so the stay can be arranged. They are not kept on your phone or computer.",
        "Only the person arranging your stay can read them.",
      ],
    },
    {
      heading: "How we treat them",
      body: [
        "They are used only to arrange your experiences. They are not sold, and they are not used to advertise to you.",
        "If a payment link is offered, it opens another page. The card details stay on that page. We do not see them.",
        "If you have a question, write it in the notes. It reaches the person looking after your stay.",
      ],
    },
  ],
  pageTitle: "Discover the Best of the Algarve",
  pageDescription:
    "A private programme of the Algarve: the water, the table, the horses, and the hour you prefer.",
};

const pt: Messages = {
  skip: "Saltar para o conteúdo",
  brand: "Discover the Best of the Algarve",
  navWater: "No mar",
  navHorse: "A cavalo",
  navBook: "Reservar experiências",
  navAbout: "Sobre nós",
  navContact: "Contactos",
  contactWhatsapp: "WhatsApp",
  contactCalls: "chamadas",
  aboutKicker: "Experiências privadas",
  footer: "Experiências privadas ao longo do Algarve.",
  contactEmail: "hi@discoverthebestofthealgarve.com",
  termsLink: "Termos de utilização",
  privacyLink: "Privacidade",
  langLabel: "Idioma",
  heroKicker: "O melhor do",
  heroTitle: "Algarve",
  heroItalic: "pensado para si",
  heroTags: "Privado · Costa · Sem pressas",
  heroLede:
    "Um programa cuidado da costa: o mar, a mesa, os cavalos e a hora de luz que preferir. Cada experiência tem um pequeno filme.",
  heroCta: "Reservar experiências",
  heroAlt: "Praia da Marinha, falésias de calcário sobre uma enseada de areia",
  promiseTitle: "Tratamos de tudo por si",
  promise: [
    "Quem conhece bem esta costa",
    "Saídas só para o seu grupo",
    "O ritmo é o vosso",
    "Combinado consigo antes de chegar",
  ],
  promiseCta: "Reservar experiências",
  film: "Filme",
  include: "Incluir",
  included: "Incluída",
  openDay: "Ver o seu dia",
  includeDay: "Incluir no dia",
  watch: "Ver no YouTube",
  close: "Fechar",
  filmBy: "Filme",
  bookEyebrow: "As experiências",
  bookTitle: "Reservar as experiências",
  bookLede: "Nome, e-mail e contacto. Para cada experiência, indique o dia, quantas pessoas vêm e as horas.",
  savedEyebrow: "Pedido recebido",
  reference: "Referência",
  savedBody:
    "Obrigado. Recebemos o seu pedido e tratamos dele o mais depressa possível. Entramos em contacto quando estiver tudo pronto.",
  savedReach: "Se precisar de mais alguma coisa, escreva para",
  savedWhatsapp: "O WhatsApp abre com o resumo do pedido, pronto a enviar.",
  sendWhatsapp: "Enviar no WhatsApp",
  copy: "Copiar resumo",
  copied: "Copiado",
  another: "Reservar outras experiências",
  who: "Quem vem",
  name: "Nome",
  email: "E-mail",
  contact: "Contacto",
  date: "Data",
  peopleLabel: "Pessoas",
  from: "Das",
  until: "Às",
  addRange: "Acrescentar horário",
  remove: "Retirar",
  notes: "Notas",
  notesPlaceholder: "Algo que devamos saber enquanto tratamos do dia",
  clash:
    "Alguns horários coincidem no mesmo dia. Não há problema se o grupo se dividir. Ajuste-os se quiserem ficar todos juntos.",
  requestStay: "Enviar pedido",
  requestWhatsapp: "Enviar pedido no WhatsApp",
  boardTitle: "Durante a estadia",
  boardLede: "Cada dia vai das seis da manhã às onze da noite.",
  boardEmpty: "Escolha uma experiência e aparece aqui, ou comece pelo",
  programme: "programa",
  datePending: "Data por definir",
  person: "pessoa",
  people: "pessoas",
  historyTitle: "Guardado neste dispositivo",
  activity: "experiência",
  activities: "experiências",
  accept: "Aceito os termos de utilização",
  summaryTitle: "Pedido de experiências no Algarve",
  summaryName: "Nome",
  summaryEmail: "E-mail",
  summaryContact: "Contacto",
  summaryNotes: "Notas",
  errName: "Indique o nome a usar na reserva.",
  errEmail: "Indique o e-mail.",
  errEmailFormat: "Este e-mail não parece completo. Use o formato nome@dominio.com.",
  errPhone: "Indique um contacto telefónico, com indicativo se vier do estrangeiro.",
  errActivity: "Escolha pelo menos uma experiência, com data e horário.",
  errDate: (title) => `Falta escolher a data para ${title}.`,
  errTime: (title) => `Falta escolher o horário para ${title}.`,
  errTerms: "Aceite os termos de utilização antes de enviar.",
  errSend: "O pedido não foi enviado. Tente outra vez.",
  payStay: "Pagar",
  noticeOverlap: "Esse horário cruza com outro que já escolheu.",
  noticeOrder: "A hora de fim tem de ser posterior à de início.",
  noticeRange: "Esse horário cruza com outro já escolhido nesta experiência.",
  legalUpdated: "22 de setembro de 2026",
  termsKicker: "A marcação",
  termsTitle: "Termos de utilização",
  privacyKicker: "Os seus dados",
  privacyTitle: "Privacidade",
  terms: [
    {
      heading: "A sua confirmação",
      body: [
        "Vem a caminho ou já está cá. Ao preencher o formulário, confirma as experiências que quer, com o dia e as horas.",
        "É assim que as organizamos à volta de si.",
      ],
    },
    {
      heading: "O que pedimos",
      body: [
        "Nome, e-mail, contacto e pelo menos uma experiência com data e horário. Aceite estes termos antes de enviar.",
        "Nas notas, diga o que devamos ter em conta.",
      ],
    },
    {
      heading: "O programa",
      body: [
        "As experiências seguem esta costa: mar, mesa, cavalos, estrada. O mar e o tempo podem alterar o plano do dia. Quando isso acontece, avisamos e combinamos outra hora consigo.",
      ],
    },
    {
      heading: "Alterações",
      body: [
        "Se algo mudar, envie o formulário outra vez ou diga-o nas notas. Combinamos as novas horas consigo.",
      ],
    },
  ],
  privacy: [
    {
      heading: "O que nos indica",
      body: [
        "Para organizar as experiências, pedimos nome, e-mail, contacto, as experiências escolhidas, datas, número de pessoas, horários e, se quiser, uma nota. Também aceita os termos de utilização.",
      ],
    },
    {
      heading: "Onde ficam os dados",
      body: [
        "Ficam guardados para podermos organizar a estadia. Não ficam no seu telemóvel nem no computador.",
        "Só quem trata da sua estadia tem acesso.",
      ],
    },
    {
      heading: "Como os usamos",
      body: [
        "Servem apenas para organizar as suas experiências. Não os vendemos nem usamos para publicidade.",
        "Se houver link de pagamento, abre noutra página. Os dados do cartão ficam aí. Nós não os vemos.",
        "Se tiver dúvidas, escreva nas notas. Chegam a quem trata da sua estadia.",
      ],
    },
  ],
  pageTitle: "Discover the Best of the Algarve",
  pageDescription:
    "Experiências privadas no Algarve: mar, mesa, cavalos e a hora de luz que preferir.",
};

const fr: Messages = {
  skip: "Aller au contenu",
  brand: "Discover the Best of the Algarve",
  navWater: "Sur l’eau",
  navHorse: "À cheval",
  navBook: "Réserver",
  navAbout: "À propos",
  navContact: "Contact",
  contactWhatsapp: "WhatsApp",
  contactCalls: "appels",
  aboutKicker: "Expériences privées",
  footer: "Expériences privées le long de l’Algarve.",
  contactEmail: "hi@discoverthebestofthealgarve.com",
  termsLink: "Conditions",
  privacyLink: "Confidentialité",
  langLabel: "Langue",
  heroKicker: "Le meilleur de",
  heroTitle: "l’Algarve",
  heroItalic: "organisé pour vous",
  heroTags: "Privé · Côte · Sans hâte",
  heroLede:
    "Un programme soigné de la côte : la mer, la table, les chevaux et l’heure de lumière que vous préférez. Chaque expérience a son court film.",
  heroCta: "Réserver les expériences",
  heroAlt: "Praia da Marinha, falaises calcaires au-dessus d’une crique de sable",
  promiseTitle: "Nous nous occupons de tout",
  promise: [
    "Des hôtes qui connaissent cette côte",
    "Des sorties réservées à votre groupe",
    "Le rythme que vous choisissez",
    "Confirmé avec vous avant votre arrivée",
  ],
  promiseCta: "Réserver les expériences",
  film: "Film",
  include: "Inclure",
  included: "Incluse",
  openDay: "Voir votre journée",
  includeDay: "Ajouter à la journée",
  watch: "Voir sur YouTube",
  close: "Fermer",
  filmBy: "Film",
  bookEyebrow: "Les expériences",
  bookTitle: "Réserver les expériences",
  bookLede: "Nom, e-mail et contact. Pour chaque expérience, indiquez le jour, le nombre de personnes et les horaires.",
  savedEyebrow: "Demande reçue",
  reference: "Référence",
  savedBody:
    "Merci. Nous avons bien reçu votre demande et nous la traitons au plus vite. Nous vous recontactons dès que tout est prêt.",
  savedReach: "Pour toute question, écrivez à",
  savedWhatsapp: "WhatsApp s’ouvre avec le résumé de la demande, prêt à envoyer.",
  sendWhatsapp: "Envoyer sur WhatsApp",
  copy: "Copier le résumé",
  copied: "Copié",
  another: "Réserver d’autres expériences",
  who: "Qui vient",
  name: "Nom",
  email: "E-mail",
  contact: "Contact",
  date: "Date",
  peopleLabel: "Personnes",
  from: "De",
  until: "À",
  addRange: "Ajouter cet horaire",
  remove: "Retirer",
  notes: "Notes",
  notesPlaceholder: "Ce qu’il faut savoir pour organiser votre journée",
  clash:
    "Certains horaires se chevauchent le même jour. Ce n’est pas gênant si le groupe se sépare. Modifiez-les si vous restez ensemble.",
  requestStay: "Envoyer la demande",
  requestWhatsapp: "Envoyer la demande sur WhatsApp",
  boardTitle: "Pendant le séjour",
  boardLede: "Chaque journée va de six heures du matin à onze heures du soir.",
  boardEmpty: "Choisissez une expérience et elle s’affiche ici, ou commencez par le",
  programme: "programme",
  datePending: "Date à définir",
  person: "personne",
  people: "personnes",
  historyTitle: "Enregistré sur cet appareil",
  activity: "expérience",
  activities: "expériences",
  accept: "J’accepte les conditions d’utilisation",
  summaryTitle: "Demande d’expériences en Algarve",
  summaryName: "Nom",
  summaryEmail: "E-mail",
  summaryContact: "Contact",
  summaryNotes: "Notes",
  errName: "Indiquez le nom pour la réservation.",
  errEmail: "Indiquez l’e-mail.",
  errEmailFormat: "Cet e-mail ne semble pas complet. Utilisez le format nom@domaine.com.",
  errPhone: "Indiquez un numéro de contact, avec l’indicatif si vous appelez de l’étranger.",
  errActivity: "Choisissez au moins une expérience, avec une date et des horaires.",
  errDate: (title) => `Il manque la date pour ${title}.`,
  errTime: (title) => `Il manque un horaire pour ${title}.`,
  errTerms: "Acceptez les conditions d’utilisation avant d’envoyer.",
  errSend: "La demande n’a pas été envoyée. Réessayez.",
  payStay: "Payer",
  noticeOverlap: "Ce créneau chevauche un horaire déjà choisi.",
  noticeOrder: "L’heure de fin doit être après l’heure de début.",
  noticeRange: "Ce créneau chevauche un horaire déjà choisi pour cette expérience.",
  legalUpdated: "22 septembre 2026",
  termsKicker: "La réservation",
  termsTitle: "Conditions d’utilisation",
  privacyKicker: "Vos données",
  privacyTitle: "Confidentialité",
  terms: [
    {
      heading: "Votre confirmation",
      body: [
        "Vous êtes en route ou déjà sur place. En remplissant ce formulaire, vous confirmez les expériences souhaitées, avec le jour et les horaires.",
        "C’est ainsi que nous les organisons autour de vous.",
      ],
    },
    {
      heading: "Ce dont nous avons besoin",
      body: [
        "Nom, e-mail, contact et au moins une expérience avec date et horaires. Acceptez ces conditions avant d’envoyer.",
        "Dans les notes, indiquez ce qu’il faut prendre en compte.",
      ],
    },
    {
      heading: "Le programme",
      body: [
        "Les expériences suivent cette côte : mer, table, chevaux, route. La mer et la météo peuvent modifier le plan du jour. Dans ce cas, nous vous prévenons et nous convenons d’un autre horaire.",
      ],
    },
    {
      heading: "Modifications",
      body: [
        "Si quelque chose change, renvoyez le formulaire ou précisez-le dans les notes. Nous fixons les nouveaux horaires avec vous.",
      ],
    },
  ],
  privacy: [
    {
      heading: "Ce que vous nous indiquez",
      body: [
        "Pour organiser les expériences, nous demandons nom, e-mail, contact, expériences choisies, dates, nombre de personnes, horaires et, si vous le souhaitez, une note. Vous acceptez aussi les conditions d’utilisation.",
      ],
    },
    {
      heading: "Où sont conservées les informations",
      body: [
        "Elles sont conservées pour organiser le séjour. Elles ne restent pas sur votre téléphone ni sur votre ordinateur.",
        "Seule la personne qui s’occupe de votre séjour y a accès.",
      ],
    },
    {
      heading: "Comment nous les utilisons",
      body: [
        "Uniquement pour organiser vos expériences. Nous ne les vendons pas et ne les utilisons pas pour de la publicité.",
        "S’il y a un lien de paiement, il ouvre une autre page. Les données de carte y restent. Nous ne les voyons pas.",
        "Pour toute question, écrivez dans les notes. Le message arrive à la personne qui s’occupe de votre séjour.",
      ],
    },
  ],
  pageTitle: "Discover the Best of the Algarve",
  pageDescription:
    "Expériences privées en Algarve : mer, table, chevaux et l’heure de lumière que vous préférez.",
};

export const messages: Record<Locale, Messages> = { en, pt, fr };
