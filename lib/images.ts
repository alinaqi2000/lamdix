export type StockImage = {
  file: string;
  alt: string;
  photographer: string;
  profileUrl: string;
  photoUrl: string;
};

const u = (slug: string) => `https://unsplash.com/photos/${slug}`;
const p = (handle: string) => `https://unsplash.com/@${handle}`;

export const images = {
  facadeNight: {
    file: "/images/C2j14PGSSzg.jpg",
    alt: "Modern building facade against a dark sky at night",
    photographer: "MAK",
    profileUrl: p("mak_jp"),
    photoUrl: u("modern-building-facade-against-a-dark-sky-C2j14PGSSzg"),
  },
  dataCenter: {
    file: "/images/fImCPTZ026U.jpg",
    alt: "Modern data center with rows of white server cabinets",
    photographer: "Tony Marinescu",
    profileUrl: p("tonymarinescu"),
    photoUrl: u("modern-data-center-with-rows-of-white-server-cabinets-fImCPTZ026U"),
  },
  serverAisle: {
    file: "/images/lVZjvw-u9V8.jpg",
    alt: "Server room aisle with metal equipment racks",
    photographer: "İsmail Enes Ayhan",
    profileUrl: p("ismailenesayhan"),
    photoUrl: u("server-room-aisle-with-metal-equipment-racks-lVZjvw-u9V8"),
  },
  circuitMacro: {
    file: "/images/pfR18JNEMv8.jpg",
    alt: "Close-up of a dark blue circuit board",
    photographer: "Vishnu Mohanan",
    profileUrl: p("vishnumaiea"),
    photoUrl: u("close-up-of-dark-blue-circuit-board-pfR18JNEMv8"),
  },
  headsetDim: {
    file: "/images/VOl7Yzf_86s.jpg",
    alt: "A person in profile wearing a headset in a dimly lit room",
    photographer: "Bence Rubányi",
    profileUrl: p("rubibence"),
    photoUrl: u("person-wearing-headset-in-dim-room-VOl7Yzf_86s"),
  },
  headsetLaptop: {
    file: "/images/BeVGrXEktIk.jpg",
    alt: "Black and brown headset resting near a laptop computer",
    photographer: "Petr Macháček",
    profileUrl: p("machec"),
    photoUrl: u("black-and-brown-headset-near-laptop-computer-BeVGrXEktIk"),
  },
  portCranes: {
    file: "/images/cdm1L4MzCWQ.jpg",
    alt: "Large shipping cranes at a container terminal at night",
    photographer: "Sondre Millstein",
    profileUrl: p("millstein28"),
    photoUrl: u("shipping-cranes-at-night-container-terminal-cdm1L4MzCWQ"),
  },
  cityNight: {
    file: "/images/tfEAXoEJCYU.jpg",
    alt: "Vibrant cityscape with illuminated skyscrapers at night",
    photographer: "Matthias Cooper",
    profileUrl: p("matthiascooper"),
    photoUrl: u("vibrant-cityscape-with-illuminated-skyscrapers-tfEAXoEJCYU"),
  },
  storeNight: {
    file: "/images/e7xr6qqz5Qc.jpg",
    alt: "Convenience store illuminated at night",
    photographer: "Zhu Qiankun",
    profileUrl: p("ferrothorn"),
    photoUrl: u("lawson-convenience-store-illuminated-at-night-e7xr6qqz5Qc"),
  },
  houseNight: {
    file: "/images/4vioYQ9Nn9Y.jpg",
    alt: "Modern house exterior glowing with lights at dusk",
    photographer: "Arthur BAUDRY",
    profileUrl: p("bipow"),
    photoUrl: u("modern-house-exterior-glows-with-lights-4vioYQ9Nn9Y"),
  },
  skyscraperNight: {
    file: "/images/BUqVqtRoZv8.jpg",
    alt: "Low-angle view of a high-rise building at nighttime",
    photographer: "Meriç Dağlı",
    profileUrl: p("meric"),
    photoUrl: u("low-angle-photography-of-high-rise-building-at-nighttime-BUqVqtRoZv8"),
  },
  deskNight: {
    file: "/images/P6NY5x3ivYg.jpg",
    alt: "Nighttime desk setup with a laptop, lamp, and city lights",
    photographer: "Avtar Singh",
    profileUrl: p("avtar9w"),
    photoUrl: u("nighttime-desk-setup-with-laptop-lamp-and-city-lights-P6NY5x3ivYg"),
  },
  cableNetwork: {
    file: "/images/M5tzZtFCOfs.jpg",
    alt: "Bundled cable network wiring",
    photographer: "Taylor Vick",
    profileUrl: p("tvick"),
    photoUrl: u("cable-network-M5tzZtFCOfs"),
  },
  hospitalHall: {
    file: "/images/TcFOSqNi8T0.jpg",
    alt: "Empty hospital hallway with rows of chairs",
    photographer: "Szabolcs Antal",
    profileUrl: p("szabolcsantal"),
    photoUrl: u("empty-hospital-hallway-with-rows-of-chairs-TcFOSqNi8T0"),
  },
  coderDesk: {
    file: "/images/FjtWczJWRlc.jpg",
    alt: "A coder's workspace filled with code and keyboards",
    photographer: "Jakub Żerdzicki",
    profileUrl: p("jakubzerdzicki"),
    photoUrl: u("a-coders-workspace-filled-with-code-and-keyboards-FjtWczJWRlc"),
  },
  storeWindow: {
    file: "/images/I5XMu2AUR10.jpg",
    alt: "Store window display with mannequins at night",
    photographer: "Alex Oviedo",
    profileUrl: p("aoviedo2099"),
    photoUrl: u("store-window-display-with-mannequins-at-night-I5XMu2AUR10"),
  },
} satisfies Record<string, StockImage>;

export type ImageKey = keyof typeof images;
