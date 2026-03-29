export interface Aircraft {
  hex: string;
  flight?: string;
  r?: string;
  t?: string;
  desc?: string;
  alt_baro?: number | "ground";
  alt_geom?: number;
  gs?: number;
  ias?: number;
  tas?: number;
  mach?: number;
  track?: number;
  mag_heading?: number;
  true_heading?: number;
  baro_rate?: number;
  geom_rate?: number;
  lat?: number;
  lon?: number;
  squawk?: string;
  emergency?: string;
  category?: string;
  ownOp?: string;
  year?: string;
  oat?: number;
  tat?: number;
  wd?: number;
  ws?: number;
  nav_altitude_mcp?: number;
  nav_qnh?: number;
  seen?: number;
  rssi?: number;
  messages?: number;
}

export interface ApiResponse {
  ac: Aircraft[];
  total: number;
  now: number;
}

export const LOCATIONS = [
  { label: "인천공항", lat: 37.46, lon: 126.44, radius: 100 },
  { label: "김포공항", lat: 37.5583, lon: 126.7906, radius: 80 },
  { label: "제주공항", lat: 33.5104, lon: 126.4914, radius: 100 },
  { label: "나리타공항", lat: 35.7647, lon: 140.3864, radius: 100 },
  { label: "하네다공항", lat: 35.5494, lon: 139.7798, radius: 80 },
] as const;

export const AIRLINE_MAP: Record<string, string> = {
  // 한국
  KAL: "대한항공", AAR: "아시아나항공", JNA: "진에어", JJA: "제주항공",
  ABL: "에어부산", ASV: "에어서울", TWB: "티웨이항공", EOK: "에어로케이",
  FGW: "플라이강원", HGG: "하이에어",
  // 일본
  JAL: "일본항공 (JAL)", ANA: "전일본공수 (ANA)", APJ: "피치항공",
  JJP: "제트스타 재팬", SKY: "스카이마크", SJO: "스프링재팬",
  SNJ: "솔라시드에어", ADO: "에어도",
  // 중국
  CCA: "중국국제항공", CES: "중국동방항공", CSN: "중국남방항공",
  CHH: "하이난항공", CSZ: "선전항공",
  // 동남아
  SIA: "싱가포르항공", THA: "타이항공", CPA: "캐세이퍼시픽",
  EVA: "에바항공", CAL: "중화항공", VJC: "비엣젯", VNA: "베트남항공",
  MAS: "말레이시아항공", GIA: "가루다 인도네시아", CEB: "세부퍼시픽",
  PAL: "필리핀항공", MXD: "에어마카오",
  // 북미
  AAL: "아메리칸항공", DAL: "델타항공", UAL: "유나이티드항공",
  SWA: "사우스웨스트", FDX: "FedEx", UPS: "UPS",
  ACA: "에어캐나다", HAL: "하와이안항공",
  // 유럽
  BAW: "브리티시항공", DLH: "루프트한자", AFR: "에어프랑스",
  KLM: "KLM", THY: "터키항공", SAS: "스칸디나비아항공",
  FIN: "핀에어", AUA: "오스트리아항공",
  // 중동·오세아니아
  UAE: "에미레이트", ETD: "에티하드", QTR: "카타르항공",
  QFA: "콴타스", ANZ: "에어뉴질랜드",
  // 기타
  MGL: "MIAT 몽골항공", MMA: "미얀마 국영항공",
};

export const CATEGORY_LABELS: Record<string, string> = {
  A1: "Light",
  A2: "Small",
  A3: "Large",
  A4: "High Vortex Large",
  A5: "Heavy",
  A6: "High Performance",
  A7: "Rotorcraft",
  B1: "Glider",
  B2: "Lighter-than-Air",
  B4: "Skydiver",
  B6: "UAV",
  C1: "Emergency Vehicle",
  C3: "Obstacle",
};

export const REG_COUNTRY: [RegExp, string, string][] = [
  [/^HL/, "🇰🇷", "대한민국"],
  [/^JA/, "🇯🇵", "일본"],
  [/^N\d/, "🇺🇸", "미국"],
  [/^B-/, "🇨🇳", "중국/대만"],
  [/^C-/, "🇨🇦", "캐나다"],
  [/^G-/, "🇬🇧", "영국"],
  [/^F-/, "🇫🇷", "프랑스"],
  [/^D-/, "🇩🇪", "독일"],
  [/^VH-/, "🇦🇺", "호주"],
  [/^RP-/, "🇵🇭", "필리핀"],
  [/^9V-/, "🇸🇬", "싱가포르"],
  [/^HS-/, "🇹🇭", "태국"],
  [/^VN-/, "🇻🇳", "베트남"],
  [/^PK-/, "🇮🇩", "인도네시아"],
  [/^EI-/, "🇮🇪", "아일랜드"],
  [/^XY-/, "🇲🇲", "미얀마"],
];

export function getCountry(reg?: string): { flag: string; name: string } | null {
  if (!reg) return null;
  for (const [pattern, flag, name] of REG_COUNTRY) {
    if (pattern.test(reg)) return { flag, name };
  }
  return null;
}

export function getAirline(ac: Aircraft): string | null {
  if (ac.ownOp) return ac.ownOp;
  const callsign = ac.flight?.trim();
  if (!callsign) return null;
  const prefix = callsign.replace(/\d+.*$/, "");
  return AIRLINE_MAP[prefix] || null;
}

export function getFlightLabel(ac: Aircraft): string {
  const callsign = ac.flight?.trim();
  if (callsign) return callsign;
  if (ac.r) return ac.r;
  return ac.hex.toUpperCase();
}

export function formatAltitude(alt: number | "ground" | undefined): string {
  if (alt === undefined) return "-";
  if (alt === "ground") return "지상";
  return `${alt.toLocaleString()}ft`;
}

export function formatSpeed(gs: number | undefined): string {
  if (gs === undefined) return "-";
  return `${Math.round(gs)}kts`;
}

export const POLL_INTERVAL_MS = 20000;
const MIN_FETCH_GAP_MS = 10000;
let lastFetchTime = 0;

export async function fetchAircraft(locationIdx: number): Promise<ApiResponse> {
  const now = Date.now();
  const gap = now - lastFetchTime;
  if (gap < MIN_FETCH_GAP_MS) {
    await new Promise((r) => setTimeout(r, MIN_FETCH_GAP_MS - gap));
  }
  lastFetchTime = Date.now();

  const loc = LOCATIONS[locationIdx];
  const res = await fetch(
    `https://api.airplanes.live/v2/point/${loc.lat}/${loc.lon}/${loc.radius}`,
  );
  if (res.status === 429) {
    lastFetchTime = Date.now() + 5000;
    throw new Error("요청 제한 — 잠시 후 자동 재시도");
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
