var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_http = __toESM(require("http"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_ws = require("ws");
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);

// src/data/geoguessrLocations.ts
function haversineDistanceKm(a, b) {
  const R = 6371;
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}
function calculateGeoScore(distanceKm, mapScaleKm) {
  const perfectThresholdKm = Math.min(0.025, Math.max(0.01, mapScaleKm * 2e-5));
  if (distanceKm <= perfectThresholdKm) return 5e3;
  const score = 5e3 * Math.exp(-10 * distanceKm / mapScaleKm);
  return Math.max(0, Math.min(5e3, Math.round(score)));
}
function getDuelMultiplier(roundNumber) {
  if (roundNumber <= 3) return 1;
  if (roundNumber === 4) return 1.5;
  if (roundNumber === 5) return 2;
  if (roundNumber === 6) return 2.5;
  return 3;
}
var JAPAN_COORDS = [
  { lat: 35.6595, lng: 139.7004 },
  { lat: 35.71, lng: 139.8107 },
  { lat: 35.0116, lng: 135.7681 },
  { lat: 34.6937, lng: 135.5023 },
  { lat: 43.0621, lng: 141.3544 },
  { lat: 43.7706, lng: 142.365 },
  { lat: 41.7687, lng: 140.7288 },
  { lat: 38.2682, lng: 140.8694 },
  { lat: 37.9162, lng: 139.0364 },
  { lat: 36.5613, lng: 136.6562 },
  { lat: 36.2692, lng: 136.9066 },
  { lat: 35.1815, lng: 136.9066 },
  { lat: 35.4437, lng: 139.638 },
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
  { lat: 36.748, lng: 139.6197 },
  { lat: 39.702, lng: 141.1545 },
  { lat: 40.8222, lng: 140.7474 },
  { lat: 34.6851, lng: 135.8048 },
  { lat: 34.6901, lng: 135.1955 },
  { lat: 35.4682, lng: 133.0484 }
];
var EUROPE_COORDS = [
  { lat: 51.5007, lng: -0.1246 },
  { lat: 55.9533, lng: -3.1883 },
  { lat: 53.3498, lng: -6.2603 },
  { lat: 48.8566, lng: 2.3522 },
  { lat: 43.2965, lng: 5.3698 },
  { lat: 45.764, lng: 4.8357 },
  { lat: 52.52, lng: 13.405 },
  { lat: 48.1351, lng: 11.582 },
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
  { lat: 42.6507, lng: 18.0944 }
];
var AMERICAS_COORDS = [
  { lat: 40.758, lng: -73.9855 },
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
  { lat: 4.711, lng: -74.0721 },
  { lat: 6.2442, lng: -75.5812 },
  { lat: -0.1807, lng: -78.4678 },
  { lat: -34.9011, lng: -56.1645 }
];
var ASIA_OCEANIA_COORDS = [
  { lat: 37.5665, lng: 126.978 },
  { lat: 35.1796, lng: 129.0756 },
  { lat: 25.033, lng: 121.5654 },
  { lat: 22.6273, lng: 120.3014 },
  { lat: 13.7563, lng: 100.5018 },
  { lat: 18.7883, lng: 98.9853 },
  { lat: 1.3521, lng: 103.8198 },
  { lat: 3.139, lng: 101.6869 },
  { lat: -6.2088, lng: 106.8456 },
  { lat: -8.4095, lng: 115.1889 },
  { lat: 14.5995, lng: 120.9842 },
  { lat: 28.6139, lng: 77.209 },
  { lat: 19.076, lng: 72.8777 },
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
  { lat: 43.0621, lng: 141.3544 }
];
var LANDMARK_COORDS = [
  { lat: 48.8584, lng: 2.2945 },
  { lat: 41.8902, lng: 12.4922 },
  { lat: 40.758, lng: -73.9855 },
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
  { lat: 37.5796, lng: 126.977 },
  { lat: 19.4326, lng: -99.1332 },
  { lat: 60.1695, lng: 24.9522 },
  { lat: 59.3275, lng: 18.0717 },
  { lat: 38.7078, lng: -9.1366 },
  { lat: 33.9175, lng: 130.9619 },
  { lat: 52.3702, lng: 4.8952 },
  { lat: 31.9539, lng: 35.9106 }
];
var EXTRA_WORLD_COORDS = [
  { lat: -26.2041, lng: 28.0473 },
  { lat: -33.9249, lng: 18.4241 },
  { lat: -1.2921, lng: 36.8219 },
  { lat: 14.7167, lng: -17.4677 },
  { lat: 5.6037, lng: -0.187 },
  { lat: 36.8065, lng: 10.1815 },
  { lat: 41.0082, lng: 28.9784 },
  { lat: 31.7683, lng: 35.2137 },
  { lat: 25.2048, lng: 55.2708 },
  { lat: 56.9496, lng: 24.1052 },
  { lat: 59.437, lng: 24.7536 },
  { lat: 54.6872, lng: 25.2797 },
  { lat: 44.4268, lng: 26.1025 },
  { lat: 42.6977, lng: 23.3219 },
  { lat: 44.7866, lng: 20.4489 },
  { lat: 45.815, lng: 15.9819 },
  { lat: 46.0569, lng: 14.5058 }
];
var GEOGUESSR_MAPS = {
  world: {
    id: "world",
    nameJa: "World (\u4E16\u754C\u4E00\u5468)",
    nameEn: "World",
    descJa: "\u4E16\u754C\u4E2D\u306E\u90FD\u5E02\u30FB\u7530\u820E\u9053\u30FB\u6D77\u5CB8\u7DDA\u304C\u30E9\u30F3\u30C0\u30E0\u306B\u51FA\u984C\u3055\u308C\u308B\u5B9A\u756A\u30DE\u30C3\u30D7",
    descEn: "Explore roads, towns, and landscapes across all continents.",
    scaleKm: 2e3,
    defaultCenter: { lat: 20, lng: 10 },
    defaultZoom: 2,
    accentFrom: "#10b981",
    accentTo: "#0284c7",
    coords: [
      ...JAPAN_COORDS.slice(0, 14),
      ...EUROPE_COORDS.slice(0, 20),
      ...AMERICAS_COORDS.slice(0, 18),
      ...ASIA_OCEANIA_COORDS.slice(0, 14),
      ...EXTRA_WORLD_COORDS
    ]
  },
  japan: {
    id: "japan",
    nameJa: "Japan (\u65E5\u672C\u5168\u571F)",
    nameEn: "Japan",
    descJa: "\u5317\u6D77\u9053\u304B\u3089\u6C96\u7E04\u307E\u3067\u65E5\u672C\u5404\u5730\u306E\u8857\u4E26\u307F\u3084\u8857\u9053\u3092\u63A2\u7D22",
    descEn: "From Hokkaido snow roads to Okinawa islands and Tokyo streets.",
    scaleKm: 350,
    defaultCenter: { lat: 36.2048, lng: 138.2529 },
    defaultZoom: 5,
    accentFrom: "#f43f5e",
    accentTo: "#fb7185",
    coords: JAPAN_COORDS
  },
  europe: {
    id: "europe",
    nameJa: "Europe (\u30E8\u30FC\u30ED\u30C3\u30D1)",
    nameEn: "Europe",
    descJa: "\u6A19\u8B58\u30FB\u8A00\u8A9E\u30FB\u5EFA\u7BC9\u69D8\u5F0F\u304C\u591A\u5F69\u306A\u6B27\u5DDE\u5168\u57DF\u30DE\u30C3\u30D7",
    descEn: "Diverse road signs, architecture, and coastal routes across Europe.",
    scaleKm: 650,
    defaultCenter: { lat: 50.1109, lng: 10.5 },
    defaultZoom: 4,
    accentFrom: "#3b82f6",
    accentTo: "#6366f1",
    coords: EUROPE_COORDS
  },
  americas: {
    id: "americas",
    nameJa: "Americas (\u5357\u5317\u30A2\u30E1\u30EA\u30AB)",
    nameEn: "Americas",
    descJa: "\u5317\u7C73\u30FB\u4E2D\u7C73\u30FB\u5357\u7C73\u306E\u5927\u9678\u6A2A\u65AD\u30C1\u30E3\u30EC\u30F3\u30B8",
    descEn: "Highways, cities, and Andes routes from Canada to Argentina.",
    scaleKm: 1300,
    defaultCenter: { lat: 12, lng: -75 },
    defaultZoom: 2,
    accentFrom: "#f59e0b",
    accentTo: "#ea580c",
    coords: AMERICAS_COORDS
  },
  asia: {
    id: "asia",
    nameJa: "Asia & Oceania (\u30A2\u30B8\u30A2\u30FB\u30AA\u30BB\u30A2\u30CB\u30A2)",
    nameEn: "Asia & Oceania",
    descJa: "\u6771\u30A2\u30B8\u30A2\u30FB\u6771\u5357\u30A2\u30B8\u30A2\u30FB\u8C6A\u5DDE\u30FBNZ\u3092\u5DE1\u308B\u30DE\u30C3\u30D7",
    descEn: "Explore East & Southeast Asia alongside Australia and New Zealand.",
    scaleKm: 1100,
    defaultCenter: { lat: 8, lng: 118 },
    defaultZoom: 3,
    accentFrom: "#14b8a6",
    accentTo: "#0ea5e9",
    coords: ASIA_OCEANIA_COORDS
  },
  landmarks: {
    id: "landmarks",
    nameJa: "Famous Landmarks (\u4E16\u754C\u306E\u7D76\u666F\u30FB\u540D\u6240)",
    nameEn: "Famous Landmarks",
    descJa: "\u4E16\u754C\u4E2D\u306E\u6709\u540D\u30B9\u30DD\u30C3\u30C8\u30FB\u89B3\u5149\u540D\u6240\u5468\u8FBA\u304B\u3089\u51FA\u984C",
    descEn: "Iconic plazas, monuments, and skylines around the world.",
    scaleKm: 2e3,
    defaultCenter: { lat: 24, lng: 12 },
    defaultZoom: 2,
    accentFrom: "#a855f7",
    accentTo: "#ec4899",
    coords: LANDMARK_COORDS
  }
};
function pickRandomMapLocations(mapId, count) {
  const cfg = GEOGUESSR_MAPS[mapId] || GEOGUESSR_MAPS.world;
  const pool = [...cfg.coords];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const selected = [];
  for (let i = 0; i < count; i++) {
    const base = pool[i % pool.length];
    const jitterLat = (Math.random() - 0.5) * 25e-4;
    const jitterLng = (Math.random() - 0.5) * 25e-4;
    selected.push({
      lat: Number((base.lat + jitterLat).toFixed(6)),
      lng: Number((base.lng + jitterLng).toFixed(6)),
      heading: Math.floor(Math.random() * 360)
    });
  }
  return selected;
}

// server.ts
import_dotenv.default.config();
var geoRooms = /* @__PURE__ */ new Map();
var geoQueue = [];
function generateGeoRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return geoRooms.has(code) ? generateGeoRoomCode() : code;
}
function serializeGeoRoom(room, viewerId) {
  const isRevealPhase = room.status === "round_result" || room.status === "match_over";
  const lastRound = room.history.length > 0 ? room.history[room.history.length - 1] : null;
  return {
    roomCode: room.roomCode,
    hostId: room.hostId,
    youId: viewerId,
    format: room.format,
    mapId: room.mapId,
    moveMode: room.moveMode,
    roundTimeSec: room.roundTimeSec,
    status: room.status,
    currentRound: room.currentRound,
    maxRounds: room.maxRounds,
    multiplier: room.format === "duels" ? getDuelMultiplier(room.currentRound) : 1,
    target: room.status === "lobby" ? null : isRevealPhase ? room.target : {
      lat: room.target.lat,
      lng: room.target.lng,
      heading: room.target.heading,
      panoId: room.target.panoId
    },
    roundStartedAt: room.roundStartedAt,
    roundDeadlineAt: room.roundDeadlineAt,
    countdownEndAt: room.countdownEndAt,
    winnerId: room.winnerId,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      hp: p.hp,
      totalScore: p.totalScore,
      hasGuessed: p.guess !== null,
      guess: isRevealPhase || p.id === viewerId ? p.guess : null,
      readyForNext: p.readyForNext,
      wantsRematch: p.wantsRematch,
      connected: p.connected
    })),
    lastRound,
    history: isRevealPhase ? room.history : []
  };
}
function broadcastGeoRoom(room) {
  room.players.forEach((p) => {
    if (p.ws.readyState === import_ws.WebSocket.OPEN) {
      p.ws.send(
        JSON.stringify({
          type: "geo_room_state",
          room: serializeGeoRoom(room, p.id)
        })
      );
    }
  });
}
function startGeoRound(room, roundNumber) {
  const picked = pickRandomMapLocations(room.mapId, 1)[0];
  const now = Date.now();
  room.status = "playing";
  room.currentRound = roundNumber;
  room.target = {
    lat: picked.lat,
    lng: picked.lng,
    heading: picked.heading
  };
  room.roundStartedAt = now;
  room.roundDeadlineAt = room.roundTimeSec > 0 ? now + room.roundTimeSec * 1e3 : null;
  room.countdownEndAt = null;
  room.players.forEach((p) => {
    p.guess = null;
    p.softPin = null;
    p.guessedAt = null;
    p.readyForNext = false;
    p.wantsRematch = false;
  });
  broadcastGeoRoom(room);
}
function resolveGeoRound(room) {
  if (room.status !== "playing") return;
  const mapCfg = GEOGUESSR_MAPS[room.mapId] || GEOGUESSR_MAPS.world;
  const multiplier = room.format === "duels" ? getDuelMultiplier(room.currentRound) : 1;
  room.players.forEach((p) => {
    if (!p.guess && p.softPin) {
      p.guess = p.softPin;
    }
  });
  const roundScores = room.players.map((p) => {
    if (!p.guess) {
      return { id: p.id, guess: null, distanceKm: null, score: 0 };
    }
    const distanceKm = haversineDistanceKm(p.guess, room.target);
    const score = calculateGeoScore(distanceKm, mapCfg.scaleKm);
    return { id: p.id, guess: p.guess, distanceKm, score };
  });
  const p0 = room.players[0];
  const p1 = room.players[1];
  const s0 = roundScores[0]?.score ?? 0;
  const s1 = roundScores[1]?.score ?? 0;
  if (p0) p0.totalScore += s0;
  if (p1) p1.totalScore += s1;
  let dmgTo0 = 0;
  let dmgTo1 = 0;
  if (room.format === "duels" && p0 && p1) {
    if (s0 > s1) {
      dmgTo1 = Math.round((s0 - s1) * multiplier);
      p1.hp = Math.max(0, p1.hp - dmgTo1);
    } else if (s1 > s0) {
      dmgTo0 = Math.round((s1 - s0) * multiplier);
      p0.hp = Math.max(0, p0.hp - dmgTo0);
    }
  }
  const results = {};
  if (p0) {
    results[p0.id] = {
      guess: roundScores[0].guess,
      distanceKm: roundScores[0].distanceKm,
      score: s0,
      damageDealt: dmgTo1,
      damageTaken: dmgTo0
    };
  }
  if (p1) {
    results[p1.id] = {
      guess: roundScores[1].guess,
      distanceKm: roundScores[1].distanceKm,
      score: s1,
      damageDealt: dmgTo0,
      damageTaken: dmgTo1
    };
  }
  room.history.push({
    roundNumber: room.currentRound,
    actual: { ...room.target },
    multiplier,
    results
  });
  if (room.format === "duels" && p0 && p1 && (p0.hp <= 0 || p1.hp <= 0)) {
    room.status = "match_over";
    room.winnerId = p0.hp > p1.hp ? p0.id : p1.id;
  } else if (room.format === "classic5" && room.currentRound >= room.maxRounds) {
    room.status = "match_over";
    if (p0 && p1) {
      if (p0.totalScore > p1.totalScore) room.winnerId = p0.id;
      else if (p1.totalScore > p0.totalScore) room.winnerId = p1.id;
      else room.winnerId = null;
    }
  } else {
    room.status = "round_result";
  }
  room.countdownEndAt = null;
  room.roundDeadlineAt = null;
  broadcastGeoRoom(room);
}
function removePlayerFromGeoQueue(playerId) {
  const idx = geoQueue.findIndex((q) => q.id === playerId);
  if (idx !== -1) {
    geoQueue.splice(idx, 1);
  }
}
function leavePlayerGeoRoom(playerId) {
  geoRooms.forEach((room, code) => {
    const idx = room.players.findIndex((p) => p.id === playerId);
    if (idx !== -1) {
      room.players.splice(idx, 1);
      if (room.players.length === 0) {
        geoRooms.delete(code);
      } else {
        room.hostId = room.players[0].id;
        room.players.forEach((remaining) => {
          if (remaining.ws.readyState === import_ws.WebSocket.OPEN) {
            remaining.ws.send(
              JSON.stringify({
                type: "geo_opponent_left",
                roomCode: code
              })
            );
          }
        });
        if (room.status === "playing" || room.status === "round_result") {
          room.status = "match_over";
          room.winnerId = room.players[0].id;
        }
        broadcastGeoRoom(room);
      }
    }
  });
}
setInterval(() => {
  const now = Date.now();
  geoRooms.forEach((room) => {
    if (room.status === "playing") {
      const effectiveDeadline = room.countdownEndAt && room.roundDeadlineAt ? Math.min(room.countdownEndAt, room.roundDeadlineAt) : room.countdownEndAt || room.roundDeadlineAt;
      if (effectiveDeadline && now >= effectiveDeadline) {
        resolveGeoRound(room);
      }
    }
  });
}, 500);
var app = (0, import_express.default)();
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-passcode");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
var DB_FILE = import_path.default.join(process.cwd(), "wetalks_db.json");
var IMAGE_RETENTION_DAYS = 10;
var IMAGE_RETENTION_MS = IMAGE_RETENTION_DAYS * 24 * 60 * 60 * 1e3;
var ADMIN_PASSCODES = /* @__PURE__ */ new Set(["mozunbu1203"]);
function pruneExpiredWeTalksImages(db) {
  const now = Date.now();
  let pruned = 0;
  if (!Array.isArray(db.messages)) return 0;
  db.messages.forEach((m) => {
    if (m && m.image_base64) {
      const createdMs = Date.parse(m.created_at || "");
      if (!Number.isNaN(createdMs) && now - createdMs >= IMAGE_RETENTION_MS) {
        delete m.image_base64;
        m.image_expired = true;
        pruned++;
      }
    }
  });
  if (pruned > 0) {
    writeWeTalksDB(db);
  }
  return pruned;
}
function isAdminAuthorized(req) {
  const headerCode = req.headers["x-admin-passcode"];
  const queryCode = req.query.passcode;
  const bodyCode = req.body && req.body.passcode;
  const code = String(headerCode || queryCode || bodyCode || "").trim();
  return ADMIN_PASSCODES.has(code);
}
function readWeTalksDB() {
  const defaultRooms = [];
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      const data = import_fs.default.readFileSync(DB_FILE, "utf-8");
      const db = JSON.parse(data);
      if (!db.deleted_rooms) db.deleted_rooms = [];
      if (!Array.isArray(db.users)) db.users = [];
      if (!Array.isArray(db.messages)) db.messages = [];
      if (!db.rooms) {
        db.rooms = defaultRooms.filter((r) => !db.deleted_rooms.includes(r.id));
        writeWeTalksDB(db);
      } else {
        db.rooms = db.rooms.filter((r) => !db.deleted_rooms.includes(r.id));
      }
      pruneExpiredWeTalksImages(db);
      return db;
    }
  } catch (e) {
    console.error("Error reading wetalks db:", e);
  }
  const initialDB = { users: [], rooms: defaultRooms, messages: [], deleted_rooms: [] };
  writeWeTalksDB(initialDB);
  return initialDB;
}
function writeWeTalksDB(db) {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing wetalks db:", e);
  }
}
function hashPassword(password) {
  const salt = import_crypto.default.randomBytes(16).toString("hex");
  const derived = import_crypto.default.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}
