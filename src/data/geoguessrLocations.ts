export type GeoMapId =
  | 'world'
  | 'japan'
  | 'europe'
  | 'americas'
  | 'asia'
  | 'landmarks';

export type GeoMoveMode = 'moving' | 'nomove' | 'nmpz';

export interface GeoCoord {
  lat: number;
  lng: number;
}

export interface GeoMapConfig {
  id: GeoMapId;
  nameJa: string;
  nameEn: string;
  descJa: string;
  descEn: string;
  scaleKm: number;
  defaultCenter: GeoCoord;
  defaultZoom: number;
  accentFrom: string;
  accentTo: string;
  coords: GeoCoord[];
}

export function haversineDistanceKm(a: GeoCoord, b: GeoCoord): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function calculateGeoScore(distanceKm: number, mapScaleKm: number): number {
  const perfectThresholdKm = Math.min(0.025, Math.max(0.01, mapScaleKm * 0.00002));
  if (distanceKm <= perfectThresholdKm) return 5000;
  const score = 5000 * Math.exp((-10 * distanceKm) / mapScaleKm);
  return Math.max(0, Math.min(5000, Math.round(score)));
}

export function getDuelMultiplier(roundNumber: number): number {
  if (roundNumber <= 3) return 1.0;
  if (roundNumber === 4) return 1.5;
  if (roundNumber === 5) return 2.0;
  if (roundNumber === 6) return 2.5;
  return 3.0;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  if (distanceKm < 100) {
    return `${distanceKm.toFixed(1)} km`;
  }
  return `${Math.round(distanceKm).toLocaleString()} km`;
}

const JAPAN_COORDS: GeoCoord[] = [
  { lat: 35.6595, lng: 139.7004 },
  { lat: 35.7100, lng: 139.8107 },
  { lat: 35.0116, lng: 135.7681 },
  { lat: 34.6937, lng: 135.5023 },
  { lat: 43.0621, lng: 141.3544 },
  { lat: 43.7706, lng: 142.3650 },
  { lat: 41.7687, lng: 140.7288 },
  { lat: 38.2682, lng: 140.8694 },
  { lat: 37.9162, lng: 139.0364 },
  { lat: 36.5613, lng: 136.6562 },
  { lat: 36.2692, lng: 136.9066 },
  { lat: 35.1815, lng: 136.9066 },
  { lat: 35.4437, lng: 139.6380 },
  { lat: 35.4896, lng: 138.7952 },
  { lat: 34.3853, lng: 132.4553 },
  { lat: 34.2977, lng: 132.3198 },
  { lat: 33.8392, lng: 132.7656 },
  { lat: 33.5902, lng: 130.4017 },
  { lat: 32.7503, lng: 129.8777 },
  { lat: 32.8031, lng: 130.7079 },
  { lat: 31.5966, lng: 130.5571 },
  { lat: 26.2124, lng: 127.6809 },
  { lat: 26.5917, lng: 127.9773 },
  { lat: 35.3192, lng: 139.5467 },
  { lat: 36.7480, lng: 139.6197 },
  { lat: 39.7020, lng: 141.1545 },
  { lat: 40.8222, lng: 140.7474 },
  { lat: 34.6851, lng: 135.8048 },
  { lat: 34.6901, lng: 135.1955 },
  { lat: 35.4682, lng: 133.0484 },
];

const EUROPE_COORDS: GeoCoord[] = [
  { lat: 51.5007, lng: -0.1246 },
  { lat: 55.9533, lng: -3.1883 },
  { lat: 53.3498, lng: -6.2603 },
  { lat: 48.8566, lng: 2.3522 },
  { lat: 43.2965, lng: 5.3698 },
  { lat: 45.7640, lng: 4.8357 },
  { lat: 52.5200, lng: 13.4050 },
  { lat: 48.1351, lng: 11.5820 },
  { lat: 53.5511, lng: 9.9937 },
  { lat: 41.9028, lng: 12.4964 },
  { lat: 45.4408, lng: 12.3155 },
  { lat: 43.7696, lng: 11.2558 },
  { lat: 40.4168, lng: -3.7038 },
  { lat: 41.3851, lng: 2.1734 },
  { lat: 38.7223, lng: -9.1393 },
  { lat: 52.3676, lng: 4.9041 },
  { lat: 50.8503, lng: 4.3517 },
  { lat: 47.3769, lng: 8.5417 },
  { lat: 48.2082, lng: 16.3738 },
  { lat: 50.0755, lng: 14.4378 },
  { lat: 52.2297, lng: 21.0122 },
  { lat: 47.4979, lng: 19.0402 },
  { lat: 59.9139, lng: 10.7522 },
  { lat: 60.3913, lng: 5.3221 },
  { lat: 59.3293, lng: 18.0686 },
  { lat: 60.1699, lng: 24.9384 },
  { lat: 55.6761, lng: 12.5683 },
  { lat: 64.1466, lng: -21.9426 },
  { lat: 37.9838, lng: 23.7275 },
  { lat: 42.6507, lng: 18.0944 },
];

