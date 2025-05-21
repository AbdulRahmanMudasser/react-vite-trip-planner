// src/service/AIModel.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 0.7, // Reduced for stricter JSON output
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Trip generation chatSession with Las Vegas history
export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "Generate Travel Plan for Location : Las Vegas, for 3 Days for Couple with a Cheap budget ,Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format." },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `{
  "tripName": "Las Vegas Budget Getaway: 3 Days for Couples",
  "budget": "Cheap/Budget-Friendly",
  "location": "Las Vegas, Nevada",
  "duration": "3 Days",
  "travelers": "Couple",
  "currency": "USD",
  "hotelOptions": [
    {
      "hotelName": "Circus Circus Hotel & Casino",
      "hotelAddress": "2880 S Las Vegas Blvd, Las Vegas, NV 89109",
      "price": "Approximately $30 - $80 per night (depending on season and availability)",
      "hotelImageURL": "https://www.circuscircus.com/wp-content/uploads/2023/08/CCLV-Exterior-1920x1080-min.jpg",
      "geoCoordinates": { "latitude": 36.1260, "longitude": -115.1656 },
      "rating": 3.5,
      "description": "A classic, budget-friendly option on the Strip. Features a circus with free acts, a large amusement park (Adventuredome), and various dining options. Rooms are basic but clean."
    },
    {
      "hotelName": "Stratosphere Hotel, Casino & Tower",
      "hotelAddress": "2000 S Las Vegas Blvd, Las Vegas, NV 89104",
      "price": "Approximately $40 - $90 per night (depending on season and availability)",
      "hotelImageURL": "https://www.thestrat.com/wp-content/uploads/2024/01/STRAT_EXT_Night_1920x1080_1.jpg",
      "geoCoordinates": { "latitude": 36.1474, "longitude": -115.1559 },
      "rating": 3.7,
      "description": "Located at the north end of the Strip, offering great views from the tower. Rooms are decent, and the price is often lower than mid-Strip hotels. Has thrill rides at the top of the tower (extra cost)."
    },
    {
      "hotelName": "Excalibur Hotel & Casino",
      "hotelAddress": "3850 S Las Vegas Blvd, Las Vegas, NV 89109",
      "price": "Approximately $45 - $95 per night (depending on season and availability)",
      "hotelImageURL": "https://www.excalibur.com/content/dam/excalibur/page-headers/exterior/excalibur-hotel-casino-exterior-night-1280x683.adapt.1900.1.jpg",
      "geoCoordinates": { "latitude": 36.0984, "longitude": -115.1744 },
      "rating": 4.0,
      "description": "A medieval-themed hotel with affordable rooms, a good location on the south end of the Strip, and various dining and entertainment options. Connected to Luxor and Mandalay Bay by walkways."
    }
  ],
  "itinerary": {
    "day1": {
      "theme": "South Strip Exploration & Free Attractions",
      "bestTimeToVisit": "Morning & Evening (to avoid midday heat)",
      "activities": [
        {
          "placeName": "Welcome to Las Vegas Sign",
          "placeDetails": "Iconic sign for photo opportunities. Can be crowded, especially during peak hours.",
          "placeImageURL": "https://www.lasvegasnevada.gov/wp-content/uploads/2024/03/Welcome-Sign-Feature-compressed.jpg",
          "geoCoordinates": { "latitude": 36.0829, "longitude": -115.1735 },
          "ticketPricing": "Free",
          "rating": 4.5,
          "travelTimeFromHotel": "Variable, depending on hotel location (10-20 minutes by car/ride-share from Strip hotels)"
        },
        {
          "placeName": "Bellagio Conservatory & Botanical Garden",
          "placeDetails": "Stunning seasonal displays of flowers and plants. Free to enter.",
          "placeImageURL": "https://bellagio.mgmresorts.com/content/dam/MGM/bellagio/entertainment/conservatory-botanical-garden/bellagio-conservatory-chinese-new-year-display-1280x560.adapt.1900.1.jpg",
          "geoCoordinates": { "latitude": 36.1127, "longitude": -115.1744 },
          "ticketPricing": "Free",
          "rating": 4.8,
          "travelTimeFromHotel": "Variable, depending on hotel location (walkable from many Strip hotels)"
        },
        {
          "placeName": "Bellagio Fountains",
          "placeDetails": "Spectacular water show synchronized to music. Runs frequently, especially in the evening.",
          "placeImageURL": "https://bellagio.mgmresorts.com/content/dam/MGM/bellagio/entertainment/fountains-of-bellagio/bellagio-fountains-night-1280x560.adapt.1900.1.jpg",
          "geoCoordinates": { "latitude": 36.1127, "longitude": -115.1744 },
          "ticketPricing": "Free",
          "rating": 4.9,
          "travelTimeFromHotel": "Variable, depending on hotel location (walkable from many Strip hotels)"
        },
        {
          "placeName": "Walk the Las Vegas Strip (South)",
          "placeDetails": "Explore the themed hotels (Luxor, Excalibur, Mandalay Bay), window shop, and soak in the atmosphere. People-watching is a must!",
          "placeImageURL": "https://i.insider.com/60417c0122332b00189f167e?width=700",
          "geoCoordinates": { "latitude": 36.0905, "longitude": -115.1747 },
          "ticketPricing": "Free",
          "rating": 4.5,
          "travelTimeFromHotel": "Variable, depending on hotel location. South end of the strip."
        },
        {
          "placeName": "Luxor Hotel Light Beam",
          "placeDetails": "The strongest beam of light in the world, seen from anywhere in the city!",
          "placeImageURL": "https://a.cdn-hotels.com/gdcs/production180/d1716/9a7a1310-2356-4f35-88e1-d9160d968e03.jpg",
          "geoCoordinates": { "latitude": 36.0955, "longitude": -115.1757 },
          "ticketPricing": "Free",
          "rating": 4.3,
          "travelTimeFromHotel": "Variable, depending on hotel location (walkable from many Strip hotels)"
        }
      ]
    },
    "day2": {
      "theme": "Downtown Las Vegas (Fremont Street) & Budget Eats",
      "bestTimeToVisit": "Evening/Night for Fremont Street Experience",
      "activities": [
        {
          "placeName": "Fremont Street Experience",
          "placeDetails": "A pedestrian mall with a massive LED canopy displaying light shows and music. Free to walk around.",
          "placeImageURL": "https://vegasexperience.com/wp-content/uploads/2017/09/fremont-street-experience-marquee-1280x640.jpg",
          "geoCoordinates": { "latitude": 36.1701, "longitude": -115.1421 },
          "ticketPricing": "Free",
          "rating": 4.7,
          "travelTimeFromHotel": "Variable, depending on hotel location (approx. 20-30 minutes by car/ride-share from the Strip). Consider using the Deuce bus for a cheaper option."
        },
        {
          "placeName": "Downtown Container Park",
          "placeDetails": "Shopping, dining, and entertainment complex built from repurposed shipping containers. Has a playground for kids, but still interesting for adults.",
          "placeImageURL": "https://downtowncontainerpark.com/wp-content/uploads/2023/12/DCP_12-23_Holiday_Lights-147-scaled.jpg",
          "geoCoordinates": { "latitude": 36.1687, "longitude": -115.1400 },
          "ticketPricing": "Free entry (individual vendor prices vary)",
          "rating": 4.3,
          "travelTimeFromHotel": "Walkable from Fremont Street."
        },
        {
          "placeName": "Heart Attack Grill",
          "placeDetails": "Famous (or infamous) restaurant with outrageously unhealthy burgers and a hospital theme. Photo op even if you don't eat there.",
          "placeImageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Heart_Attack_Grill_Las_Vegas_01.jpg/640px-Heart_Attack_Grill_Las_Vegas_01.jpg",
          "geoCoordinates": { "latitude": 36.1708, "longitude": -115.1413 },
          "ticketPricing": "Entrees $15-$30",
          "rating": 3.5,
          "travelTimeFromHotel": "Walkable from Fremont Street."
        },
        {
          "placeName": "Take a picture with Million Dollar Display",
          "placeDetails": "Binion's Gambling Hall showcases $1 million dollars in cash!",
          "placeImageURL": "https://assets.atlasobscura.com/media/W1siZiIsImltYWdlcy81MTA0ODc2MDU0MWQ2ODNmMDYwMGJiNjgvYmluaW9uc18xXzdfbWlsbGlvbl80XzY0MC5qcGciXSxbInAiLCJ0aHVtYiIsIjEyMDB4PiJdLFsicCIsImNvbnZlcnQiLCItc3RyaXAiXSxbInAiLCJvcHRpbWl6ZSJdXQ/binions_1_7_million_4_640.jpg",
          "geoCoordinates": { "latitude": 36.1701, "longitude": -115.1433 },
          "ticketPricing": "Free",
          "rating": 4.5,
          "travelTimeFromHotel": "Walkable from Fremont Street."
        },
        {
          "placeName": "Eat Cheap!",
          "placeDetails": "Find affordable meals at In-N-Out Burger (a bit off-Strip, but worth it for West Coast experience), food courts, or by taking advantage of happy hour deals.",
          "placeImageURL": "https://locations.in-n-out.com/Content/Locations/INOUT_Location_LasVegas_NV_2.jpeg",
          "geoCoordinates": { "latitude": 36.0700, "longitude": -115.1500 },
          "ticketPricing": "Varies (In-N-Out Burgers around $5-8)",
          "rating": 4.6,
          "travelTimeFromHotel": "Variable, depending on chosen restaurant."
        }
      ]
    },
    "day3": {
      "theme": "Mid-Strip Sightseeing & Ethel M Chocolate Factory",
      "bestTimeToVisit": "Morning/Afternoon",
      "activities": [
        {
          "placeName": "The LINQ Promenade & High Roller Observation Wheel (Optional)",
          "placeDetails": "Outdoor shopping, dining, and entertainment area. The High Roller offers amazing views but is a paid attraction. Walk around the Promenade for free.",
          "placeImageURL": "https://www.caesars.com/content/dam/clv/Venues/Entertainment/High-Roller/clv-entertainment-highroller-exterior-night-1920x672.jpg",
          "geoCoordinates": { "latitude": 36.1162, "longitude": -115.1705 },
          "ticketPricing": "High Roller: $25-$40 (depending on time of day); Promenade: Free to walk around",
          "rating": 4.4,
          "travelTimeFromHotel": "Variable, depending on hotel location (walkable from many Strip hotels)"
        },
        {
          "placeName": "Mirage Volcano",
          "placeDetails": "Free volcano show in front of the Mirage Hotel. Erupts several times nightly.",
          "placeImageURL": "https://www.casino.org/news/wp-content/uploads/2023/11/mirage-volcano-show-las-vegas-1.jpg",
          "geoCoordinates": { "latitude": 36.1212, "longitude": -115.1751 },
          "ticketPricing": "Free",
          "rating": 4.6,
          "travelTimeFromHotel": "Variable, depending on hotel location (walkable from many Strip hotels)"
        },
        {
          "placeName": "Ethel M Chocolate Factory & Cactus Garden",
          "placeDetails": "Free tour of the chocolate factory and a beautiful cactus garden to explore. Located a bit outside the Strip, requires transportation.",
          "placeImageURL": "https://cdn.dtknow.com/uploads/stores/img/543/detail_images/1709496175Ethel-M-Chocolates_Garden-web.jpg",
          "geoCoordinates": { "latitude": 36.0593, "longitude": -115.0630 },
          "ticketPricing": "Free (chocolate tasting might have a small fee)",
          "rating": 4.7,
          "travelTimeFromHotel": "Variable, depending on hotel location (approx. 20-30 minutes by car/ride-share from the Strip)"
        },
        {
          "placeName": "People watching on Strip",
          "placeDetails": "Enjoying the vibe of las vegas strip",
          "placeImageURL": "https://www.travelandleisure.com/thmb/4Y6q6-H-qKAf4G0p7d3tA4q_sA4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/las-vegas-strip-walking-VEGAS0617-f8c2e1d516b24632b39c563f60cd6137.jpg",
          "geoCoordinates": { "latitude": 36.1146, "longitude": -115.1728 },
          "ticketPricing": "Free",
          "rating": 4.7,
          "travelTimeFromHotel": "From hotel Location"
        }
      ]
    }
  },
  "notes": [
    "Prices are estimates and can vary significantly depending on the time of year, day of the week, and availability.",
    "Consider purchasing a day pass for the Deuce bus for affordable transportation on the Strip and Downtown.",
    "Take advantage of free activities like walking the Strip, watching the Bellagio fountains, and visiting the Bellagio Conservatory.",
    "Look for happy hour deals and affordable dining options to save money on food.",
    "Wear comfortable shoes, as you'll be doing a lot of walking.",
    "Stay hydrated, especially during the hot summer months.",
    "Be aware of your surroundings and take precautions against pickpockets.",
    "Most importantly, have fun!"
  ]
}` },
      ],
    },
  ],
});

// Ride generation chatSession (no history to avoid Las Vegas bias)
export const rideChatSession = model.startChat({
  generationConfig,
  history: [], // Empty history for ride queries
});