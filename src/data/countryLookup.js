/**
 * Country Lookup & Reverse Geocoding Utility
 * Provides instant offline country detection + high-precision online reverse geocoding
 * for any (lat, lon) clicked on the 3D Earth.
 */

// ISO 3166-1 alpha-2 code to Emoji Flag
export function getFlagEmoji(countryCode) {
  if (!countryCode || typeof countryCode !== 'string' || countryCode.length !== 2) {
    return '🌐';
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// In-memory cache to prevent redundant network lookups
const geocodeCache = new Map();

// Major world ocean bounding detection
const OCEANS = [
  { name: 'Arctic Ocean', minLat: 66, maxLat: 90, minLon: -180, maxLon: 180 },
  { name: 'Southern Ocean', minLat: -90, maxLat: -60, minLon: -180, maxLon: 180 },
  { name: 'North Atlantic Ocean', minLat: 0, maxLat: 66, minLon: -80, maxLon: 0 },
  { name: 'South Atlantic Ocean', minLat: -60, maxLat: 0, minLon: -70, maxLon: 20 },
  { name: 'Indian Ocean', minLat: -60, maxLat: 30, minLon: 20, maxLon: 115 },
  { name: 'North Pacific Ocean', minLat: 0, maxLat: 66, minLon: 100, maxLon: -100 },
  { name: 'South Pacific Ocean', minLat: -60, maxLat: 0, minLon: 120, maxLon: -70 },
];

// Offline fallback centroids for major countries across all continents
export const MAJOR_COUNTRIES = [
  { name: 'United States', code: 'US', lat: 37.09, lon: -95.71, continent: 'North America' },
  { name: 'Canada', code: 'CA', lat: 56.13, lon: -106.35, continent: 'North America' },
  { name: 'Mexico', code: 'MX', lat: 23.63, lon: -102.55, continent: 'North America' },
  { name: 'Brazil', code: 'BR', lat: -14.23, lon: -51.92, continent: 'South America' },
  { name: 'Argentina', code: 'AR', lat: -38.41, lon: -63.61, continent: 'South America' },
  { name: 'Chile', code: 'CL', lat: -35.67, lon: -71.54, continent: 'South America' },
  { name: 'Colombia', code: 'CO', lat: 4.57, lon: -74.29, continent: 'South America' },
  { name: 'Peru', code: 'PE', lat: -9.19, lon: -75.01, continent: 'South America' },
  { name: 'United Kingdom', code: 'GB', lat: 55.37, lon: -3.43, continent: 'Europe' },
  { name: 'France', code: 'FR', lat: 46.22, lon: 2.21, continent: 'Europe' },
  { name: 'Germany', code: 'DE', lat: 51.16, lon: 10.45, continent: 'Europe' },
  { name: 'Italy', code: 'IT', lat: 41.87, lon: 12.56, continent: 'Europe' },
  { name: 'Spain', code: 'ES', lat: 40.46, lon: -3.74, continent: 'Europe' },
  { name: 'Portugal', code: 'PT', lat: 39.39, lon: -8.22, continent: 'Europe' },
  { name: 'Netherlands', code: 'NL', lat: 52.13, lon: 5.29, continent: 'Europe' },
  { name: 'Switzerland', code: 'CH', lat: 46.81, lon: 8.22, continent: 'Europe' },
  { name: 'Norway', code: 'NO', lat: 60.47, lon: 8.46, continent: 'Europe' },
  { name: 'Sweden', code: 'SE', lat: 60.12, lon: 18.64, continent: 'Europe' },
  { name: 'Finland', code: 'FI', lat: 61.92, lon: 25.74, continent: 'Europe' },
  { name: 'Poland', code: 'PL', lat: 51.91, lon: 19.14, continent: 'Europe' },
  { name: 'Ukraine', code: 'UA', lat: 48.37, lon: 31.16, continent: 'Europe' },
  { name: 'Russia', code: 'RU', lat: 61.52, lon: 105.31, continent: 'Europe/Asia' },
  { name: 'Japan', code: 'JP', lat: 36.20, lon: 138.25, continent: 'Asia' },
  { name: 'China', code: 'CN', lat: 35.86, lon: 104.19, continent: 'Asia' },
  { name: 'India', code: 'IN', lat: 20.59, lon: 78.96, continent: 'Asia' },
  { name: 'South Korea', code: 'KR', lat: 35.90, lon: 127.76, continent: 'Asia' },
  { name: 'Indonesia', code: 'ID', lat: -0.78, lon: 113.92, continent: 'Asia' },
  { name: 'Saudi Arabia', code: 'SA', lat: 23.88, lon: 45.07, continent: 'Asia' },
  { name: 'United Arab Emirates', code: 'AE', lat: 23.42, lon: 53.84, continent: 'Asia' },
  { name: 'Turkey', code: 'TR', lat: 38.96, lon: 35.24, continent: 'Asia/Europe' },
  { name: 'Egypt', code: 'EG', lat: 26.82, lon: 30.80, continent: 'Africa' },
  { name: 'South Africa', code: 'ZA', lat: -30.55, lon: 22.93, continent: 'Africa' },
  { name: 'Nigeria', code: 'NG', lat: 9.08, lon: 8.67, continent: 'Africa' },
  { name: 'Kenya', code: 'KE', lat: -0.02, lon: 37.90, continent: 'Africa' },
  { name: 'Morocco', code: 'MA', lat: 31.79, lon: -7.09, continent: 'Africa' },
  { name: 'Australia', code: 'AU', lat: -25.27, lon: 133.77, continent: 'Oceania' },
  { name: 'New Zealand', code: 'NZ', lat: -40.90, lon: 174.88, continent: 'Oceania' },
];

/**
 * Returns immediate offline estimate of nearest country based on great-circle distance
 */
export function getOfflineCountryEstimate(lat, lon) {
  let closest = null;
  let minDistance = Infinity;

  for (const c of MAJOR_COUNTRIES) {
    const dLat = (c.lat - lat) * (Math.PI / 180);
    const dLon = (c.lon - lon) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) *
        Math.cos(c.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    if (d < minDistance) {
      minDistance = d;
      closest = c;
    }
  }

  // If very far from any land centroid (distance > ~1800km in radians: ~0.28), check ocean
  if (minDistance > 0.35) {
    for (const o of OCEANS) {
      if (lat >= o.minLat && lat <= o.maxLat) {
        return {
          countryName: o.name,
          countryCode: '',
          isOcean: true,
          continent: 'Ocean',
          flag: '🌊',
        };
      }
    }
  }

  return {
    countryName: closest ? closest.name : 'Unknown Location',
    countryCode: closest ? closest.code : '',
    isOcean: false,
    continent: closest ? closest.continent : '',
    flag: closest ? getFlagEmoji(closest.code) : '🌐',
  };
}

/**
 * High-precision reverse geocoding using client-side API with automatic offline fallback.
 */
export async function reverseGeocode(lat, lon) {
  const roundLat = Number(lat.toFixed(2));
  const roundLon = Number(lon.toFixed(2));
  const cacheKey = `${roundLat},${roundLon}`;

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${roundLat}&longitude=${roundLon}&localityLanguage=en`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Geocode HTTP error');
    const data = await res.json();

    // Check if land country was found
    if (data.countryName && data.countryCode) {
      const result = {
        countryName: data.countryName,
        countryCode: data.countryCode,
        region: data.principalSubdivision || data.city || '',
        continent: data.continent || '',
        isOcean: false,
        flag: getFlagEmoji(data.countryCode),
        flagUrl: `https://flagcdn.com/w80/${data.countryCode.toLowerCase()}.png`,
        lat: roundLat,
        lon: roundLon,
      };
      geocodeCache.set(cacheKey, result);
      return result;
    }

    // Check informative ocean / sea names
    const oceanInfo = data.localityInfo?.informative?.find(
      (item) => item.name && /ocean|sea|gulf|bay/i.test(item.name)
    );

    if (oceanInfo) {
      const result = {
        countryName: oceanInfo.name,
        countryCode: '',
        region: oceanInfo.description || 'International Waters',
        continent: 'Ocean',
        isOcean: true,
        flag: '🌊',
        flagUrl: null,
        lat: roundLat,
        lon: roundLon,
      };
      geocodeCache.set(cacheKey, result);
      return result;
    }

    // Fallback to offline estimation
    const fallback = getOfflineCountryEstimate(roundLat, roundLon);
    const result = {
      countryName: fallback.countryName,
      countryCode: fallback.countryCode,
      region: fallback.continent,
      continent: fallback.continent,
      isOcean: fallback.isOcean,
      flag: fallback.flag,
      flagUrl: fallback.countryCode ? `https://flagcdn.com/w80/${fallback.countryCode.toLowerCase()}.png` : null,
      lat: roundLat,
      lon: roundLon,
    };
    geocodeCache.set(cacheKey, result);
    return result;
  } catch (_err) {
    // Immediate safe offline fallback on network error or timeout
    const fallback = getOfflineCountryEstimate(roundLat, roundLon);
    return {
      countryName: fallback.countryName,
      countryCode: fallback.countryCode,
      region: fallback.continent,
      continent: fallback.continent,
      isOcean: fallback.isOcean,
      flag: fallback.flag,
      flagUrl: fallback.countryCode ? `https://flagcdn.com/w80/${fallback.countryCode.toLowerCase()}.png` : null,
      lat: roundLat,
      lon: roundLon,
    };
  }
}
