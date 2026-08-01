const { execFileSync, spawn } = require("child_process");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const os = require("os");

const FOLDER_TMP = os.tmpdir();

// File media kecil tetap valid, terutama foto WebP/JPEG terkompresi.
const MIN_FILE_SIZE = 256;
const MAX_REDIRECTS = 8;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const ARG_UMUM = [
  "--no-check-certificate",
  "--ignore-errors",
  "--no-warnings",
  "--ignore-config",
  "--user-agent",
  UA,
  "--add-header",
  "Referer: https://www.tiktok.com/",
  "--add-header",
  "Origin: https://www.tiktok.com",
  "--extractor-args",
  "tiktok:web_fallback=1;skip_web=0",
  "--extractor-args",
  "instagram:web_fallback=1",
  "--extractor-args",
  "facebook:web_fallback=1",
  "--extractor-args",
  "spotify:download=false",
];

const EKSTENSI_GAMBAR = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".heic",
  ".avif",
]);

const EKSTENSI_VIDEO = new Set([
  ".mp4",
  ".m4v",
  ".mov",
  ".mkv",
  ".webm",
  ".avi",
  ".flv",
  ".3gp",
  ".ts",
]);

const EKSTENSI_AUDIO = new Set([
  ".mp3",
  ".m4a",
  ".aac",
  ".ogg",
  ".opus",
  ".wav",
  ".flac",
]);

function angkaRapi(n) {
  if (
    n === null ||
    n === undefined ||
    n === "" ||
    Number.isNaN(Number(n))
  ) {
    return "-";
  }

  const angka = Number(n);

  if (angka >= 1_000_000_000) {
    return `${(angka / 1_000_000_000)
      .toFixed(1)
      .replace(/\.0$/, "")}ʙ`;
  }

  if (angka >= 1_000_000) {
    return `${(angka / 1_000_000)
      .toFixed(1)
      .replace(/\.0$/, "")}ᴊ`;
  }

  if (angka >= 1_000) {
    return `${(angka / 1_000)
      .toFixed(1)
      .replace(/\.0$/, "")}ᴋ`;
  }

  return String(angka);
}

function durasiRapi(detik) {
  if (
    detik === null ||
    detik === undefined ||
    Number.isNaN(Number(detik))
  ) {
    return "-";
  }

  const totalDetik = Math.max(0, Number(detik));
  const jam = Math.floor(totalDetik / 3600);
  const menit = Math.floor((totalDetik % 3600) / 60);
  const detikSisa = Math.floor(totalDetik % 60);
  const hasil = [];

  if (jam > 0) {
    hasil.push(`${jam} ᴊᴀᴍ`);
  }

  if (menit > 0) {
    hasil.push(`${menit} ᴍᴇɴɪᴛ`);
  }

  if (detikSisa > 0 || hasil.length === 0) {
    hasil.push(`${detikSisa} ᴅᴇᴛɪᴋ`);
  }

  return hasil.join(" ");
}

function tanggalRapi(tgl) {
  if (!tgl) {
    return "-";
  }

  try {
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const teks = String(tgl);
    const cocok = teks.match(/^(\d{4})(\d{2})(\d{2})/);

    if (cocok) {
      return `${Number(cocok[3])} ${
        bulan[Number(cocok[2]) - 1]
      } ${cocok[1]}`;
    }

    const tanggal = new Date(tgl);

    if (!Number.isNaN(tanggal.getTime())) {
      return `${tanggal.getDate()} ${
        bulan[tanggal.getMonth()]
      } ${tanggal.getFullYear()}`;
    }

    return teks;
  } catch {
    return String(tgl);
  }
}

function cekYtDlp() {
  try {
    execFileSync("yt-dlp", ["--version"], {
      stdio: "ignore",
    });

    return true;
  } catch {
    return false;
  }
}

function cekFfmpeg() {
  try {
    execFileSync("ffmpeg", ["-version"], {
      stdio: "ignore",
    });

    return true;
  } catch {
    return false;
  }
}

