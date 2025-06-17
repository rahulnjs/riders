import axios from 'axios';

const DIRECTION_API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';
const NEARBY_LOCATION_URL = 'https://places.googleapis.com/v1/places:searchNearby'
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const getHeaders = () => ({
  'x-goog-api-key': API_KEY,
  'x-goog-fieldmask': '*',
});

const buildRequestBody = (body) => {
  const request = {
    ...body,
    polylineQuality: 'high_quality',
    computeAlternativeRoutes: body.alertnateRoute ?? true,
  }
  delete request.alertnateRoute;
  return request;
};

const getDirections = async (body) => {
  try {
    const response = await axios.post(DIRECTION_API_URL, buildRequestBody(body), {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching directions:', error);
    throw error;
  }
};



const getNearbyPlace = async () => {
  const c = JSON.parse(window.sessionStorage.getItem("loc"));
  try {
    const response = await axios.post(NEARBY_LOCATION_URL, {
      locationRestriction: {
        circle: {
          center: {
            latitude: c.lat,
            longitude: c.lng,
          },
          radius: 10
        }
      }
    }, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching directions:', error);
    throw error;
  }
};

export { getDirections, getNearbyPlace };