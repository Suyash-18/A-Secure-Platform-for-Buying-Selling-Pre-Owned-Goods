import axios from 'axios';

export const getCoordinatesFromAddress = async ({ address, city, state, country }) => {
  const apiKey = process.env.LOCATIONIQ_API_KEY;
  const fullAddress = `${address}, ${city}, ${state}, ${country}`;
  const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(fullAddress)}&format=json`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    } else {
      throw new Error('No results found for the provided address.');
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Failed to fetch coordinates from LocationIQ.');
  }
};
