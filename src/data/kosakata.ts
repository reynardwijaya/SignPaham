export type Kesulitan = "mudah" | "sedang" | "sulit";

export interface KataLatihan {
  kata: string;
  kesulitan: Kesulitan;
}

export const kosakataData: KataLatihan[] = [
  // Mudah (3-4 huruf)
  { kata: "ADA", kesulitan: "mudah" },
  { kata: "AIR", kesulitan: "mudah" },
  { kata: "ART", kesulitan: "mudah" },
  { kata: "ASI", kesulitan: "mudah" },
  { kata: "BAK", kesulitan: "mudah" },
  { kata: "BAN", kesulitan: "mudah" },
  { kata: "BAS", kesulitan: "mudah" },
  { kata: "BED", kesulitan: "mudah" },
  { kata: "CAT", kesulitan: "mudah" },
  { kata: "DAN", kesulitan: "mudah" },
  { kata: "FAN", kesulitan: "mudah" },
  { kata: "GAL", kesulitan: "mudah" },
  { kata: "HAI", kesulitan: "mudah" },
  { kata: "JAI", kesulitan: "mudah" },
  { kata: "KAI", kesulitan: "mudah" },

  // Sedang (5-6 huruf)
  { kata: "BUKU", kesulitan: "sedang" },
  { kata: "CINTA", kesulitan: "sedang" },
  { kata: "DAPUR", kesulitan: "sedang" },
  { kata: "ELANG", kesulitan: "sedang" },
  { kata: "GAJAH", kesulitan: "sedang" },
  { kata: "HADIAH", kesulitan: "sedang" },
  { kata: "INDAH", kesulitan: "sedang" },
  { kata: "JALAN", kesulitan: "sedang" },
  { kata: "KABAR", kesulitan: "sedang" },
  { kata: "LAGU", kesulitan: "sedang" },
  { kata: "MAKAM", kesulitan: "sedang" },
  { kata: "NAIK", kesulitan: "sedang" },
  { kata: "ORANG", kesulitan: "sedang" },
  { kata: "PASAR", kesulitan: "sedang" },
  { kata: "RADIO", kesulitan: "sedang" },

  // Sulit (7+ huruf)
  { kata: "SEKOLAH", kesulitan: "sulit" },
  { kata: "RUMAH", kesulitan: "sulit" },
  { kata: "BELAJAR", kesulitan: "sulit" },
  { kata: "BERMAIN", kesulitan: "sulit" },
  { kata: "KELUARGA", kesulitan: "sulit" },
  { kata: "MAINAN", kesulitan: "sulit" },
  { kata: "MAKANAN", kesulitan: "sulit" },
  { kata: "PENGAJAR", kesulitan: "sulit" },
  { kata: "BINATANG", kesulitan: "sulit" },
  { kata: "HARI", kesulitan: "sulit" },
  { kata: "PELAJARAN", kesulitan: "sulit" },
  { kata: "SAHABAT", kesulitan: "sulit" },
  { kata: "TERIMA", kesulitan: "sulit" },
  { kata: "WAKTU", kesulitan: "sulit" },
  { kata: "WARNA", kesulitan: "sulit" },
];
