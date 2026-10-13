export type TimeRange = { start: string; end: string };

export type Activity = {
  id: string;
  title: string;
  blurb: string;
  image: string;
  imageAlt: string;
  videoId: string;
  videoUrl?: string;
  videoTitle: string;
  startAt?: number;
  duration: string;
  suggested: TimeRange;
  offers?: string[];
  price?: number | null;
};

export type Category = {
  id: string;
  title: string;
  kicker: string;
  tone: string;
  points?: string[];
  activities: Activity[];
};

export const PERIODS: { id: string; label: string; start: string; end: string }[] = [
  { id: "dawn", label: "Dawn", start: "06:30", end: "09:00" },
  { id: "morning", label: "Morning", start: "09:00", end: "12:00" },
  { id: "midday", label: "Midday", start: "12:00", end: "15:00" },
  { id: "afternoon", label: "Afternoon", start: "15:00", end: "18:00" },
  { id: "sunset", label: "Sunset", start: "18:00", end: "20:30" },
  { id: "evening", label: "Evening", start: "20:30", end: "23:00" },
];

export const DAY_START = 6 * 60;
export const DAY_END = 23 * 60;

const act = (
  id: string,
  title: string,
  blurb: string,
  image: string,
  imageAlt: string,
  videoId: string,
  videoTitle: string,
  duration: string,
  suggested: TimeRange,
  startAt?: number,
  videoUrl?: string,
): Activity => ({
  id,
  title,
  blurb,
  image,
  imageAlt,
  videoId,
  videoUrl,
  videoTitle,
  duration,
  suggested,
  startAt,
});