const AMERICAS_COORDS: GeoCoord[] = [
  { lat: 40.7580, lng: -73.9855 },
  { lat: 37.8199, lng: -122.4783 },
  { lat: 34.0522, lng: -118.2437 },
  { lat: 41.8781, lng: -87.6298 },
  { lat: 25.7617, lng: -80.1918 },
  { lat: 47.6062, lng: -122.3321 },
  { lat: 36.1699, lng: -115.1398 },
  { lat: 29.9511, lng: -90.0715 },
  { lat: 42.3601, lng: -71.0589 },
  { lat: 38.8977, lng: -77.0365 },
  { lat: 43.6532, lng: -79.3832 },
  { lat: 49.2827, lng: -123.1207 },
  { lat: 45.5017, lng: -73.5673 },
  { lat: 51.1784, lng: -115.5708 },
  { lat: 19.4326, lng: -99.1332 },
  { lat: 20.6597, lng: -103.3496 },
  { lat: -22.9068, lng: -43.1729 },
  { lat: -23.5505, lng: -46.6333 },
  { lat: -34.6037, lng: -58.3816 },
  { lat: -33.4489, lng: -70.6693 },
  { lat: -13.5319, lng: -71.9675 },
  { lat: -12.0464, lng: -77.0428 },
  { lat: 4.7110, lng: -74.0721 },
  { lat: 6.2442, lng: -75.5812 },
  { lat: -0.1807, lng: -78.4678 },
  { lat: -34.9011, lng: -56.1645 },
];

const ASIA_OCEANIA_COORDS: GeoCoord[] = [
  { lat: 37.5665, lng: 126.9780 },
  { lat: 35.1796, lng: 129.0756 },
  { lat: 25.0330, lng: 121.5654 },
  { lat: 22.6273, lng: 120.3014 },
  { lat: 13.7563, lng: 100.5018 },
  { lat: 18.7883, lng: 98.9853 },
  { lat: 1.3521, lng: 103.8198 },
  { lat: 3.1390, lng: 101.6869 },
  { lat: -6.2088, lng: 106.8456 },
  { lat: -8.4095, lng: 115.1889 },
  { lat: 14.5995, lng: 120.9842 },
  { lat: 28.6139, lng: 77.2090 },
  { lat: 19.0760, lng: 72.8777 },
  { lat: 22.3193, lng: 114.1694 },
  { lat: -33.8568, lng: 151.2153 },
  { lat: -37.8136, lng: 144.9631 },
  { lat: -27.4698, lng: 153.0251 },
  { lat: -31.9505, lng: 115.8605 },
  { lat: -36.8485, lng: 174.7633 },
  { lat: -41.2865, lng: 174.7762 },
  { lat: -45.0312, lng: 168.6626 },
  { lat: 35.6762, lng: 139.6503 },
  { lat: 35.0116, lng: 135.7681 },
  { lat: 43.0621, lng: 141.3544 },
];

const LANDMARK_COORDS: GeoCoord[] = [
  { lat: 48.8584, lng: 2.2945 },
  { lat: 41.8902, lng: 12.4922 },
  { lat: 40.7580, lng: -73.9855 },
  { lat: 35.6595, lng: 139.7004 },
  { lat: -33.8568, lng: 151.2153 },
  { lat: 51.5007, lng: -0.1246 },
  { lat: 41.4036, lng: 2.1744 },
  { lat: 52.5163, lng: 13.3777 },
  { lat: 37.8199, lng: -122.4783 },
  { lat: 36.4618, lng: 25.3753 },
  { lat: 34.9671, lng: 135.7727 },
  { lat: 45.4342, lng: 12.3388 },
  { lat: 50.0865, lng: 14.4114 },
  { lat: -22.9519, lng: -43.2105 },
  { lat: 25.1972, lng: 55.2744 },
  { lat: 1.2834, lng: 103.8607 },
  { lat: 37.5796, lng: 126.9770 },
  { lat: 19.4326, lng: -99.1332 },
  { lat: 60.1695, lng: 24.9522 },
  { lat: 59.3275, lng: 18.0717 },
  { lat: 38.7078, lng: -9.1366 },
  { lat: 33.9175, lng: 130.9619 },
  { lat: 52.3702, lng: 4.8952 },
  { lat: 31.9539, lng: 35.9106 },
];

const EXTRA_WORLD_COORDS: GeoCoord[] = [
  { lat: -26.2041, lng: 28.0473 },
  { lat: -33.9249, lng: 18.4241 },
  { lat: -1.2921, lng: 36.8219 },
  { lat: 14.7167, lng: -17.4677 },
  { lat: 5.6037, lng: -0.1870 },
  { lat: 36.8065, lng: 10.1815 },
  { lat: 41.0082, lng: 28.9784 },
  { lat: 31.7683, lng: 35.2137 },
  { lat: 25.2048, lng: 55.2708 },
  { lat: 56.9496, lng: 24.1052 },
  { lat: 59.4370, lng: 24.7536 },
  { lat: 54.6872, lng: 25.2797 },
  { lat: 44.4268, lng: 26.1025 },
  { lat: 42.6977, lng: 23.3219 },
  { lat: 44.7866, lng: 20.4489 },
  { lat: 45.8150, lng: 15.9819 },
  { lat: 46.0569, lng: 14.5058 },
];

