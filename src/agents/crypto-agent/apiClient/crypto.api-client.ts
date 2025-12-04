import axios from 'axios';

export const cryptoApiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/',
  headers: { 'x-cg-demo-api-key': process.env.COING_GEEKO_API_KEY },
});