export const categories: Category[] = [
  {
    id: "cars",
    title: "Car tours",
    kicker: "A chauffeur, a classic, or the coast in your own time.",
    tone: "olive",
    points: ["Limousine", "Vintage and classic cars", "A car of your own", "Transfers"],
    activities: [
      act(
        "limo",
        "Limousine",
        "A Mercedes for the evening, the airport, or a celebration along the coast.",
        "/photos/providers/limo.jpg",
        "Guests in the cabin of an Algarve limousine",
        "00UOAkYgW2w",
        "Algarve limousine",
        "By arrangement",
        { start: "16:00", end: "20:00" },
      ),
      act(
        "vintage-cars",
        "Vintage car tours",
        "A Lomax from Blue Classics, and an unhurried afternoon above the sea.",
        "/photos/providers/vintage.jpg",
        "A dark Lomax classic parked above the coast",
        "",
        "Blue Classics",
        "About 3 hours",
        { start: "10:00", end: "13:00" },
        undefined,
        "https://www.facebook.com/share/v/1FZWVXQDT5/?mibextid=wwXIfr",
      ),
      act(
        "classic-roadster",
        "Classic roadster tours",
        "A roof-down hour along the coast, in the late light.",
        "/photos/stock/classic-roadster.jpg",
        "Yellow convertible parked beside the sea",
        "hPvu8IHn4PE",
        "Golden Hour Drive on the Algarve coastal road",
        "About 2 hours",
        { start: "16:00", end: "19:00" },
      ),
      act(
        "rent-a-car",
        "Car rental",
        "A car from Auto-Prudente, collected when the day is yours.",
        "/photos/providers/car.jpg",
        "A guest in a convertible, from Auto-Prudente",
        "LGDUr-OTWDE",
        "Auto-Prudente",
        "Full day",
        { start: "09:00", end: "18:00" },
      ),
      act(
        "transfers",
        "Transfers",
        "A driver and a car between the airport, the hotel, and the coast.",
        "/photos/providers/transfer.jpg",
        "A black Mercedes sedan outside a hotel",
        "MFTqU8uepLE",
        "Travel Line",
        "By arrangement",
        { start: "09:00", end: "18:00" },
      ),
    ],
  },
  {
    id: "water",
    title: "Private boat tours",
    kicker: "The caves, a yacht to yourselves, and the hour you choose.",
    tone: "sea",
    activities: [
      act(
        "benagil-boat",
        "Boat tours & Benagil caves",
        "A private approach to the sea cave, and the oculus overhead.",
        "/photos/providers/benagil.jpg",
        "The AlgarExperience boat inside the Benagil cave",
        "I9imk69fZ48",
        "Benagil caves with AlgarExperience",
        "About 2 hours",
        { start: "09:00", end: "12:00" },
      ),
      act(
        "yacht-charter",
        "Yacht charter",
        "A crewed yacht from Vilamoura, reserved for your party.",
        "/photos/providers/yacht.jpg",
        "The Bliss yacht off a red cliff",
        "kSt_D4TooKY",
        "Bliss Charters, Vilamoura",
        "Half day",
        { start: "15:00", end: "18:00" },
      ),
      act(
        "sunset-party",
        "Sunset boat party",
        "An evening on deck, a drink in hand, the coast in the last light.",
        "/photos/providers/party.jpg",
        "The sunset boat party on deck",
        "YDIgPFVowDI",
        "Sunset boat party with AlgarExperience",
        "About 3 hours",
        { start: "18:00", end: "21:00" },
      ),
      act(
        "speedboat-benagil",
        "Speed boat to Benagil",
        "A resort speedboat along the cliffs and into the cave.",
        "/photos/providers/speedboat-benagil.jpg",
        "The white boat approaching the Benagil cave",
        "Tb9NjFXB2SA",
        "Benagil Caves speed boat trip from Lagos",
        "About 1.5 hours",
        { start: "09:00", end: "12:00" },
      ),
      act(
        "jet-boat",
        "Private speedboat",
        "A fast private boat from Vilamoura, along the cliffs and into the caves.",
        "/photos/providers/jetboat.jpg",
        "A white and red speedboat named Take Off, at the marina",
        "iMKotU4_h74",
        "Private speedboat, Vilamoura",
        "About 2 hours",
        { start: "09:00", end: "12:00" },
      ),
      act(
        "xride",
        "Private boat with X-Ride",
        "A private run for dolphins and the caves, with X-Ride.",
        "/photos/providers/xride.jpg",
        "The orange X-Ride boat underway",
        "_1PqsH9ADsk",
        "X-Ride, dolphins and caves",
        "About 2 hours",
        { start: "09:00", end: "12:00" },
      ),
      act(
        "catamaran",
        "Catamaran tours",
        "A broad, steady deck, shade overhead, and time to swim.",
        "/photos/providers/catamaran.jpg",
        "The Discover Tours catamaran along the cliffs",
        "IVLWRmktwKw",
        "Golden Coast catamaran cruise",
        "About 3 hours",
        { start: "15:00", end: "18:00" },
      ),
      act(
        "brunch-benagil",
        "Brunch & Benagil caves",
        "A morning at the Benagil caves, then a coastal brunch ashore.",
        "/photos/stock/brunch-benagil.jpg",
        "Grilled fish, prawns and lemon",
        "rUjP7oncwYI",
        "Brunch and Benagil caves",
        "About 4 hours",
        { start: "10:00", end: "14:00" },
      ),
      act(
        "chef-sunset",
        "Chef on board at sunset",
        "A fine-dining service on board, as the coast goes dark.",
        "/photos/stock/chef-sunset.jpg",
        "A fine-dining plate of prawns",
        "Nx_m7ZxfuKc",
        "Sunset cruise with AlgarExperience",
        "About 3 hours",
        { start: "18:30", end: "21:30" },
        1,
      ),
    ],
  },
  {
    id: "sport",
    title: "Water sports",
    kicker: "The bay, the board, and the open water.",
    tone: "navy",
    activities: [
      act(
        "dolphin-watching",
        "Dolphin watching",
        "A patient watch for wild dolphins, with a skipper who knows this water.",
        "/photos/providers/dolphin.jpg",
        "Guests watching dolphins from an AlgarExperience boat",
        "ovpZdI5CROs",
        "Dolphin watching with AlgarExperience",
        "About 2.5 hours",
        { start: "09:00", end: "12:00" },
      ),
      act(
        "jetski",
        "Jet ski",
        "A guided run off the beach, at a pace you set.",
        "/photos/providers/jetski.jpg",
        "A rider on a jet ski off a sandy beach",
        "-DDBhoaDUUA",
        "Jet ski with Nautic Fun",
        "About 30–60 minutes",
        { start: "10:00", end: "12:00" },
      ),
      act(
        "kayak",
        "Kayak",
        "A guided paddle along the cliffs, at your own pace.",
        "/photos/providers/kayak.jpg",
        "Two people in a kayak beside a cliff",
        "jtxF8dLmOIU",
        "Kayak tours, Albufeira",
        "About 2 hours",
        { start: "09:00", end: "12:00" },
      ),
      act(
        "sup",
        "Stand up paddle",
        "A board and a paddle on quiet water, with the cliffs close by.",
        "/photos/providers/sup.jpg",
        "Stand-up paddle on the Albufeira coast",
        "w0PKjMhOUbY",
        "SUP tours, Albufeira",
        "About 1.5 hours",
        { start: "09:00", end: "12:00" },
      ),
      act(
        "surfing",
        "Surf lessons",
        "Instruction on the sand, then the water.",
        "/photos/providers/surf.jpg",
        "A surfer on a small wave",
        "KCLWvAcPcPk",
        "Surf lessons, Albufeira",
        "About 2 hours",
        { start: "09:00", end: "12:00" },
      ),
      act(
        "parasailing",
        "Parasailing",
        "A short ascent above Albufeira, with the coast laid out below.",
        "/photos/stock/parasailing.jpg",
        "Two people under a bright parasail",
        "G-7BTXMIBZA",
        "Parasailing in Albufeira, Algarve",
        "About 1 hour",
        { start: "11:00", end: "13:00" },
      ),
      act(
        "water-ski",
        "Water ski",
        "A tow across the bay at Vilamoura, with instruction if you want it.",
        "/photos/providers/ski.jpg",
        "A water skier in front of pale cliffs",
        "Duc0VPflsIk",
        "Water ski, Vilamoura",
        "About 30 minutes",
        { start: "10:00", end: "12:00" },
      ),
      act(
        "watersports-private",
        "Water sports — private hire",
        "A boat and a skipper, and only the sports you ask for.",
        "/photos/providers/watersport.jpg",
        "Wakeboarding from a private boat",
        "VEEp81mR_rI",
        "Private water sports with AlgarExperience",
        "About 2 hours",
        { start: "15:00", end: "18:00" },
      ),
      act(
        "banana-boat",
        "Banana boat",
        "A short tow across the bay, for guests who want the spray.",
        "/photos/stock/banana-boat.jpg",
        "Yellow banana boat on the sand",
        "kV5Ee0uY11M",
        "Banana boat, Algarve",
        "About 30 minutes",
        { start: "12:00", end: "15:00" },
      ),
      act(
        "airstream",
        "Airstream ring",
        "A wide inflatable ring, towed in a slow arc behind the boat.",
        "/photos/providers/airstream.png",
        "Two guests on a yellow and red inflatable ring",
        "",
        "",
        "About 30 minutes",
        { start: "12:00", end: "15:00" },
      ),
      act(
        "drift-slider",
        "Drift slider",
        "A low towable, and a long carve along the wake.",
        "/photos/stock/drift-slider.jpg",
        "A towable board cutting through the water",
        "Dxo4geEw_G4",
        "Gyro towable boat tube",
        "About 30 minutes",
        { start: "12:00", end: "15:00" },
      ),
      act(
        "pedal-boats",
        "Pedal boats",
        "An easy hour close to shore.",
        "/photos/providers/pedal.jpg",
        "A pedal boat near the beach",
        "-C4suaWr9EE",
        "Pedal boats",
        "About 1 hour",
        { start: "12:00", end: "15:00" },
      ),
    ],
  },
  {
    id: "wine",
    title: "Wine & food tours",
    kicker: "The region's wines, and a table set to match.",
    tone: "wine",
    activities: [
      act(
        "wine-food",
        "Wine tasting",
        "A tasting of Algarve wines, with the cooking of the coast beside them.",
        "/photos/providers/wine.jpg",
        "A tasting of red wine",
        "fQQCnwRASXk",
        "Wine and food tour, Albufeira",
        "About 3 hours",
        { start: "15:00", end: "18:00" },
      ),
    ],
  },
  {
    id: "walking",
    title: "Walks and the coast",
    kicker: "The path, the coves, and the towns just inland.",
    tone: "walk",
    activities: [
      act(
        "cliff-walk",
        "Coastal walking",
        "The clifftop path, taken slowly, with a guide who knows the ground.",
        "/photos/providers/walk.jpg",
        "A coastal walk in the Algarve",
        "2bnyTENao1Y",
        "Algarve Horizons",
        "About 3 hours",
        { start: "09:00", end: "12:00" },
      ),
      act(
        "beach-history",
        "Beach and history tours",
        "Vilamoura, the coves, and the towns just inland.",
        "/photos/providers/beach.jpg",
        "The coast on a beach and history tour",
        "owHp4-TtGfk",
        "Explore the Algarve from Vilamoura",
        "About 3 hours",
        { start: "09:00", end: "12:00" },
      ),
    ],
  },
  {
    id: "balloon",
    title: "Air balloon trips",
    kicker: "The coast, just after dawn.",
    tone: "balloon",
    activities: [
      act(
        "balloon-flight",
        "Hot air balloon",
        "A sunrise flight over the shore and the barrocal, and a toast when you land.",
        "/photos/providers/balloon.jpg",
        "A hot-air balloon over the Algarve",
        "A1REBd7B6AI",
        "Algarve Balloons",
        "Morning, flight about 1 hour",
        { start: "06:30", end: "09:00" },
      ),
    ],
  },
  {
    id: "land",
    title: "Land adventures",
    kicker: "The tracks inland, by jeep, buggy, or quad.",
    tone: "land",
    activities: [
      act(
        "jeep-safari",
        "Jeep safari",
        "Guided or self-drive, on the tracks most visitors never see.",
        "/photos/providers/jeep.jpg",
        "Jeeps and quads on an Aventura 21 day",
        "GCW0c3cCUak",
        "Jeep safari with Aventura 21",
        "Half day",
        { start: "09:00", end: "13:00" },
      ),
      act(
        "buggy-tours",
        "Buggy tours",
        "Half a day, or the full day with lunch in the hills. Open buggies through pine, track and the clifftop roads.",
        "/photos/stock/buggy-tours.jpg",
        "An open dune buggy crossing the sand",
        "6bE1T691-Bc",
        "Buggy tour with Algarve Riders",
        "Half day or full day",
        { start: "09:00", end: "13:00" },
        13,
      ),
      act(
        "quad-half",
        "Quad tour, half day",
        "A half day on inland trails, one quad to a rider.",
        "/photos/providers/quad.jpg",
        "An Algarve Riders quad on a dirt track",
        "LYlj2G9w5ag",
        "Quad tour with Algarve Riders",
        "Half day",
        { start: "09:00", end: "13:00" },
      ),
    ],
  },
  {
    id: "horse",
    title: "Horse riding",
    kicker: "The dunes, the shore, and a horse matched to the rider.",
    tone: "horse",
    points: ["Guided rides", "Private lessons", "Every level of rider", "A carriage, if you prefer not to ride"],
    activities: [
      {
        ...act(
          "horse-riding",
          "Horse riding",
          "Quinta da Saudade. A horse matched to the rider.",
          "/photos/providers/horse.png",
          "Riders from Quinta da Saudade along the dunes",
          "4zNKrIvlcsA",
          "Horse riding at Quinta da Saudade",
          "About 1–2 hours",
          { start: "09:00", end: "12:00" },
        ),
        offers: ["Beach and dune ride", "Sunset ride", "Guided ride", "Private lesson"],
      },
    ],
  },
  {
    id: "aqua",
    title: "Aqua parks",
    kicker: "A full day of water, for the whole party.",
    tone: "sea",
    activities: [
      act(
        "zoomarine",
        "Zoomarine",
        "A day at the marine park in Guia: the shows, the water, and the animals.",
        "/photos/providers/zoo.jpg",
        "Zoomarine",
        "34xP-XkQ8nE",
        "Zoomarine",
        "A full day",
        { start: "10:00", end: "17:00" },
      ),
      act(
        "slide-splash",
        "Slide & Splash",
        "The water park at Lagoa: slides, pools, and a day that does not need a timetable.",
        "/photos/providers/slide-park.jpg",
        "Aerial view of Slide & Splash at Lagoa",
        "wGgWgr3hiQQ",
        "Slide and Splash",
        "A full day",
        { start: "10:00", end: "17:00" },
      ),
    ],
  },
  {
    id: "more",
    title: "More experiences",
    kicker: "The air, the town, and a day arranged around you.",
    tone: "ink",
    activities: [
      act(
        "skydive",
        "Skydiving",
        "A tandem jump over the coast, with Skydive Algarve.",
        "/photos/providers/sky.webp",
        "A tandem skydive above the Algarve",
        "0lDzBD1BIjU",
        "Skydive Algarve",
        "About half a day",
        { start: "09:00", end: "13:00" },
      ),
      act(
        "tuk-tuk",
        "Tuk-tuk",
        "An electric tuk-tuk through the old streets, at a walking pace.",
        "/photos/providers/tuk.webp",
        "An electric tuk-tuk",
        "9e1jiPBjI4M",
        "Etricity tuk-tuk",
        "About 1 hour",
        { start: "15:00", end: "18:00" },
      ),
      act(
        "tourist-train",
        "Tourist train",
        "The little train through Albufeira, for a first look at the town.",
        "/photos/providers/train.png",
        "The blue and yellow Turistrem train",
        "4k17qYYL0dg",
        "Turistrem",
        "About 1 hour",
        { start: "10:00", end: "12:00" },
      ),
      act(
        "private-tours",
        "Private arrangements",
        "Tell us how you would like the day. We arrange it around your party.",
        "/photos/stock/private-tours.jpg",
        "Quiet cove and an empty beach",
        "qzPk8mB6HcU",
        "Algarve Portugal must-dos: Lagos, Portimão, Albufeira and Faro",
        "Your timetable",
        { start: "09:00", end: "17:00" },
      ),
    ],
  },
];

const CATEGORY_ORDER = ["water", "sport", "land", "cars", "horse", "wine", "walking", "balloon", "aqua", "more"];
categories.sort((left, right) => CATEGORY_ORDER.indexOf(left.id) - CATEGORY_ORDER.indexOf(right.id));

export const activities: Activity[] = categories.flatMap((category) => category.activities);

export function findActivity(id: string): Activity | undefined {
  return activities.find((activity) => activity.id === id);
}

export function watchUrl(activity: Activity): string {
  if (activity.videoUrl) return activity.videoUrl;
  if (!activity.videoId) return "";
  const start = activity.startAt ? `&t=${activity.startAt}s` : "";
  return `https://www.youtube.com/watch?v=${activity.videoId}${start}`;
}

export function hasFilm(activity: Activity): boolean {
  return Boolean(activity.videoId || activity.videoUrl);
}

export function toMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  return toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
}
