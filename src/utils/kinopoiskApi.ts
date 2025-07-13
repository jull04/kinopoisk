import axios from "axios";
const API_KEY = 'CK186KA-1GWMJXW-P6NGCW9-1Q4SPTW'; 

export const kinopoiskApi = axios.create({
  baseURL: "https://api.kinopoisk.dev/v1.4/",
  headers: {
    "X-API-KEY": API_KEY,
  },
});