function validasiUrl(link) {
  try {
    const url = new URL(String(link));

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

function namaFileAman(nama, fallback = "media") {
  const bersih = String(nama || "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

  return bersih || fallback;
}

function ekstensiDariContentType(contentType) {
  const tipe = String(contentType || "")
    .split(";")[0]
    .trim()
    .toLowerCase();

  const map = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
    "audio/mpeg": ".mp3",
    "audio/mp4": ".m4a",
    "audio/aac": ".aac",
    "audio/ogg": ".ogg",
    "audio/wav": ".wav",
  };

  return map[tipe] || "";
}

function ekstensiDariUrl(link) {
  try {
    const nama = new URL(link).pathname.split("/").pop() || "";
    const ekstensi = path.extname(nama).toLowerCase();

    return ekstensi.length <= 6 ? ekstensi : "";
  } catch {
    return "";
  }
}

function isFileMedia(filePath) {
  try {
    return (
      fs.existsSync(filePath) &&
      fs.statSync(filePath).isFile() &&
      fs.statSync(filePath).size >= MIN_FILE_SIZE
    );
  } catch {
    return false;
  }
}

function protocolUntuk(url) {
  return new URL(url).protocol === "http:" ? http : https;
}

function requestUrl(link, options = {}, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > MAX_REDIRECTS) {
      reject(new Error("Terlalu banyak redirect URL"));
      return;
    }

    let url;

    try {
      url = new URL(link);
    } catch {
      reject(new Error("URL tidak valid"));
      return;
    }

    const request = protocolUntuk(url).request(
      url,
      {
        ...options,
        headers: {
          "User-Agent": UA,
          ...(options.headers || {}),
        },
      },
      (response) => {
        const status = response.statusCode || 0;
        const lokasi = response.headers.location;

        if (status >= 300 && status < 400 && lokasi) {
          response.resume();

          const redirectUrl = new URL(
            lokasi,
            url,
          ).toString();

          requestUrl(
            redirectUrl,
            options,
            redirects + 1,
          )
            .then(resolve)
            .catch(reject);

          return;
        }

        resolve({
          response,
          url: url.toString(),
        });
      },
    );

    request.setTimeout(15_000, () => {
      request.destroy(new Error("Request timeout"));
    });

    request.once("error", reject);
    request.end();
  });
}

async function expandUrl(link) {
  if (!validasiUrl(link)) {
    return link;
  }

  try {
    const { response, url } = await requestUrl(link, {
      method: "HEAD",
    });

    response.resume();

    if (
      response.statusCode === 405 ||
      response.statusCode === 501
    ) {
      return link;
    }

    return url;
  } catch {
    return link;
  }
}

function _bersihkanJson(teks) {
  const sumber = String(teks || "").trim();

  if (!sumber) {
    return null;
  }

  try {
    return JSON.parse(sumber);
  } catch {
    // yt-dlp kadang menulis log tambahan sebelum JSON.
  }

  const barisJson = sumber
    .split("\n")
    .filter((baris) => {
      const teksBaris = baris.trim();

      return (
        teksBaris.startsWith("{") ||
        teksBaris.startsWith("[")
      );
    })
    .join("\n");

  try {
    return JSON.parse(barisJson);
  } catch {
    const cocok = sumber.match(/\{[\s\S]*\}/);

    if (!cocok) {
      return null;
    }

    try {
      return JSON.parse(cocok[0]);
    } catch {
      return null;
    }
  }
}

function _jalan(args) {
  return new Promise((resolve) => {
    let out = "";
    let err = "";
    let sudahSelesai = false;

    console.log(
      "⚙️ [YT-DLP]",
      "yt-dlp",
      args.join(" ").slice(0, 260),
    );

    const proses = spawn("yt-dlp", args, {
      windowsHide: true,
    });

    proses.stdout.on("data", (data) => {
      out += data.toString();
    });

    proses.stderr.on("data", (data) => {
      err += data.toString();
    });

    const selesai = (kode, sinyal) => {
      if (sudahSelesai) {
        return;
      }

      sudahSelesai = true;

      const ringkas = err
        .replace(/\s+/g, " ")
        .trim()
        .slice(-500);

      console.log(
        "⚙️ [YT-DLP] exit=%s signal=%s stderr=%s",
        kode ?? 99,
        sinyal || "-",
        ringkas || "-",
      );

      resolve({
        kode: kode ?? 99,
        sinyal,
        out,
        err,
      });
    };

    proses.once("error", () => selesai(99));
    proses.once("close", selesai);
  });
}