export const GEOGUESSR_MAPS: Record<GeoMapId, GeoMapConfig> = {
  world: {
    id: 'world',
    nameJa: 'World (世界一周)',
    nameEn: 'World',
    descJa: '世界中の都市・田舎道・海岸線がランダムに出題される定番マップ',
    descEn: 'Explore roads, towns, and landscapes across all continents.',
    scaleKm: 2000,
    defaultCenter: { lat: 20, lng: 10 },
    defaultZoom: 2,
    accentFrom: '#10b981',
    accentTo: '#0284c7',
    coords: [
      ...JAPAN_COORDS.slice(0, 14),
      ...EUROPE_COORDS.slice(0, 20),
      ...AMERICAS_COORDS.slice(0, 18),
      ...ASIA_OCEANIA_COORDS.slice(0, 14),
      ...EXTRA_WORLD_COORDS,
    ],
  },
  japan: {
    id: 'japan',
    nameJa: 'Japan (日本全土)',
    nameEn: 'Japan',
    descJa: '北海道から沖縄まで日本各地の街並みや街道を探索',
    descEn: 'From Hokkaido snow roads to Okinawa islands and Tokyo streets.',
    scaleKm: 350,
    defaultCenter: { lat: 36.2048, lng: 138.2529 },
    defaultZoom: 5,
    accentFrom: '#f43f5e',
    accentTo: '#fb7185',
    coords: JAPAN_COORDS,
  },
  europe: {
    id: 'europe',
    nameJa: 'Europe (ヨーロッパ)',
    nameEn: 'Europe',
    descJa: '標識・言語・建築様式が多彩な欧州全域マップ',
    descEn: 'Diverse road signs, architecture, and coastal routes across Europe.',
    scaleKm: 650,
    defaultCenter: { lat: 50.1109, lng: 10.5 },
    defaultZoom: 4,
    accentFrom: '#3b82f6',
    accentTo: '#6366f1',
    coords: EUROPE_COORDS,
  },
  americas: {
    id: 'americas',
    nameJa: 'Americas (南北アメリカ)',
    nameEn: 'Americas',
    descJa: '北米・中米・南米の大陸横断チャレンジ',
    descEn: 'Highways, cities, and Andes routes from Canada to Argentina.',
    scaleKm: 1300,
    defaultCenter: { lat: 12, lng: -75 },
    defaultZoom: 2,
    accentFrom: '#f59e0b',
    accentTo: '#ea580c',
    coords: AMERICAS_COORDS,
  },
  asia: {
    id: 'asia',
    nameJa: 'Asia & Oceania (アジア・オセアニア)',
    nameEn: 'Asia & Oceania',
    descJa: '東アジア・東南アジア・豪州・NZを巡るマップ',
    descEn: 'Explore East & Southeast Asia alongside Australia and New Zealand.',
    scaleKm: 1100,
    defaultCenter: { lat: 8, lng: 118 },
    defaultZoom: 3,
    accentFrom: '#14b8a6',
    accentTo: '#0ea5e9',
    coords: ASIA_OCEANIA_COORDS,
  },
  landmarks: {
    id: 'landmarks',
    nameJa: 'Famous Landmarks (世界の絶景・名所)',
    nameEn: 'Famous Landmarks',
    descJa: '世界中の有名スポット・観光名所周辺から出題',
    descEn: 'Iconic plazas, monuments, and skylines around the world.',
    scaleKm: 2000,
    defaultCenter: { lat: 24, lng: 12 },
    defaultZoom: 2,
    accentFrom: '#a855f7',
    accentTo: '#ec4899',
    coords: LANDMARK_COORDS,
  },
};

export function pickRandomMapLocations(mapId: GeoMapId, count: number): Array<GeoCoord & { heading: number }> {
  const cfg = GEOGUESSR_MAPS[mapId] || GEOGUESSR_MAPS.world;
  const pool = [...cfg.coords];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const selected: Array<GeoCoord & { heading: number }> = [];
  for (let i = 0; i < count; i++) {
    const base = pool[i % pool.length];
    // Small random jitter (~150m) so StreetViewService snaps to a fresh nearby road each play
    const jitterLat = (Math.random() - 0.5) * 0.0025;
    const jitterLng = (Math.random() - 0.5) * 0.0025;
    selected.push({
      lat: Number((base.lat + jitterLat).toFixed(6)),
      lng: Number((base.lng + jitterLng).toFixed(6)),
      heading: Math.floor(Math.random() * 360),
    });
  }
  return selected;
}
