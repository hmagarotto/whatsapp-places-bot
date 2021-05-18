import * as assert from 'assert';
import { Place, Client } from '@googlemaps/google-maps-services-js';
import { GOOGLE_API_KEY } from './env';

export { Place };

const client = new Client({});

export async function searchPlaces(
  latitude: number,
  longitude: number,
  query: string,
  radius = 2000,
): Promise<Place[]> {
  assert.ok(GOOGLE_API_KEY, 'Google API key is not configured');
  const result = await client.textSearch({
    params: {
      key: GOOGLE_API_KEY,
      query,
      location: {
        latitude,
        longitude,
      },
      radius,
    },
  });
  const places = result.data.results;
  console.log(JSON.stringify(places, null, 4));
  return places;
}