function _jalanFfmpeg(args) {
  return new Promise((resolve) => {
    const proses = spawn("ffmpeg", args, {
      windowsHide: true,
    });

    let err = "";

    proses.stderr.on("data", (data) => {
      err += data.toString();
    });

    proses.once("error", () => {
      resolve({
        kode: 99,
        err,
      });
    });

    proses.once("close", (kode) => {
      resolve({
        kode: kode ?? 99,
        err,
      });
    });
  });
}

function _metaMinimal(link, tipe = "media") {
  return {
    id: link,
    webpage_url: link,
    title: "Media",
    description: "",
    uploader: "-",
    thumbnail: null,
    duration: null,
    upload_date: null,
    _directMedia: true,
    _mediaType: tipe,
  };
}

async function ambilMetaOembed(link) {
  return new Promise((resolve, reject) => {
    const url =
      `https://www.tiktok.com/oembed?url=` +
      encodeURIComponent(link);

    requestUrl(url, {
      method: "GET",
    })
      .then(({ response }) => {
        let data = "";

        response.setEncoding("utf8");

        response.on("data", (potongan) => {
          data += potongan;
        });

        response.on("end", () => {
          try {
            const json = JSON.parse(data);

            if (!json || !json.title) {
              reject(new Error("oEmbed gagal"));
              return;
            }

            resolve({
              title: json.title,
              uploader: json.author_name || "-",
              description: json.title,
              thumbnail: json.thumbnail_url || null,
              view_count: 0,
              like_count: 0,
              comment_count: 0,
              repost_count: 0,
              duration: null,
              upload_date: null,
              _fromOembed: true,
            });
          } catch {
            reject(new Error("oEmbed gagal"));
          }
        });
      })
      .catch(reject);
  });
}

async function ambilMeta(link, retry = 0) {
  if (!validasiUrl(link)) {
    throw new Error("ʟɪɴᴋ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ");
  }

  link = await expandUrl(link);

  const ekstensi = ekstensiDariUrl(link);

  if (EKSTENSI_GAMBAR.has(ekstensi)) {
    return _metaMinimal(link, "image");
  }

  if (EKSTENSI_VIDEO.has(ekstensi)) {
    return _metaMinimal(link, "video");
  }

  if (EKSTENSI_AUDIO.has(ekstensi)) {
    return _metaMinimal(link, "audio");
  }

  if (!cekYtDlp()) {
    if (/tiktok\.com/i.test(link)) {
      try {
        return await ambilMetaOembed(link);
      } catch {
        // Error yang lebih jelas diberikan di bawah.
      }
    }

    throw new Error(
      "yt-dlp belum terpasang di server",
    );
  }

  const hasil = await _jalan([
    "-J",
    "--skip-download",
    "--no-playlist",
    ...ARG_UMUM,
    link,
  ]);

  let meta = _bersihkanJson(hasil.out);

  if (Array.isArray(meta)) {
    meta = meta[0];
  }

  if (meta?.entries && !meta.title) {
    const entri = meta.entries.filter(Boolean);

    if (entri.length === 1) {
      meta = entri[0];
    }
  }

  if (!meta && retry < 2) {
    await new Promise((selesai) => {
      setTimeout(selesai, 700 * (retry + 1));
    });

    return ambilMeta(link, retry + 1);
  }

  if (meta) {
    return meta;
  }

  if (/tiktok/i.test(link)) {
    try {
      return await ambilMetaOembed(link);
    } catch {
      // Lanjut ke pesan error yang sudah dipetakan.
    }
  }

  const pesanError = String(hasil.err || "")
    .toLowerCase();

  let alasan = "ɢᴀɢᴀʟ ᴀᴍʙɪʟ ᴍᴇᴛᴀᴅᴀᴛᴀ";

  if (
    pesanError.includes("login") ||
    pesanError.includes("private") ||
    pesanError.includes("unavailable")
  ) {
    alasan = "ᴀᴋᴜɴ ᴘʀɪᴠᴀᴛᴇ / ᴘᴇʀʟᴜ ʟᴏɢɪɴ";
  } else if (
    pesanError.includes("deleted") ||
    pesanError.includes("not found")
  ) {
    alasan = "ᴠɪᴅᴇᴏ ꜱᴜᴅᴀʜ ᴅɪʜᴀᴘᴜꜱ";
  } else if (
    pesanError.includes("network") ||
    pesanError.includes("timeout") ||
    pesanError.includes("403")
  ) {
    alasan = "ᴅɪʙʟᴏᴋɪʀ, ᴄᴏʙᴀ ʟᴀɢɪ ɴᴀɴᴛɪ";
  } else if (pesanError.includes("copyright")) {
    alasan = "ᴛᴇʀʙʟᴏᴋɪʀ ᴄᴏᴘʏʀɪɢʜᴛ";
  }

  throw new Error(
    `${alasan}, ᴄᴇᴋ ʟɪɴᴋ ɴʏᴀ ʟᴀɢɪ ʏᴀ~`,
  );
}

