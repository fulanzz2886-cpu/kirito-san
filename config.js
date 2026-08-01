const NAMA_BOT = "ʏᴜᴜᴋɪ ꜱᴏʀɪᴍᴀᴄʜɪ";
const NAMA_OWNER = "ᴅɪᴍᴢᴢ";

const NOMOR_BOT = "6281952716944";
const NOMOR_OWNER = "6281952716944";

const MAP_SMALL_CAPS = {
  a: "ᴀ",
  b: "ʙ",
  c: "ᴄ",
  d: "ᴅ",
  e: "ᴇ",
  f: "ꜰ",
  g: "ɢ",
  h: "ʜ",
  i: "ɪ",
  j: "ᴊ",
  k: "ᴋ",
  l: "ʟ",
  m: "ᴍ",
  n: "ɴ",
  o: "ᴏ",
  p: "ᴘ",
  q: "ǫ",
  r: "ʀ",
  s: "ꜱ",
  t: "ᴛ",
  u: "ᴜ",
  v: "ᴠ",
  w: "ᴡ",
  x: "x",
  y: "ʏ",
  z: "ᴢ",

  A: "ᴀ",
  B: "ʙ",
  C: "ᴄ",
  D: "ᴅ",
  E: "ᴇ",
  F: "ꜰ",
  G: "ɢ",
  H: "ʜ",
  I: "ɪ",
  J: "ᴊ",
  K: "ᴋ",
  L: "ʟ",
  M: "ᴍ",
  N: "ɴ",
  O: "ᴏ",
  P: "ᴘ",
  Q: "ǫ",
  R: "ʀ",
  S: "ꜱ",
  T: "ᴛ",
  U: "ᴜ",
  V: "ᴠ",
  W: "ᴡ",
  X: "x",
  Y: "ʏ",
  Z: "ᴢ",

  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

function sc(teks) {
  return String(teks || "")
    .split("")
    .map((c) => MAP_SMALL_CAPS[c] || c)
    .join("");
}

function normalisasiNomor(nomor) {
  let hasil = String(nomor || "").replace(/\D/g, "");

  if (hasil.startsWith("0")) {
    hasil = `62${hasil.slice(1)}`;
  }

  return hasil;
}

function ambilNomor(dataUser) {
  if (typeof dataUser === "string" || typeof dataUser === "number") {
    return normalisasiNomor(dataUser);
  }

  if (!dataUser || typeof dataUser !== "object") {
    return "";
  }

  const sumberNomor =
    dataUser.number ||
    dataUser.nomor ||
    dataUser.phone ||
    dataUser.wa ||
    dataUser.id ||
    dataUser.jid ||
    dataUser.sender ||
    dataUser.from ||
    dataUser.participant;

  return normalisasiNomor(sumberNomor);
}

function isOwner(dataUser) {
  const nomorUser = ambilNomor(dataUser);
  const daftarOwner = [NOMOR_OWNER].map(normalisasiNomor);

  return Boolean(
    nomorUser && daftarOwner.includes(nomorUser)
  );
}

const deteksiOwner = isOwner;

function deteksiGender(dataUser) {
  const g = String(
    dataUser?.gender ||
    dataUser?.jk ||
    "-"
  ).toLowerCase();

  if (
    g.includes("l") ||
    g.includes("cowok") ||
    g.includes("pria") ||
    g.includes("lak")
  ) {
    return "LAKI";
  }

  if (
    g.includes("p") ||
    g.includes("cewek") ||
    g.includes("wanita") ||
    g.includes("perem")
  ) {
    return "PEREMPUAN";
  }

  return "UNKNOWN";
}

function panggilanGender(dataUser) {
  if (isOwner(dataUser)) {
    return "ꜱᴇɴꜱᴇɪ";
  }

  const jk = deteksiGender(dataUser);

  if (jk === "LAKI") {
    return "ᴏɴɪɪ-ᴄʜᴀɴ";
  }

  if (jk === "PEREMPUAN") {
    return "ᴏɴᴇᴇ-ᴄʜᴀɴ";
  }

  return "ꜱᴇɴᴘᴀɪ";
}

const panggilan = panggilanGender;

module.exports = {
  botName: NAMA_BOT,
  ownerName: NAMA_OWNER,
  botNumber: NOMOR_BOT,
  ownerNumber: NOMOR_OWNER,

  namaBot: NAMA_BOT,
  namaOwner: NAMA_OWNER,
  nomorBot: NOMOR_BOT,
  nomorOwner: NOMOR_OWNER,

  prefixes: ["#", ".", "/", "!"],
  botMode: "private",
  defaultTimezone: "WIB",
  garis: "─────────────────────────────",

  welcomeMessage: `Aloooooowww Sensei~ ٩(◕‿◕)۶ Watashi *${NAMA_BOT}* sudah berhasil aktif dan siap bantu Sensei kapan pun! 🎉`,

  commands: {
    help: "Nampilin semua daftar perintah",
    menu: "Tampilkan Menu Utama bergambar Yuuki Sorimachi ✨",
    halo: "Yuuki-chan bakal nyapa balik Sensei!",
    info: "Nampilin info lengkap tentang bot",
    mode: "Ganti mode bot public / private (HANYA OWNER)",
  },

  defaultUser: {
    money: 5000,
    point: 100,
    limit: 100,
    spin: 3,
    undian: 1,
    level: 1,
  },

  hadiah: {
    daftar: {
      money: 5000,
      point: 100,
      limit: 100,
    },

    harian: {
      money: [5000, 15000],
      limit: [10, 30],
      point: 25,
    },

    absen: {
      xp: [25, 75],
      point: [50, 150],
      money: 1000,
    },
  },

  harga: {
    upgradeprem: 50000,
    limit50: 5000,
    point100: 3000,
    xp100: 4000,
    nikah: 25000,
  },

  API_KEYS: {
    REMOVEBG: "ISI_API_KAMU_DISINI",
    UPSCALE: "ISI_API_KAMU_DISINI",
    REMINI: "ISI_API_KAMU_DISINI",
    CONVERT: "ISI_API_KAMU_DISINI",
    TRANSLATE: "ISI_API_KAMU_DISINI",
    OCR: "ISI_API_KAMU_DISINI",
    TTS: "ISI_API_KAMU_DISINI",
    STT: "ISI_API_KAMU_DISINI",
    BMKG: "ISI_API_KAMU_DISINI",
    CUACA: "ISI_API_KAMU_DISINI",
    SHOLAT: "ISI_API_KAMU_DISINI",
    BERITA: "ISI_API_KAMU_DISINI",
    AI_CHAT: "ISI_API_KAMU_DISINI",
    AI_IMAGE: "ISI_API_KAMU_DISINI",
    ANIME: "ISI_API_KAMU_DISINI",
    KURS: "ISI_API_KAMU_DISINI",
    IP_LOOKUP: "ISI_API_KAMU_DISINI",
    WHOIS: "ISI_API_KAMU_DISINI",
    YT_SEARCH: "ISI_API_KAMU_DISINI",
    SPOTIFY: "ISI_API_KAMU_DISINI",
  },

  sc,
  normalisasiNomor,
  ambilNomor,
  isOwner,
  deteksiOwner,
  deteksiGender,
  panggilan,
  panggilanGender,
  MAP_SMALL_CAPS,
};
