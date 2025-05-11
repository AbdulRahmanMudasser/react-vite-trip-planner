 import axios from "axios";

 const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
 const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_KEY;

 const config = {
     headers: {
         "Content-Type": "application/json",
         "X-Goog-Api-Key": API_KEY,
         "X-Goog-FieldMask": "places.displayName,places.photos,places.id,places.formattedAddress,places.types",
     },
 };

 export const GetPlaceDetails = (data) => {
     if (!data.textQuery) {
         return Promise.reject(new Error("Invalid request: textQuery is required"));
     }
     return axios.post(BASE_URL, data, config);
 };

 export const PHOTO_REF_URL='https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_KEY