function hapusSemuaFile(daftarFile) {
  for (const file of daftarFile || []) {
    try {
      if (file && fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch {
      // File sementara boleh gagal dihapus tanpa menghentikan pengiriman.
    }
  }
}

function scanHasilDownload(prefix) {
  const semua = fs
    .readdirSync(FOLDER_TMP)
    .filter((nama) => nama.startsWith(prefix));

  const media = [];

  for (const nama of semua) {
    const fullPath = path.join(FOLDER_TMP, nama);

    try {
      const statistik = fs.statSync(fullPath);

      if (
        !statistik.isFile() ||
        statistik.size < MIN_FILE_SIZE
      ) {
        continue;
      }

      const ekstensi = path.extname(nama).toLowerCase();
      let tipe = "other";

      if (EKSTENSI_GAMBAR.has(ekstensi)) {
        tipe = "image";
      } else if (EKSTENSI_VIDEO.has(ekstensi)) {
        tipe = "video";
      } else if (EKSTENSI_AUDIO.has(ekstensi)) {
        tipe = "audio";
      } else {
        continue;
      }

      media.push({
        path: fullPath,
        type: tipe,
        size: statistik.size,
        mtime: statistik.mtimeMs,
      });
    } catch {
      // Abaikan file yang hilang saat proses scan.
    }
  }

  media.sort(
    (a, b) =>
      a.mtime - b.mtime ||
      a.path.localeCompare(b.path),
  );

  const gambar = media
    .filter((item) => item.type === "image")
    .map((item) => item.path);

  const video = media
    .filter((item) => item.type === "video")
    .map((item) => item.path);

  const audio = media
    .filter((item) => item.type === "audio")
    .map((item) => item.path);

  console.log(
    "✅ [SCAN HASIL] gambar=%d video=%d audio=%d",
    gambar.length,
    video.length,
    audio.length,
  );

  return {
    gambar,
    video,
    audio,
    media,
  };
}

async function downloadUrlLangsung(link, prefix) {
  const hasil = await requestUrl(link, {
    method: "GET",
    headers: {
      Accept: "image/*,video/*,audio/*,*/*;q=0.8",
      Referer: link,
    },
  });

  const response = hasil.response;
  const status = response.statusCode || 0;

  if (status < 200 || status >= 300) {
    response.resume();

    throw new Error(
      `HTTP ${status} saat mengunduh media`,
    );
  }

  const contentType = String(
    response.headers["content-type"] || "",
  ).toLowerCase();

  if (!/^(image|video|audio)\//.test(contentType)) {
    response.resume();

    throw new Error(
      "URL tidak mengarah langsung ke file foto, video, atau audio",
    );
  }

  const ekstensi =
    ekstensiDariUrl(hasil.url) ||
    ekstensiDariContentType(contentType) ||
    ".bin";

  const filePath = path.join(
    FOLDER_TMP,
    `${prefix}${ekstensi}`,
  );

  const fileStream = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    let selesai = false;

    const gagal = (error) => {
      if (selesai) {
        return;
      }

      selesai = true;
      fileStream.destroy();

      try {
        fs.unlinkSync(filePath);
      } catch {}

      reject(error);
    };

    response.on("error", gagal);
    fileStream.on("error", gagal);

    fileStream.on("finish", () => {
      if (selesai) {
        return;
      }

      selesai = true;

      if (!isFileMedia(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {}

        reject(
          new Error(
            "File media kosong atau terlalu kecil",
          ),
        );

        return;
      }

      resolve(scanHasilDownload(prefix));
    });

    response.pipe(fileStream);
  });
}

function argFormat(platform, link) {
  const platformMobile =
    /tiktok\.com|instagram\.com|facebook\.com|twitter\.com|x\.com|threads\.net|capcut/i.test(
      link,
    );

  if (
    ["ytmp3", "spotify", "soundcloud"].includes(
      platform,
    )
  ) {
    return [
      "-f",
      platformMobile ? "b/best" : "ba/best",
      "-x",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "0",
    ];
  }

  if (platform === "ytmp4") {
    return [
      "-f",
      platformMobile
        ? "b/best"
        : "bv*[ext=mp4]+ba[ext=m4a]/bv*+ba/b[ext=mp4]/b",
      "--merge-output-format",
      "mp4",
    ];
  }

  return [
    "-f",
    platformMobile
      ? "b/best"
      : "bv*[ext=mp4]+ba[ext=m4a]/bv*+ba/b[ext=mp4]/b",
    "--merge-output-format",
    "mp4",
  ];
}

async function downloadSemua(
  link,
  platform = "",
  retry = 0,
  opsi = {},
) {
  if (!validasiUrl(link)) {
    throw new Error("ʟɪɴᴋ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ");
  }

  link = await expandUrl(link);

  const nama = `dl-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

  const output = path.join(
    FOLDER_TMP,
    `${nama}.%(autonumber)s.%(ext)s`,
  );

  const ekstensi = ekstensiDariUrl(link);

  // URL file langsung diproses sendiri.
  if (
    EKSTENSI_GAMBAR.has(ekstensi) ||
    EKSTENSI_VIDEO.has(ekstensi) ||
    EKSTENSI_AUDIO.has(ekstensi)
  ) {
    const hasilLangsung = await downloadUrlLangsung(
      link,
      nama,
    );

    return {
      ...hasilLangsung,
      prefix: nama,
    };
  }

  if (!cekYtDlp()) {
    throw new Error(
      "yt-dlp belum terpasang. Pasang yt-dlp untuk URL platform seperti TikTok, Instagram, YouTube, Facebook, dan lainnya.",
    );
  }

  const formatArgs = argFormat(platform, link);

  const playlistArg = opsi.allowMultiple
    ? "--yes-playlist"
    : "--no-playlist";

  const hasil = await _jalan([
    "-o",
    output,
    "--no-part",
    "--no-mtime",
    playlistArg,
    ...formatArgs,
    ...ARG_UMUM,
    link,
  ]);

  const scan = scanHasilDownload(nama);
  const adaMedia = scan.media.length > 0;

  const pesanError = String(hasil.err || "")
    .toLowerCase();

  if (
    !adaMedia &&
    retry < 2 &&
    ![
      "ytmp3",
      "ytmp4",
      "spotify",
      "soundcloud",
    ].includes(platform)
  ) {
    console.log(
      "⚠️ Format pertama tidak menghasilkan file, mencoba format lain",
    );

    await new Promise((selesai) => {
      setTimeout(selesai, 500);
    });

    return downloadSemua(
      link,
      platform,
      retry + 1,
      opsi,
    );
  }

  if (!adaMedia) {
    let alasan = "ꜰɪʟᴇ ɢᴀɢᴀʟ ᴅɪᴅᴏᴡɴʟᴏᴀᴅ";

    if (
      pesanError.includes("ffmpeg") ||
      pesanError.includes("merge") ||
      pesanError.includes("mux")
    ) {
      alasan =
        "ɢᴀɢᴀʟ ɢᴀʙᴜɴɢ ᴠɪᴅᴇᴏ + ᴀᴜᴅɪᴏ, " +
        "ᴘᴀꜱᴛɪᴋᴀɴ ꜰꜰᴍᴘᴇɢ ᴛᴇʀᴘᴀꜱᴀɴɢ";
    } else if (
      pesanError.includes("403") ||
      pesanError.includes("forbidden") ||
      pesanError.includes("blocked") ||
      pesanError.includes("unexpected response")
    ) {
      alasan =
        "ꜱɪᴛᴜꜱ ᴇᴅᴀɴɢ ᴍᴇᴍʙʟᴏᴋɪʀ ᴘᴇʀᴍɪɴᴛᴀᴀɴ";
    } else if (
      pesanError.includes("login") ||
      pesanError.includes("cookie") ||
      pesanError.includes("private")
    ) {
      alasan =
        "ʙᴜᴛᴜʜ ʟᴏɢɪɴ / ᴄᴏᴏᴋɪᴇ ᴋᴀʀᴇɴᴀ " +
        "ᴋᴏɴᴛᴇɴ ᴘʀɪᴠᴀᴛᴇ";
    } else if (pesanError.includes("copyright")) {
      alasan = "ᴛᴇʀʙʟᴏᴋɪʀ ᴄᴏᴘʏʀɪɢʜᴛ";
    } else if (
      pesanError.includes("network") ||
      pesanError.includes("timeout")
    ) {
      alasan = "ᴋᴏɴᴇᴋꜱɪ ᴛᴇʀᴘᴜᴛᴜꜱ";
    } else if (
      pesanError.includes("unsupported") ||
      pesanError.includes("extractor")
    ) {
      alasan =
        "ʟɪɴᴋ ʙᴇʟᴜᴍ ᴅɪᴅᴜᴋᴜɴɢ ᴏʟᴇʜ ʏᴛ-ᴅʟᴘ";
    }

    throw new Error(
      `${alasan}, ᴄᴇᴋ ʟɪɴᴋɴʏᴀ ʟᴀɢɪ ʏᴀ~`,
    );
  }

  return {
    ...scan,
    prefix: nama,
  };
}

async function ekstrakAudio(videoPath) {
  if (
    !videoPath ||
    !isFileMedia(videoPath) ||
    !cekFfmpeg()
  ) {
    return null;
  }

  const audioPath =
    `${videoPath.replace(/\.[^/.]+$/, "")}.mp3`;

  const hasil = await _jalanFfmpeg([
    "-y",
    "-i",
    videoPath,
    "-map",
    "0:a:0?",
    "-vn",
    "-c:a",
    "libmp3lame",
    "-q:a",
    "2",
    audioPath,
  ]);

  if (
    hasil.kode !== 0 ||
    !isFileMedia(audioPath)
  ) {
    try {
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    } catch {}

    return null;
  }

  return audioPath;
}

/**
 * Download media dari URL, lalu menyiapkan audio dari setiap
 * video yang memiliki track audio.
 *
 * Foto tidak dipaksa menjadi video sehingga tidak akan menghasilkan
 * file audio palsu.
 */
async function downloadVideoDanAudio(
  link,
  platform = "",
  opsi = {},
) {
  const hasil = await downloadSemua(
    link,
    platform,
    0,
    {
      allowMultiple:
        opsi.allowMultiple ??
        /instagram\.com|facebook\.com|tiktok\.com/i.test(
          String(link),
        ),
    },
  );

  const daftarAudio = [...hasil.audio];
  const video = [...hasil.video];

  for (const videoPath of video) {
    const audioPath = await ekstrakAudio(videoPath);

    if (audioPath) {
      daftarAudio.push(audioPath);
    }
  }

  const audioUnik = [
    ...new Set(
      daftarAudio.filter(isFileMedia),
    ),
  ];

  const media = hasil.media.filter(
    (item) => item.type !== "audio",
  );

  return {
    ...hasil,
    media,
    audio: audioUnik[0] || null,
    audios: audioUnik,
    video: hasil.video[0] || null,
    gambar: hasil.gambar || [],
    prefixVideo: hasil.prefix,
  };
}

/**
 * Mengirim seluruh foto/video terlebih dahulu, kemudian audio.
 *
 * Callback:
 * - sendImage(filePath, index)
 * - sendVideo(filePath, index)
 * - sendAudio(filePath, index)
 */
async function kirimMediaLaluAudio(
  hasil,
  {
    sendImage,
    sendVideo,
    sendAudio,
    hapusSetelahKirim = false,
  } = {},
) {
  if (
    !hasil ||
    typeof sendAudio !== "function"
  ) {
    throw new TypeError(
      "hasil dan callback sendAudio wajib diberikan",
    );
  }

  const media = Array.isArray(hasil.media)
    ? hasil.media
    : [
        ...(hasil.gambar || []).map((filePath) => ({
          path: filePath,
          type: "image",
        })),

        ...(hasil.video
          ? [
              {
                path: hasil.video,
                type: "video",
              },
            ]
          : hasil.video || []),
      ];

  const fileTerkirim = [];

  try {
    for (
      let index = 0;
      index < media.length;
      index += 1
    ) {
      const item = media[index];

      if (!item?.path || !isFileMedia(item.path)) continue;

      if (item.type === "image") {
        if (typeof sendImage !== "function") {
          throw new TypeError(
            "Callback sendImage wajib diberikan untuk foto",
          );
        }

        await sendImage(item.path, index);
      } else if (item.type === "video") {
        if (typeof sendVideo !== "function") {
          throw new TypeError(
            "Callback sendVideo wajib diberikan untuk video",
          );
        }

        await sendVideo(item.path, index);
      }

      fileTerkirim.push(item.path);
    }

    const daftarAudio =
      hasil.audios ||
      (hasil.audio ? [hasil.audio] : []);

    for (
      let index = 0;
      index < daftarAudio.length;
      index += 1
    ) {
      const audioPath = daftarAudio[index];

      if (!isFileMedia(audioPath)) {
        continue;
      }

      await sendAudio(audioPath, index);
      fileTerkirim.push(audioPath);
    }
  } finally {
    if (hapusSetelahKirim) {
      hapusSemuaFile(fileTerkirim);
    }
  }

  return {
    mediaTerkirim: media.length,
    audioTerkirim: (
      hasil.audios ||
      (hasil.audio ? [hasil.audio] : [])
    ).length,
  };
}

function hapusHasilDownload(hasil) {
  if (!hasil) {
    return;
  }

  const daftar = [
    ...(hasil.gambar || []),
    ...(hasil.video ? [hasil.video] : []),
    ...(hasil.audio ? [hasil.audio] : []),
    ...(hasil.audios || []),
    ...(hasil.media || []).map(
      (item) => item.path,
    ),
  ];

  hapusSemuaFile([...new Set(daftar)]);
}

function pesanProses() {
  return `ᴄʜᴏᴛᴛᴏ ᴍᴀᴛᴛᴇ ɴᴇ ꜱᴇɴᴘᴀɪ
ʟᴀɢɪ ᴀᴍʙɪʟ ᴅᴀᴛᴀ + ᴅᴏᴡɴʟᴏᴀᴅ ɴɪʜ,
ꜱᴀʙᴀʀ ꜱᴇʙᴇɴᴛᴀʀ ʏᴀ~`;
}

function formatTikTok(m = {}) {
  return `
╔══════════════════════════════╗
     🎵 ᴅᴏᴡɴʟᴏᴀᴅ ᴛɪᴋᴛᴏᴋ
╚══════════════════════════════╝

👤 ᴀᴋᴜɴ      : *${
    m.uploader ||
    m.channel ||
    m.creator ||
    "-"
  }*
👥 ꜰᴏʟʟᴏᴡᴇʀꜱ : *${angkaRapi(
    m.uploader_subscriber_count,
  )}*
💬 ᴋᴏᴍᴇɴ     : *${angkaRapi(
    m.comment_count,
  )}*
👁️ ᴅɪᴛᴏɴᴛᴏɴ  : *${angkaRapi(
    m.view_count,
  )}*
❤️ ʟɪᴋᴇ      : *${angkaRapi(
    m.like_count,
  )}*
🔁 ꜱʜᴀʀᴇ     : *${angkaRapi(
    m.repost_count,
  )}*
⏱️ ᴅᴜʀᴀꜱɪ    : *${durasiRapi(
    m.duration,
  )}*
📅 ᴜᴘʟᴏᴀᴅ    : *${tanggalRapi(
    m.upload_date ||
    m.release_date,
  )}*

📝 ᴅᴇꜱᴋʀɪᴘꜱɪ:
${String(
  m.description ||
  m.title ||
  "-",
).slice(0, 400)}

✨ ᴜᴘʟᴏᴀᴅᴇʀ ʙʏ ʏᴜᴜᴋɪ-ᴄʜᴀɴ
`.trim();
}

function formatYouTube(
  m = {},
  tipe = "VIDEO",
) {
  return `
╔══════════════════════════════╗
     📺 ᴅᴏᴡɴʟᴏᴀᴅ ʏᴏᴜᴛᴜʙᴇ [${tipe}]
╚══════════════════════════════╝

🎬 ᴊᴜᴅᴜʟ     : *${m.title || "-"}*
👤 ᴀᴋᴜɴ      : *${
    m.uploader ||
    m.channel ||
    "-"
  }*
🔔 ꜱᴜʙꜱᴄʀɪʙᴇʀ: *${angkaRapi(
    m.uploader_subscriber_count,
  )}*
❤️ ʟɪᴋᴇ      : *${angkaRapi(
    m.like_count,
  )}*
💬 ᴋᴏᴍᴇɴ     : *${angkaRapi(
    m.comment_count,
  )}*
👁️ ᴅɪʟɪʜᴀᴛ   : *${angkaRapi(
    m.view_count,
  )}*
⏱️ ᴅᴜʀᴀꜱɪ    : *${durasiRapi(
    m.duration,
  )}*
📅 ᴜᴘʟᴏᴀᴅ    : *${tanggalRapi(
    m.upload_date,
  )}*

📝 ᴅᴇꜱᴋʀɪᴘꜱɪ:
${String(
  m.description ||
  "-",
).slice(0, 300)}

✨ ᴜᴘʟᴏᴀᴅᴇʀ ʙʏ ʏᴜᴜᴋɪ-ᴄʜᴀɴ
`.trim();
}

function formatGeneric(
  m = {},
  namaPlatform = "MEDIA",
) {
  return `
╔══════════════════════════════╗
     📥 ᴅᴏᴡɴʟᴏᴀᴅ ${namaPlatform.toUpperCase()}
╚══════════════════════════════╝

🎬 ᴊᴜᴅᴜʟ     : *${
    m.title ||
    m.description ||
    "-"
  }*
👤 ᴀᴋᴜɴ      : *${
    m.uploader ||
    m.creator ||
    "-"
  }*
⏱️ ᴅᴜʀᴀꜱɪ    : *${durasiRapi(
    m.duration,
  )}*
👁️ ᴅɪᴛᴏɴᴛᴏɴ  : *${angkaRapi(
    m.view_count,
  )}*
📅 ᴜᴘʟᴏᴀᴅ    : *${tanggalRapi(
    m.upload_date ||
    m.release_date,
  )}*

✨ ᴜᴘʟᴏᴀᴅᴇʀ ʙʏ ʏᴜᴜᴋɪ-ᴄʜᴀɴ
`.trim();
}

function buatFormatTeks(platform, meta) {
  const m = meta || {};

  const nama = {
    tiktok: "TikTok",
    youtube: "YouTube",
    ytmp3: "YouTube Audio MP3",
    ytmp4: "YouTube Video MP4",
    instagram: "Instagram",
    facebook: "Facebook",
    spotify: "Spotify",
    twitter: "Twitter / X",
    threads: "Threads",
    capcut: "CapCut",
    snackvideo: "SnackVideo",
    likee: "Likee",
    soundcloud: "SoundCloud",
    pinterest: "Pinterest",
    mediafire: "MediaFire",
    gdrive: "Google Drive",
    sfile: "SFile",
    pixiv: "Pixiv",
    bstation: "Bstation",
  }[platform] || platform || "Media";

  if (platform === "tiktok") {
    return formatTikTok(m);
  }

  if (platform === "youtube") {
    return formatYouTube(m, "VIDEO/MIX");
  }

  if (platform === "ytmp3") {
    return formatYouTube(m, "AUDIO MP3");
  }

  if (platform === "ytmp4") {
    return formatYouTube(m, "VIDEO MP4");
  }

  return formatGeneric(m, nama);
}

module.exports = {
  angkaRapi,
  durasiRapi,
  tanggalRapi,
  cekYtDlp,
  cekFfmpeg,
  expandUrl,
  ambilMeta,
  hapusSemuaFile,
  hapusHasilDownload,
  scanHasilDownload,
  downloadSemua,
  downloadVideoDanAudio,
  ekstrakAudio,
  kirimMediaLaluAudio,
  pesanProses,
  buatFormatTeks,
};