function verifyPassword(password, user) {
  if (user.password_hash) {
    const [salt, storedHash] = user.password_hash.split(":");
    if (!salt || !storedHash) return false;
    const derived = import_crypto.default.scryptSync(password, salt, 64).toString("hex");
    try {
      return import_crypto.default.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(storedHash, "hex"));
    } catch {
      return false;
    }
  }
  if (user.password_numeric) {
    return user.password_numeric === password;
  }
  return false;
}
function getRequestToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  if (req.body && req.body.token) {
    return String(req.body.token).trim();
  }
  return "";
}
function authenticateUser(req, db) {
  const token = getRequestToken(req);
  if (!token) return null;
  return db.users.find((u) => u.token && u.token === token) || null;
}
function isUserMemberOfRoom(room, username) {
  if (!room || !username || username === "\u30B2\u30B9\u30C8") return false;
  if (Array.isArray(room.members)) {
    return room.members.includes(username);
  }
  if (room.type === "direct" && room.name) {
    const parts = room.name.replace(/@/g, "").split(" & ");
    return parts.length === 2 && (parts[0] === username || parts[1] === username);
  }
  return false;
}
function markRoomMessagesAsRead(db, roomId, readerUsername) {
  if (!roomId || !readerUsername || readerUsername === "\u30B2\u30B9\u30C8") return 0;
  let updatedCount = 0;
  db.messages.forEach((m) => {
    if (m && m.room_id === roomId && m.sender !== readerUsername) {
      const current = Array.isArray(m.read_by) ? m.read_by.filter((u) => u && u !== m.sender) : [];
      if (!current.includes(readerUsername)) {
        current.push(readerUsername);
        m.read_by = current;
        updatedCount++;
      } else if (!Array.isArray(m.read_by)) {
        m.read_by = current;
      }
    }
  });
  if (updatedCount > 0) {
    writeWeTalksDB(db);
  }
  return updatedCount;
}
app.get("/api/wetalks/health", (req, res) => {
  res.json({ status: "ok", service: "WeTalks Express Server", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/wetalks/users", (req, res) => {
  const db = readWeTalksDB();
  res.json(
    db.users.map((u) => ({
      username: u.username,
      avatar_base64: u.avatar_base64 || ""
    }))
  );
});
function handleRegisterUser(req, res) {
  const { username, password, password_numeric, avatar_base64 } = req.body || {};
  const cleanUsername = String(username || "").trim();
  const rawPassword = String(password ?? password_numeric ?? "").trim();
  if (!cleanUsername || !rawPassword) {
    return res.status(400).json({ error: "\u30E6\u30FC\u30B6\u30FC\u540D\u3068\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  if (cleanUsername === "\u30B2\u30B9\u30C8") {
    return res.status(400).json({ error: "\u3053\u306E\u30E6\u30FC\u30B6\u30FC\u540D\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\u3002" });
  }
  if (cleanUsername.length > 24) {
    return res.status(400).json({ error: "\u30E6\u30FC\u30B6\u30FC\u540D\u306F24\u6587\u5B57\u4EE5\u5185\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  if (rawPassword.length < 4) {
    return res.status(400).json({ error: "\u30D1\u30B9\u30EF\u30FC\u30C9\u306F4\u6587\u5B57\u4EE5\u4E0A\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  const db = readWeTalksDB();
  const lowerUser = cleanUsername.toLowerCase();
  if (db.users.some((u) => u.username.toLowerCase().trim() === lowerUser)) {
    return res.status(409).json({ error: "\u3053\u306E\u30E6\u30FC\u30B6\u30FC\u540D\u306F\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002" });
  }
  const token = import_crypto.default.randomBytes(24).toString("hex");
  const newUser = {
    id: "u-" + Date.now() + "-" + import_crypto.default.randomBytes(4).toString("hex"),
    username: cleanUsername,
    password_hash: hashPassword(rawPassword),
    token,
    avatar_base64: avatar_base64 || ""
  };
  db.users.push(newUser);
  writeWeTalksDB(db);
  res.json({
    success: true,
    token,
    user: {
      username: newUser.username,
      avatar_base64: newUser.avatar_base64
    }
  });
}
app.post("/api/wetalks/register", handleRegisterUser);
app.post("/api/wetalks/users", handleRegisterUser);
app.post("/api/wetalks/login", (req, res) => {
  const { username, password } = req.body || {};
  const cleanUsername = String(username || "").trim();
  const rawPassword = String(password || "").trim();
  if (!cleanUsername || !rawPassword) {
    return res.status(400).json({ error: "\u30E6\u30FC\u30B6\u30FC\u540D\u3068\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  const db = readWeTalksDB();
  const user = db.users.find((u) => u.username.toLowerCase().trim() === cleanUsername.toLowerCase());
  if (!user || !verifyPassword(rawPassword, user)) {
    return res.status(401).json({ error: "\u30E6\u30FC\u30B6\u30FC\u540D\u307E\u305F\u306F\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002" });
  }
  if (!user.token) {
    user.token = import_crypto.default.randomBytes(24).toString("hex");
    writeWeTalksDB(db);
  }
  res.json({
    success: true,
    token: user.token,
    user: {
      username: user.username,
      avatar_base64: user.avatar_base64 || ""
    }
  });
});
app.get("/api/wetalks/auth/me", (req, res) => {
  const db = readWeTalksDB();
  const user = authenticateUser(req, db);
  if (!user) {
    return res.status(401).json({ error: "\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  res.json({
    success: true,
    user: {
      username: user.username,
      avatar_base64: user.avatar_base64 || ""
    }
  });
});
app.post("/api/wetalks/auth/me", (req, res) => {
  const db = readWeTalksDB();
  const user = authenticateUser(req, db);
  if (!user) {
    return res.status(401).json({ error: "\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  res.json({
    success: true,
    user: {
      username: user.username,
      avatar_base64: user.avatar_base64 || ""
    }
  });
});
app.post("/api/wetalks/users/avatar", (req, res) => {
  const { avatar_base64 } = req.body || {};
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  authUser.avatar_base64 = avatar_base64 || "";
  writeWeTalksDB(db);
  return res.json({ success: true });
});
app.post("/api/wetalks/users/rename", (req, res) => {
  const { newUsername } = req.body || {};
  const newTrimmed = String(newUsername || "").trim();
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002\u518D\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  if (!newTrimmed) {
    return res.status(400).json({ error: "\u65B0\u3057\u3044\u30E6\u30FC\u30B6\u30FC\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  if (newTrimmed === "\u30B2\u30B9\u30C8") {
    return res.status(400).json({ error: "\u3053\u306E\u30E6\u30FC\u30B6\u30FC\u540D\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\u3002" });
  }
  if (newTrimmed.length > 24) {
    return res.status(400).json({ error: "\u30E6\u30FC\u30B6\u30FC\u540D\u306F24\u6587\u5B57\u4EE5\u5185\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  const oldName = authUser.username;
  if (newTrimmed === oldName) {
    return res.json({ success: true, username: newTrimmed });
  }
  const conflict = db.users.some(
    (u) => u !== authUser && u.username.toLowerCase().trim() === newTrimmed.toLowerCase()
  );
  if (conflict) {
    return res.status(409).json({ error: "\u3053\u306E\u30E6\u30FC\u30B6\u30FC\u540D\u306F\u65E2\u306B\u4F7F\u7528\u3055\u308C\u3066\u3044\u308B\u305F\u3081\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002" });
  }
  authUser.username = newTrimmed;
  db.messages.forEach((m) => {
    if (m.sender === oldName) {
      m.sender = newTrimmed;
    }
    if (m.reply_to && m.reply_to.sender === oldName) {
      m.reply_to.sender = newTrimmed;
    }
    if (Array.isArray(m.read_by) && m.read_by.includes(oldName)) {
      m.read_by = Array.from(new Set(m.read_by.map((r) => r === oldName ? newTrimmed : r).filter((r) => r && r !== m.sender)));
    }
  });
  db.rooms.forEach((r) => {
    if (r.created_by === oldName) {
      r.created_by = newTrimmed;
    }
    if (Array.isArray(r.members)) {
      r.members = Array.from(new Set(r.members.map((m) => m === oldName ? newTrimmed : m)));
    }
    if (r.type === "direct" && r.name) {
      const parts = r.name.replace(/@/g, "").split(" & ");
      if (parts.length === 2 && (parts[0] === oldName || parts[1] === oldName)) {
        const updatedParts = parts.map((p) => p === oldName ? newTrimmed : p).sort();
        r.name = "@" + updatedParts[0] + " & @" + updatedParts[1];
      }
    }
  });
  writeWeTalksDB(db);
  res.json({ success: true, username: newTrimmed });
});
var wetalksPresence = /* @__PURE__ */ new Map();
app.post("/api/wetalks/presence", (req, res) => {
  const { clientId, username, roomId, offline } = req.body || {};
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  const resolvedName = authUser ? authUser.username : String(username || "").trim();
  const now = Date.now();
  if (offline && clientId) {
    wetalksPresence.delete(String(clientId));
  } else if (clientId && resolvedName && resolvedName !== "\u30B2\u30B9\u30C8") {
    wetalksPresence.set(String(clientId), {
      username: resolvedName,
      roomId: roomId ? String(roomId) : null,
      lastSeen: now
    });
  }
  for (const [key, val] of wetalksPresence.entries()) {
    if (now - val.lastSeen > 2e4) {
      wetalksPresence.delete(key);
    }
  }
  const activeClients = Array.from(wetalksPresence.values());
  const userMap = /* @__PURE__ */ new Map();
  activeClients.forEach((c) => {
    const uname = String(c.username || "").trim();
    if (uname && uname !== "\u30B2\u30B9\u30C8") {
      const k = uname.toLowerCase();
      if (!userMap.has(k)) userMap.set(k, uname);
    }
  });
  const onlineUsers = Array.from(userMap.values());
  const roomMembers = roomId ? Array.from(new Set(activeClients.filter((c) => c.roomId === roomId && c.username !== "\u30B2\u30B9\u30C8").map((c) => c.username))) : [];
  const fallbackSelf = !offline && resolvedName && resolvedName !== "\u30B2\u30B9\u30C8" ? 1 : 0;
  res.json({
    presenceSupported: true,
    onlineCount: onlineUsers.length > 0 ? onlineUsers.length : fallbackSelf,
    onlineUsers,
    roomMembers
  });
});
app.get("/api/wetalks/rooms", (req, res) => {
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.json([]);
  }
  const visibleRooms = db.rooms.filter((r) => isUserMemberOfRoom(r, authUser.username));
  res.json(visibleRooms);
});
app.post("/api/wetalks/rooms", (req, res) => {
  const { id, name, type, members } = req.body || {};
  if (!id || !name || !type) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  if (!db.deleted_rooms) db.deleted_rooms = [];
  db.deleted_rooms = db.deleted_rooms.filter((delId) => delId !== id);
  if (type === "direct") {
    const memberSet2 = /* @__PURE__ */ new Set([authUser.username]);
    if (Array.isArray(members)) {
      members.forEach((m) => {
        const s = String(m || "").trim();
        if (s && s !== "\u30B2\u30B9\u30C8") memberSet2.add(s);
      });
    }
    if (memberSet2.size < 2 && typeof name === "string") {
      const parts = name.replace(/@/g, "").split(" & ").map((s) => s.trim()).filter(Boolean);
      parts.forEach((p) => {
        if (p !== "\u30B2\u30B9\u30C8") memberSet2.add(p);
      });
    }
    const finalMembers = Array.from(memberSet2).slice(0, 2);
    if (finalMembers.length !== 2) {
      return res.status(400).json({ error: "1\u5BFE1\u30C8\u30FC\u30AF\u306B\u306F\u76F8\u624B\u306E\u30E6\u30FC\u30B6\u30FC\u304C\u5FC5\u8981\u3067\u3059\u3002" });
    }
    const sorted = [...finalMembers].sort();
    const canonicalName = "@" + sorted[0] + " & @" + sorted[1];
    const existingDirect = db.rooms.find((r) => {
      if (r.type !== "direct") return false;
      if (Array.isArray(r.members) && r.members.length === 2) {
        return r.members.includes(sorted[0]) && r.members.includes(sorted[1]);
      }
      return r.name === canonicalName;
    });
    if (existingDirect) {
      if (!Array.isArray(existingDirect.members)) {
        existingDirect.members = sorted;
        writeWeTalksDB(db);
      }
      return res.json({ success: true, room: existingDirect });
    }
    const existingById = db.rooms.find((r) => r.id === id);
    if (existingById) {
      return res.json({ success: true, room: existingById });
    }
    const newDirectRoom = {
      id,
      name: canonicalName,
      type: "direct",
      members: sorted,
      created_by: authUser.username
    };
    db.rooms.push(newDirectRoom);
    writeWeTalksDB(db);
    return res.json({ success: true, room: newDirectRoom });
  }
  const existing = db.rooms.find((r) => r.id === id);
  if (existing) {
    if (!isUserMemberOfRoom(existing, authUser.username)) {
      return res.status(403).json({ error: "\u3053\u306E\u30EB\u30FC\u30E0\u306B\u30A2\u30AF\u30BB\u30B9\u3059\u308B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002" });
    }
    return res.json({ success: true, room: existing });
  }
  const registeredUsernames = new Set(db.users.map((u) => u.username));
  const memberSet = /* @__PURE__ */ new Set([authUser.username]);
  if (Array.isArray(members)) {
    members.forEach((m) => {
      const s = String(m || "").trim();
      if (s && s !== "\u30B2\u30B9\u30C8" && registeredUsernames.has(s)) {
        memberSet.add(s);
      }
    });
  }
  const newRoom = {
    id,
    name: String(name).trim(),
    type: "group",
    members: Array.from(memberSet),
    created_by: authUser.username
  };
  db.rooms.push(newRoom);
  writeWeTalksDB(db);
  res.json({ success: true, room: newRoom });
});
app.post("/api/wetalks/rooms/:id/invite", (req, res) => {
  const { id } = req.params;
  const { members, username } = req.body || {};
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const room = db.rooms.find((r) => r.id === id);
  if (!room) {
    return res.status(404).json({ error: "\u30C8\u30FC\u30AF\u30EB\u30FC\u30E0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002" });
  }
  if (room.type !== "group") {
    return res.status(400).json({ error: "\u30B0\u30EB\u30FC\u30D7\u30C8\u30FC\u30AF\u306E\u307F\u30E1\u30F3\u30D0\u30FC\u3092\u62DB\u5F85\u3067\u304D\u307E\u3059\u3002" });
  }
  if (!isUserMemberOfRoom(room, authUser.username)) {
    return res.status(403).json({ error: "\u3053\u306E\u30B0\u30EB\u30FC\u30D7\u306E\u30E1\u30F3\u30D0\u30FC\u306E\u307F\u62DB\u5F85\u3067\u304D\u307E\u3059\u3002" });
  }
  const candidates = [];
  if (Array.isArray(members)) {
    members.forEach((m) => candidates.push(String(m || "").trim()));
  }
  if (username) {
    candidates.push(String(username).trim());
  }
  const registeredUsernames = new Set(db.users.map((u) => u.username));
  const currentMembers = Array.isArray(room.members) ? [...room.members] : [authUser.username];
  const memberSet = new Set(currentMembers);
  const addedMembers = [];
  candidates.forEach((c) => {
    if (c && c !== "\u30B2\u30B9\u30C8" && registeredUsernames.has(c) && !memberSet.has(c)) {
      memberSet.add(c);
      addedMembers.push(c);
    }
  });
  room.members = Array.from(memberSet);
  writeWeTalksDB(db);
  res.json({ success: true, room, addedMembers });
});
app.delete("/api/wetalks/rooms/:id", (req, res) => {
  const { id } = req.params;
  const db = readWeTalksDB();
  if (!db.deleted_rooms) db.deleted_rooms = [];
  if (!db.deleted_rooms.includes(id)) {
    db.deleted_rooms.push(id);
  }
  db.rooms = db.rooms.filter((r) => r.id !== id);
  db.messages = db.messages.filter((m) => m.room_id !== id);
  writeWeTalksDB(db);
  res.json({ success: true });
});
app.post("/api/wetalks/rooms/:id/read", (req, res) => {
  const { id } = req.params;
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const room = db.rooms.find((r) => r.id === id);
  if (room && !isUserMemberOfRoom(room, authUser.username)) {
    return res.status(403).json({ error: "\u3053\u306E\u30C8\u30FC\u30AF\u30EB\u30FC\u30E0\u3092\u95B2\u89A7\u3059\u308B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002" });
  }
  const updatedCount = markRoomMessagesAsRead(db, id, authUser.username);
  res.json({ success: true, updatedCount });
});
app.get("/api/wetalks/messages/:roomId", (req, res) => {
  const { roomId } = req.params;
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const room = db.rooms.find((r) => r.id === roomId);
  if (room && !isUserMemberOfRoom(room, authUser.username)) {
    return res.status(403).json({ error: "\u3053\u306E\u30C8\u30FC\u30AF\u30EB\u30FC\u30E0\u3092\u95B2\u89A7\u3059\u308B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002" });
  }
  const markRead = req.query.markRead === "1" || req.query.markRead === "true";
  if (markRead) {
    markRoomMessagesAsRead(db, roomId, authUser.username);
  }
  const msgs = db.messages.filter((m) => m.room_id === roomId).map((m) => ({
    ...m,
    read_by: Array.isArray(m.read_by) ? m.read_by.filter((u) => u && u !== m.sender) : []
  }));
  res.json(msgs);
});
app.post("/api/wetalks/messages", (req, res) => {
  const { id, room_id, text, image_base64, reply_to, created_at } = req.body || {};
  const cleanText = String(text || "").trim();
  const cleanImage = typeof image_base64 === "string" ? image_base64.trim() : "";
  if (!room_id || !cleanText && !cleanImage) {
    return res.status(400).json({ error: "Missing fields" });
  }
  if (cleanImage) {
    if (!/^data:image\/(png|jpeg|jpg|gif|webp|bmp);base64,[A-Za-z0-9+/=]+$/i.test(cleanImage)) {
      return res.status(400).json({ error: "\u7121\u52B9\u306A\u753B\u50CF\u5F62\u5F0F\u3067\u3059\u3002" });
    }
    if (cleanImage.length > 5 * 1024 * 1024) {
      return res.status(413).json({ error: "\u753B\u50CF\u30B5\u30A4\u30BA\u304C\u5927\u304D\u3059\u304E\u307E\u3059\u3002" });
    }
  }
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const room = db.rooms.find((r) => r.id === room_id);
  if (room && !isUserMemberOfRoom(room, authUser.username)) {
    return res.status(403).json({ error: "\u3053\u306E\u30C8\u30FC\u30AF\u30EB\u30FC\u30E0\u306B\u9001\u4FE1\u3059\u308B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002" });
  }
  const msgId = id || "m-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
  const existing = db.messages.find((m) => m.id === msgId);
  if (existing) {
    return res.json({ success: true, message: existing });
  }
  let cleanReply = null;
  if (reply_to && typeof reply_to === "object" && reply_to.id) {
    cleanReply = {
      id: String(reply_to.id).slice(0, 120),
      sender: String(reply_to.sender || "").slice(0, 40),
      text: String(reply_to.text || "").slice(0, 200),
      ...reply_to.has_image ? { has_image: true } : {}
    };
  }
  const newMsg = {
    id: msgId,
    room_id,
    sender: authUser.username,
    text: cleanText,
    ...cleanImage ? { image_base64: cleanImage } : {},
    ...cleanReply ? { reply_to: cleanReply } : {},
    read_by: [],
    created_at: created_at || (/* @__PURE__ */ new Date()).toISOString()
  };
  db.messages.push(newMsg);
  writeWeTalksDB(db);
  res.json({ success: true, message: newMsg });
});
app.get("/api/wetalks/admin/overview", (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "\u7BA1\u7406\u8005\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const db = readWeTalksDB();
  const roomMap = new Map(db.rooms.map((r) => [r.id, r.name]));
  const imagesCount = db.messages.filter((m) => !!m.image_base64).length;
  const users = db.users.map((u) => ({
    username: u.username,
    has_password: !!(u.password_hash || u.password_numeric),
    password_storage: u.password_hash ? "scrypt\u6697\u53F7\u5316\u4FDD\u5B58\u6E08\u307F" : u.password_numeric ? "\u4FDD\u5B58\u6E08\u307F" : "\u672A\u8A2D\u5B9A",
    avatar_base64: u.avatar_base64 || ""
  }));
  const rooms2 = db.rooms.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    members: Array.isArray(r.members) ? r.members : [],
    message_count: db.messages.filter((m) => m.room_id === r.id).length
  }));
  const recentMessages = db.messages.slice(-50).reverse().map((m) => {
    const createdMs = Date.parse(m.created_at || "");
    const expiresAt = m.image_base64 && !Number.isNaN(createdMs) ? new Date(createdMs + IMAGE_RETENTION_MS).toISOString() : null;
    return {
      id: m.id,
      room_id: m.room_id,
      room_name: roomMap.get(m.room_id) || m.room_id,
      sender: m.sender,
      text: m.text,
      has_image: !!m.image_base64,
      image_base64: m.image_base64 || "",
      image_expired: !!m.image_expired,
      created_at: m.created_at,
      image_expires_at: expiresAt
    };
  });
  return res.json({
    success: true,
    backend: "\u5185\u8535 Express \u30B5\u30FC\u30D0\u30FC (wetalks_db.json)",
    storage_verified: true,
    image_retention_days: IMAGE_RETENTION_DAYS,
    checked_at: (/* @__PURE__ */ new Date()).toISOString(),
    counts: {
      users: db.users.length,
      rooms: db.rooms.length,
      messages: db.messages.length,
      images: imagesCount
    },
    users,
    rooms: rooms2,
    recent_messages: recentMessages
  });
});
app.post("/api/wetalks/admin/prune-images", (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "\u7BA1\u7406\u8005\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const db = readWeTalksDB();
  const prunedCount = pruneExpiredWeTalksImages(db);
  const remainingImages = db.messages.filter((m) => !!m.image_base64).length;
  return res.json({ success: true, prunedCount, remainingImages });
});
app.delete("/api/wetalks/admin/messages/:id", (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "\u7BA1\u7406\u8005\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const { id } = req.params;
  const db = readWeTalksDB();
  const before = db.messages.length;
  db.messages = db.messages.filter((m) => m.id !== id);
  if (db.messages.length !== before) {
    writeWeTalksDB(db);
  }
  return res.json({ success: true });
});
app.delete("/api/wetalks/admin/users/:username", (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "\u7BA1\u7406\u8005\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const target = String(req.params.username || "").trim().toLowerCase();
  const db = readWeTalksDB();
  const before = db.users.length;
  db.users = db.users.filter((u) => u.username.toLowerCase().trim() !== target);
  if (db.users.length !== before) {
    writeWeTalksDB(db);
  }
  return res.json({ success: true });
});
app.get("/api/wetalks/admin/rooms/:id/messages", (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "\u7BA1\u7406\u8005\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const roomId = req.params.id;
  const db = readWeTalksDB();
  const room = db.rooms.find((r) => r.id === roomId) || null;
  const messages = db.messages.filter((m) => m.room_id === roomId).map((m) => {
    const createdMs = Date.parse(m.created_at || "");
    const expiresAt = m.image_base64 && !Number.isNaN(createdMs) ? new Date(createdMs + IMAGE_RETENTION_MS).toISOString() : null;
    return {
      ...m,
      has_image: !!m.image_base64,
      image_expires_at: expiresAt,
      read_by: Array.isArray(m.read_by) ? m.read_by.filter((u) => u && u !== m.sender) : []
    };
  });
  return res.json({ success: true, room, messages });
});
setInterval(() => {
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      readWeTalksDB();
    }
  } catch (e) {
  }
}, 60 * 60 * 1e3);
var tetrisQueue = [];
var tetrisRooms = {};
var server = import_http.default.createServer(app);
var PORT = 3e3;
var rooms = {};
var GRID_SIZE = 12;
var TILE_COLORS_COUNT = 5;
function createRandomGrid() {
  const grid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      row.push(Math.floor(Math.random() * TILE_COLORS_COUNT));
    }
    grid.push(row);
  }
  return grid;
}
function getRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      roomId,
      players: {},
      grid: createRandomGrid(),
      flies: [],
      status: "waiting",
      timer: 90,
      seekerId: null,
      roundWinner: null
    };
    spawnFlies(rooms[roomId], 4);
  }
  return rooms[roomId];
}
function spawnFlies(room, count) {
  for (let i = 0; i < count; i++) {
    const gridX = Math.floor(Math.random() * GRID_SIZE);
    const gridY = Math.floor(Math.random() * GRID_SIZE);
    const flyId = Math.random().toString(36).substring(2, 9);
    room.flies.push({
      id: flyId,
      gridX,
      gridY,
      points: 10
    });
  }
}
function rotateGridColors(room) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (Math.random() < 0.15) {
        room.grid[r][c] = (room.grid[r][c] + Math.floor(Math.random() * (TILE_COLORS_COUNT - 1)) + 1) % TILE_COLORS_COUNT;
      }
    }
  }
  Object.values(room.players).forEach((p) => {
    const gx = Math.floor(p.x);
    const gy = Math.floor(p.y);
    if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE) {
      p.targetColorIndex = room.grid[gy][gx];
    }
  });
}
function simulateBots(room) {
  const playerIds = Object.keys(room.players);
  const activeBots = playerIds.filter((id) => room.players[id].isBot);
  const realPlayers = playerIds.filter((id) => !room.players[id].isBot);
  if (realPlayers.length > 0 && activeBots.length < 3) {
    const botId = `bot_${Math.random().toString(36).substring(2, 6)}`;
    room.players[botId] = {
      id: botId,
      name: `ChameleBot ${Math.floor(Math.random() * 90) + 10}`,
      x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5,
      y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5,
      colorIndex: 0,
      targetColorIndex: 0,
      role: "hider",
      isAlive: true,
      score: 0,
      skinId: Math.floor(Math.random() * 4),
      isBot: true,
      heading: 0
    };
  }
  if (room.status === "playing") {
    Object.values(room.players).forEach((p) => {
      if (!p.isBot || !p.isAlive) return;
      if (p.role === "hider") {
        if (Math.random() < 0.08) {
          const dx = (Math.random() - 0.5) * 0.4;
          const dy = (Math.random() - 0.5) * 0.4;
          p.x = Math.max(0.1, Math.min(GRID_SIZE - 0.1, p.x + dx));
          p.y = Math.max(0.1, Math.min(GRID_SIZE - 0.1, p.y + dy));
          p.heading = Math.atan2(dy, dx) * (180 / Math.PI);
        }
        const gx = Math.floor(p.x);
        const gy = Math.floor(p.y);
        if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE) {
          p.targetColorIndex = room.grid[gy][gx];
        }
      } else if (p.role === "seeker") {
        if (Math.random() < 0.03) {
          const hiders = Object.values(room.players).filter((pl) => pl.role === "hider" && pl.isAlive);
          if (hiders.length > 0) {
            const target = hiders[Math.floor(Math.random() * hiders.length)];
            const err = 1;
            const targetX = target.x + (Math.random() - 0.5) * err;
            const targetY = target.y + (Math.random() - 0.5) * err;
            const angle = Math.atan2(targetY - p.y, targetX - p.x);
            p.x = Math.max(0.1, Math.min(GRID_SIZE - 0.1, p.x + Math.cos(angle) * 0.3));
            p.y = Math.max(0.1, Math.min(GRID_SIZE - 0.1, p.y + Math.sin(angle) * 0.3));
            p.heading = angle * (180 / Math.PI);
            if (Math.random() < 0.25) {
              const lickRange = 1.5;
              hiders.forEach((hid) => {
                const dist = Math.hypot(hid.x - p.x, hid.y - p.y);
                if (dist <= lickRange) {
                  hid.isAlive = false;
                  p.score += 50;
                }
              });
            }
          }
        }
      }
    });
  }
}
setInterval(() => {
  Object.keys(rooms).forEach((roomId) => {
    const room = rooms[roomId];
    simulateBots(room);
    if (room.status === "playing") {
      room.timer--;
      if (room.timer % 6 === 0) {
        rotateGridColors(room);
      }
      room.flies.forEach((fly, index) => {
        Object.values(room.players).forEach((p) => {
          if (p.isAlive && p.role === "hider") {
            const dist = Math.hypot(p.x - (fly.gridX + 0.5), p.y - (fly.gridY + 0.5));
            if (dist < 0.6) {
              p.score += fly.points;
              room.flies.splice(index, 1);
              spawnFlies(room, 1);
            }
          }
        });
      });
      const seeker = Object.values(room.players).find((p) => p.role === "seeker");
      if (seeker) {
        Object.values(room.players).forEach((hider) => {
          if (hider.role === "hider" && hider.isAlive) {
            const dist = Math.hypot(hider.x - seeker.x, hider.y - seeker.y);
            if (dist < 0.5) {
              hider.isAlive = false;
              seeker.score += 50;
            }
          }
        });
      }
      const aliveHiders = Object.values(room.players).filter((p) => p.role === "hider" && p.isAlive);
      if (aliveHiders.length === 0) {
        room.status = "ended";
        room.roundWinner = "seeker";
      } else if (room.timer <= 0) {
        room.status = "ended";
        room.roundWinner = "hiders";
      }
    }
  });
}, 1e3);
var wss = new import_ws.WebSocketServer({ noServer: true });
var wsMetaMap = /* @__PURE__ */ new WeakMap();
var relayChannels = /* @__PURE__ */ new Map();
function leaveRelayChannel(ws, targetChannel) {
  const meta = wsMetaMap.get(ws);
  if (!meta) return;
  const channel = targetChannel || meta.relayChannel;
  if (!channel) return;
  const members = relayChannels.get(channel);
  if (members) {
    members.delete(ws);
    const leavePayload = JSON.stringify({
      type: "relay_member_left",
      channel,
      memberId: meta.relayMemberId || meta.clientId,
      username: meta.relayUsername || "Player"
    });
    members.forEach((client) => {
      if (client.readyState === import_ws.WebSocket.OPEN) {
        client.send(leavePayload);
      }
    });
    if (members.size === 0) {
      relayChannels.delete(channel);
    }
  }
  if (meta.relayChannel === channel) {
    meta.relayChannel = void 0;
  }
}
server.on("upgrade", (request, socket, head) => {
  const protocol = request.headers["sec-websocket-protocol"];
  if (protocol === "vite-hmr" || protocol === "vite-ping") {
    return;
  }
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
wss.on("connection", (ws) => {
  let playerRoomId = "";
  const playerId = Math.random().toString(36).substring(2, 9);
  wsMetaMap.set(ws, { clientId: playerId });
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const meta = wsMetaMap.get(ws) || { clientId: playerId };
      wsMetaMap.set(ws, meta);
      switch (data.type) {
        case "ping": {
          ws.send(JSON.stringify({ type: "pong" }));
          break;
        }
        case "relay_join": {
          const channel = String(data.channel || "").trim();
          if (!channel) break;
          if (meta.relayChannel && meta.relayChannel !== channel) {
            leaveRelayChannel(ws, meta.relayChannel);
          }
          meta.relayChannel = channel;
          meta.relayMemberId = String(data.memberId || playerId);
          meta.relayUsername = String(data.username || "Player");
          let members = relayChannels.get(channel);
          if (!members) {
            members = /* @__PURE__ */ new Set();
            relayChannels.set(channel, members);
          }
          members.add(ws);
          const memberList = Array.from(members).map((client) => {
            const cm = wsMetaMap.get(client);
            return {
              memberId: cm?.relayMemberId || cm?.clientId || "",
              username: cm?.relayUsername || "Player"
            };
          }).filter((m) => !!m.memberId);
          ws.send(
            JSON.stringify({
              type: "relay_joined",
              channel,
              memberId: meta.relayMemberId,
              members: memberList
            })
          );
          const joinNotify = JSON.stringify({
            type: "relay_member_joined",
            channel,
            memberId: meta.relayMemberId,
            username: meta.relayUsername
          });
          members.forEach((client) => {
            if (client !== ws && client.readyState === import_ws.WebSocket.OPEN) {
              client.send(joinNotify);
            }
          });
          break;
        }
        case "relay_broadcast": {
          const channel = String(data.channel || meta.relayChannel || "").trim();
          if (!channel || !data.event) break;
          const members = relayChannels.get(channel);
          if (!members) break;
          const out = JSON.stringify({
            type: "relay_event",
            channel,
            event: data.event,
            payload: data.payload ?? {},
            fromMemberId: meta.relayMemberId || playerId
          });
          members.forEach((client) => {
            if (client.readyState === import_ws.WebSocket.OPEN && (data.includeSelf || client !== ws)) {
              client.send(out);
            }
          });
          break;
        }
        case "relay_leave": {
          leaveRelayChannel(ws, data.channel ? String(data.channel).trim() : void 0);
          break;
        }
        case "join": {
          playerRoomId = String(data.roomId || "default").trim().toLowerCase() || "default";
          meta.chameleonRoomId = playerRoomId;
          const currentRoom = getRoom(playerRoomId);
          const hasSeeker = Object.values(currentRoom.players).some((p) => p.role === "seeker");
          const role = hasSeeker ? "hider" : "seeker";
          const px = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5;
          const py = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5;
          const tileColor = currentRoom.grid[Math.floor(py)][Math.floor(px)] ?? 0;
          currentRoom.players[playerId] = {
            id: playerId,
            name: data.name || `Chameleon_${playerId}`,
            x: px,
            y: py,
            colorIndex: 0,
            targetColorIndex: tileColor,
            role,
            isAlive: true,
            score: 0,
            skinId: data.skinId || 0,
            isBot: false,
            heading: 0
          };
          if (role === "seeker") {
            currentRoom.seekerId = playerId;
          }
          ws.send(JSON.stringify({
            type: "init",
            playerId,
            roomId: playerRoomId,
            gameState: currentRoom
          }));
          break;
        }
        case "move": {
          if (!playerRoomId) break;
          const room = getRoom(playerRoomId);
          const player = room.players[playerId];
          if (player && player.isAlive) {
            player.x = Math.max(0.1, Math.min(GRID_SIZE - 0.1, data.x));
            player.y = Math.max(0.1, Math.min(GRID_SIZE - 0.1, data.y));
            player.heading = data.heading || 0;
            const gx = Math.floor(player.x);
            const gy = Math.floor(player.y);
            if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE) {
              player.targetColorIndex = room.grid[gy][gx];
            }
          }
          break;
        }
        case "lick": {
          if (!playerRoomId) break;
          const room = getRoom(playerRoomId);
          const player = room.players[playerId];
          if (player && player.role === "seeker") {
            const lickRange = 1.8;
            Object.values(room.players).forEach((hid) => {
              if (hid.role === "hider" && hid.isAlive) {
                const dist = Math.hypot(hid.x - player.x, hid.y - player.y);
                if (dist <= lickRange) {
                  hid.isAlive = false;
                  player.score += 50;
                }
              }
            });
            broadcastToRoom(playerRoomId, {
              type: "lick_effect",
              seekerId: playerId,
              x: player.x,
              y: player.y,
              heading: player.heading
            });
          }
          break;
        }
        case "skin_change": {
          if (!playerRoomId) break;
          const room = getRoom(playerRoomId);
          const player = room.players[playerId];
          if (player) {
            player.skinId = data.skinId;
          }
          break;
        }
        case "start_game": {
          if (!playerRoomId) break;
          const room = getRoom(playerRoomId);
          if (room.status !== "playing") {
            room.status = "playing";
            room.timer = 90;
            room.flies = [];
            room.roundWinner = null;
            spawnFlies(room, 4);
            const playerIds = Object.keys(room.players);
            if (playerIds.length > 0) {
              const seekerIndex = Math.floor(Math.random() * playerIds.length);
              playerIds.forEach((id, idx) => {
                const nx = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5;
                const ny = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5;
                room.players[id].role = idx === seekerIndex ? "seeker" : "hider";
                room.players[id].isAlive = true;
                room.players[id].x = nx;
                room.players[id].y = ny;
                room.players[id].targetColorIndex = room.grid[Math.floor(ny)][Math.floor(nx)] ?? 0;
              });
              room.seekerId = playerIds[seekerIndex];
            }
            broadcastToRoom(playerRoomId, {
              type: "system",
              text: "The hunt has started! Chameleon hiders, camouflage into the tiles!"
            });
          }
          break;
        }
        case "chat": {
          if (!playerRoomId) break;
          const room = getRoom(playerRoomId);
          broadcastToRoom(playerRoomId, {
            type: "chat",
            sender: room.players[playerId]?.name || "Chameleon",
            text: data.text
          });
          break;
        }
        case "tetris_join": {
          const clientName = data.name || "Anonymous Player";
          const newClient = {
            id: playerId,
            name: clientName,
            ws
          };
          const existingIdx = tetrisQueue.findIndex((c) => c.id === playerId);
          if (existingIdx !== -1) {
            tetrisQueue[existingIdx] = newClient;
          } else if (tetrisQueue.length > 0) {
            const opp = tetrisQueue.shift();
            if (opp.id === playerId) {
              tetrisQueue.push(newClient);
              ws.send(JSON.stringify({ type: "tetris_waiting" }));
            } else {
              const rId = "t_room_" + Math.random().toString(36).substr(2, 6);
              const room = {
                id: rId,
                player1: opp,
                player2: newClient
              };
              tetrisRooms[rId] = room;
              opp.ws.send(JSON.stringify({
                type: "tetris_matched",
                roomId: rId,
                opponentName: newClient.name
              }));
              ws.send(JSON.stringify({
                type: "tetris_matched",
                roomId: rId,
                opponentName: opp.name
              }));
            }
          } else {
            tetrisQueue.push(newClient);
            ws.send(JSON.stringify({ type: "tetris_waiting" }));
          }
          break;
        }
        case "tetris_sync_grid": {
          const rId = data.roomId;
          const room = tetrisRooms[rId];
          if (room) {
            const isP1 = room.player1.id === playerId;
            const opp = isP1 ? room.player2 : room.player1;
            opp.ws.send(JSON.stringify({
              type: "tetris_sync_grid",
              grid: data.grid,
              score: data.score
            }));
          }
          break;
        }
        case "tetris_send_garbage": {
          const rId = data.roomId;
          const room = tetrisRooms[rId];
          if (room) {
            const isP1 = room.player1.id === playerId;
            const opp = isP1 ? room.player2 : room.player1;
            opp.ws.send(JSON.stringify({
              type: "tetris_opponent_garbage",
              lines: data.lines
            }));
          }
          break;
        }
        case "tetris_gameover": {
          const rId = data.roomId;
          const room = tetrisRooms[rId];
          if (room) {
            const isP1 = room.player1.id === playerId;
            const opp = isP1 ? room.player2 : room.player1;
            opp.ws.send(JSON.stringify({
              type: "tetris_opponent_gameover"
            }));
          }
          break;
        }
        // ─── GeoGuessr Online Multiplayer Handlers ───
        case "geo_queue_join": {
          removePlayerFromGeoQueue(playerId);
          leavePlayerGeoRoom(playerId);
          const format = data.format === "classic5" ? "classic5" : "duels";
          const mapId = GEOGUESSR_MAPS[data.mapId] ? data.mapId : "world";
          const moveMode = data.moveMode === "nomove" || data.moveMode === "nmpz" ? data.moveMode : "moving";
          const roundTimeSec = typeof data.roundTimeSec === "number" ? data.roundTimeSec : 90;
          const playerName = String(data.name || `Explorer_${playerId.slice(0, 4)}`).slice(0, 24);
          const opponentIdx = geoQueue.findIndex((q) => q.format === format && q.id !== playerId);
          if (opponentIdx !== -1) {
            const opponent = geoQueue.splice(opponentIdx, 1)[0];
            const roomCode = generateGeoRoomCode();
            const room = {
              roomCode,
              hostId: opponent.id,
              format,
              mapId: opponent.mapId,
              moveMode: opponent.moveMode,
              roundTimeSec: opponent.roundTimeSec,
              status: "lobby",
              currentRound: 1,
              maxRounds: format === "classic5" ? 5 : 99,
              target: { lat: 0, lng: 0, heading: 0 },
              roundStartedAt: null,
              roundDeadlineAt: null,
              countdownEndAt: null,
              winnerId: null,
              players: [
                {
                  id: opponent.id,
                  name: opponent.name,
                  ws: opponent.ws,
                  hp: 6e3,
                  totalScore: 0,
                  guess: null,
                  softPin: null,
                  guessedAt: null,
                  readyForNext: false,
                  wantsRematch: false,
                  connected: true
                },
                {
                  id: playerId,
                  name: playerName,
                  ws,
                  hp: 6e3,
                  totalScore: 0,
                  guess: null,
                  softPin: null,
                  guessedAt: null,
                  readyForNext: false,
                  wantsRematch: false,
                  connected: true
                }
              ],
              history: [],
              createdAt: Date.now()
            };
            geoRooms.set(roomCode, room);
            startGeoRound(room, 1);
          } else {
            geoQueue.push({
              id: playerId,
              name: playerName,
              ws,
              format,
              mapId,
              moveMode,
              roundTimeSec,
              joinedAt: Date.now()
            });
            ws.send(
              JSON.stringify({
                type: "geo_queue_waiting",
                format,
                waitingCount: geoQueue.length
              })
            );
          }
          break;
        }
        case "geo_queue_leave": {
          removePlayerFromGeoQueue(playerId);
          ws.send(JSON.stringify({ type: "geo_queue_cancelled" }));
          break;
        }
        case "geo_room_create": {
          removePlayerFromGeoQueue(playerId);
          leavePlayerGeoRoom(playerId);
          const format = data.format === "classic5" ? "classic5" : "duels";
          const mapId = GEOGUESSR_MAPS[data.mapId] ? data.mapId : "world";
          const moveMode = data.moveMode === "nomove" || data.moveMode === "nmpz" ? data.moveMode : "moving";
          const roundTimeSec = typeof data.roundTimeSec === "number" ? data.roundTimeSec : 90;
          const playerName = String(data.name || `Host_${playerId.slice(0, 4)}`).slice(0, 24);
          const roomCode = generateGeoRoomCode();
          const room = {
            roomCode,
            hostId: playerId,
            format,
            mapId,
            moveMode,
            roundTimeSec,
            status: "lobby",
            currentRound: 1,
            maxRounds: format === "classic5" ? 5 : 99,
            target: { lat: 0, lng: 0, heading: 0 },
            roundStartedAt: null,
            roundDeadlineAt: null,
            countdownEndAt: null,
            winnerId: null,
            players: [
              {
                id: playerId,
                name: playerName,
                ws,
                hp: 6e3,
                totalScore: 0,
                guess: null,
                softPin: null,
                guessedAt: null,
                readyForNext: false,
                wantsRematch: false,
                connected: true
              }
            ],
            history: [],
            createdAt: Date.now()
          };
          geoRooms.set(roomCode, room);
          broadcastGeoRoom(room);
          break;
        }
        case "geo_room_join": {
          const code = String(data.roomCode || "").trim().toUpperCase();
          const room = geoRooms.get(code);
          if (!room) {
            ws.send(JSON.stringify({ type: "geo_error", message: "\u30EB\u30FC\u30E0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30B3\u30FC\u30C9\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002" }));
            break;
          }
          if (room.players.length >= 2) {
            ws.send(JSON.stringify({ type: "geo_error", message: "\u3053\u306E\u30EB\u30FC\u30E0\u306F\u6E80\u54E1\u3067\u3059\u3002" }));
            break;
          }
          if (room.status !== "lobby") {
            ws.send(JSON.stringify({ type: "geo_error", message: "\u3053\u306E\u30EB\u30FC\u30E0\u306F\u3059\u3067\u306B\u5BFE\u6226\u4E2D\u3067\u3059\u3002" }));
            break;
          }
          removePlayerFromGeoQueue(playerId);
          leavePlayerGeoRoom(playerId);
          const playerName = String(data.name || `Guest_${playerId.slice(0, 4)}`).slice(0, 24);
          room.players.push({
            id: playerId,
            name: playerName,
            ws,
            hp: 6e3,
            totalScore: 0,
            guess: null,
            softPin: null,
            guessedAt: null,
            readyForNext: false,
            wantsRematch: false,
            connected: true
          });
          broadcastGeoRoom(room);
          break;
        }
        case "geo_room_update_settings": {
          const code = String(data.roomCode || "").trim().toUpperCase();
          const room = geoRooms.get(code);
          if (!room || room.hostId !== playerId || room.status !== "lobby") break;
          if (data.format === "duels" || data.format === "classic5") {
            room.format = data.format;
            room.maxRounds = data.format === "classic5" ? 5 : 99;
          }
          if (GEOGUESSR_MAPS[data.mapId]) room.mapId = data.mapId;
          if (data.moveMode === "moving" || data.moveMode === "nomove" || data.moveMode === "nmpz") {
            room.moveMode = data.moveMode;
          }
          if (typeof data.roundTimeSec === "number") room.roundTimeSec = data.roundTimeSec;
          broadcastGeoRoom(room);
          break;
        }
        case "geo_room_start": {
          const code = String(data.roomCode || "").trim().toUpperCase();
          const room = geoRooms.get(code);
          if (!room || room.hostId !== playerId || room.players.length < 2) break;
          room.players.forEach((p) => {
            p.hp = 6e3;
            p.totalScore = 0;
          });
          room.history = [];
          room.winnerId = null;
          startGeoRound(room, 1);
          break;
        }
        case "geo_pano_verified": {
          const code = String(data.roomCode || "").trim().toUpperCase();
          const room = geoRooms.get(code);
          if (!room || room.status !== "playing" || room.currentRound !== data.roundNumber) break;
          if (!room.target.panoId && data.actual && typeof data.actual.lat === "number" && typeof data.actual.lng === "number") {
            room.target = {
              lat: data.actual.lat,
              lng: data.actual.lng,
              heading: room.target.heading,
              panoId: data.actual.panoId ? String(data.actual.panoId) : void 0,
              locationLabel: data.actual.locationLabel ? String(data.actual.locationLabel) : void 0
            };
            broadcastGeoRoom(room);
          } else if (!room.target.locationLabel && data.actual?.locationLabel) {
            room.target.locationLabel = String(data.actual.locationLabel);
          }
          break;
        }
        case "geo_guess_pin": {
          const code = String(data.roomCode || "").trim().toUpperCase();
          const room = geoRooms.get(code);
          if (!room || room.status !== "playing") break;
          const player = room.players.find((p) => p.id === playerId);
          if (!player || player.guess) break;
          if (typeof data.lat === "number" && typeof data.lng === "number") {
            player.softPin = { lat: data.lat, lng: data.lng };
          }
          break;
        }
        case "geo_guess_submit": {
          const code = String(data.roomCode || "").trim().toUpperCase();
          const room = geoRooms.get(code);
          if (!room || room.status !== "playing") break;
          const player = room.players.find((p) => p.id === playerId);
          if (!player || player.guess) break;
          if (typeof data.lat !== "number" || typeof data.lng !== "number") break;
          player.guess = { lat: data.lat, lng: data.lng };
          player.softPin = player.guess;
          player.guessedAt = Date.now();
          const allGuessed = room.players.every((p) => p.guess !== null);
          if (allGuessed) {
            resolveGeoRound(room);
          } else {
            const pressureEnd = Date.now() + 15e3;
            room.countdownEndAt = room.countdownEndAt ? Math.min(room.countdownEndAt, pressureEnd) : pressureEnd;
            broadcastGeoRoom(room);
          }
          break;
        }
        case "geo_next_round": {
          const code = String(data.roomCode || "").trim().toUpperCase();
          const room = geoRooms.get(code);
          if (!room || room.status !== "round_result") break;
          const player = room.players.find((p) => p.id === playerId);
          if (!player) break;
          player.readyForNext = true;
          if (room.players.every((p) => p.readyForNext)) {
            startGeoRound(room, room.currentRound + 1);
          } else {
            broadcastGeoRoom(room);
          }
          break;
        }
        case "geo_rematch": {
          const code = String(data.roomCode || "").trim().toUpperCase();
          const room = geoRooms.get(code);
          if (!room || room.status !== "match_over") break;
          const player = room.players.find((p) => p.id === playerId);
          if (!player) break;
          player.wantsRematch = true;
          if (room.players.length >= 2 && room.players.every((p) => p.wantsRematch)) {
            room.players.forEach((p) => {
              p.hp = 6e3;
              p.totalScore = 0;
              p.wantsRematch = false;
            });
            room.history = [];
            room.winnerId = null;
            startGeoRound(room, 1);
          } else {
            broadcastGeoRoom(room);
          }
          break;
        }
        case "geo_leave_room": {
          removePlayerFromGeoQueue(playerId);
          leavePlayerGeoRoom(playerId);
          break;
        }
      }
    } catch (err) {
      console.error("Error handling WebSocket message:", err);
    }
  });
  ws.on("close", () => {
    leaveRelayChannel(ws);
    removePlayerFromGeoQueue(playerId);
    leavePlayerGeoRoom(playerId);
    const queueIdx = tetrisQueue.findIndex((c) => c.id === playerId);
    if (queueIdx !== -1) {
      tetrisQueue.splice(queueIdx, 1);
    }
    Object.keys(tetrisRooms).forEach((rId) => {
      const room = tetrisRooms[rId];
      if (room.player1.id === playerId || room.player2.id === playerId) {
        const opp = room.player1.id === playerId ? room.player2 : room.player1;
        try {
          opp.ws.send(JSON.stringify({ type: "tetris_opponent_disconnected" }));
        } catch (e) {
        }
        delete tetrisRooms[rId];
      }
    });
    Object.keys(rooms).forEach((rId) => {
      const room = rooms[rId];
      if (room.players[playerId]) {
        delete room.players[playerId];
        if (room.seekerId === playerId) {
          const remainingIds = Object.keys(room.players);
          if (remainingIds.length > 0) {
            const nextSeeker = remainingIds[0];
            room.players[nextSeeker].role = "seeker";
            room.seekerId = nextSeeker;
          } else {
            room.seekerId = null;
          }
        }
        const hasRealPlayer = Object.values(room.players).some((p) => !p.isBot);
        if (!hasRealPlayer) {
          delete rooms[rId];
        }
      }
    });
  });
});
function broadcastToRoom(roomId, message) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === import_ws.WebSocket.OPEN) {
      const meta = wsMetaMap.get(client);
      if (meta?.chameleonRoomId === roomId) {
        client.send(payload);
      }
    }
  });
}
function broadcastAllWs(message) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === import_ws.WebSocket.OPEN) {
      client.send(payload);
    }
  });
}
setInterval(() => {
  Object.keys(rooms).forEach((roomId) => {
    const room = rooms[roomId];
    broadcastToRoom(roomId, {
      type: "state_update",
      gameState: room
    });
  });
}, 40);
var BROADCASTS_FILE = import_path.default.join(process.cwd(), "broadcasts_db.json");
function readBroadcasts() {
  try {
    if (import_fs.default.existsSync(BROADCASTS_FILE)) {
      const data = import_fs.default.readFileSync(BROADCASTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading broadcasts db:", e);
  }
  return [];
}
function writeBroadcasts(broadcasts) {
  try {
    import_fs.default.writeFileSync(BROADCASTS_FILE, JSON.stringify(broadcasts, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing broadcasts db:", e);
  }
}
app.get("/api/admin/broadcasts", (req, res) => {
  const broadcasts = readBroadcasts();
  res.json(broadcasts);
});
app.post("/api/admin/broadcasts", (req, res) => {
  const { sender, title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: "Title and text are required" });
  }
  const broadcasts = readBroadcasts();
  const newBroadcast = {
    id: "bc-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
    sender: sender || "\u7BA1\u7406\u8005 (Admin)",
    title,
    text,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  broadcasts.push(newBroadcast);
  writeBroadcasts(broadcasts);
  broadcastAllWs({
    type: "admin_broadcast",
    broadcast: newBroadcast
  });
  res.json({ success: true, broadcast: newBroadcast });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", playersCount: wss.clients.size });
});
app.get("/api/geoguessr/config", (req, res) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "";
  res.json({ apiKey });
});
var isProduction = process.env.NODE_ENV === "production";
async function startServer() {
  if (!isProduction) {
    const isHmrDisabled = process.env.DISABLE_HMR === "true";
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true,
        ...isHmrDisabled ? { hmr: false, ws: false } : { hmr: { server } }
      },
      appType: "spa"
    });
    if (isHmrDisabled) {
      app.use(async (req, res, next) => {
        if (req.path === "/@vite/client" || req.path.endsWith("/@vite/client")) {
          try {
            const result = await vite.transformRequest("/@vite/client");
            if (result) {
              const patchedCode = result.code.replace(
                "transport.connect(createHMRHandler(handleMessage));",
                "/* HMR disabled via DISABLE_HMR=true */"
              );
              res.setHeader("Content-Type", "application/javascript");
              return res.send(patchedCode);
            }
          } catch {
          }
        }
        next();
      });
    }
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use("/noon-os", import_express.default.static(distPath));
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
