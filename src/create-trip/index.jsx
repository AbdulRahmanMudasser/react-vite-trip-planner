import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectBudgetOptions, SelectTravelsList, AI_Prompt } from "@/constants/options";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModel";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function CreateTrip() {
  // Step 1: Add numberOfPeople to formData state
  const [formData, setFormData] = useState({
    departureLocation: null,
    destination: null,
    days: "",
    budget: "",
    companion: "",
    numberOfPeople: "", // New field for number of people
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Optimized Input Handler (already generic, works for numberOfPeople)
  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Google Login Function (unchanged)
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Login Success:", tokenResponse);
      await GetUserProfile(tokenResponse);
    },
    onError: (error) => console.log("Login Error:", error),
  });

  // Step 2: Update onGenerateTrip to include numberOfPeople in validation and prompt
  const onGenerateTrip = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User Data from Local Storage:", user);

    if (!user) {
      console.log("User not logged in! Opening sign-in dialog...");
      setOpenDialog(true);
      return;
    }

    const { departureLocation, destination, days, budget, companion, numberOfPeople } = formData;
    // Updated validation to include numberOfPeople
    if (!departureLocation || !destination || !days || !budget || !companion || !numberOfPeople) {
      toast("Please fill in all fields before generating the trip.");
      return;
    }

    if (parseInt(days) > 7) {
      toast("The number of days exceeds the allowed limit (7 days).");
      return;
    }

    setLoading(true);
    // Updated AI prompt replacement to include numberOfPeople
    const final_prompt = AI_Prompt.replace("{destination}", destination.label)
      .replace("{days}", days)
      .replace("{numberOfPeople}", numberOfPeople) // New replacement
      .replace("{companion}", companion)
      .replace("{budget}", budget);

    console.log("Sending AI Prompt:", final_prompt);

    try {
      const result = await chatSession.sendMessage(final_prompt);
      console.log("AI Response:", result?.response?.text());
      await SaveAiTrip(result?.response?.text());
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Ensure numberOfPeople is saved in Firebase (already included via spread)
  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: {
        ...formData,
        departureLocation: formData.departureLocation?.label,
        destination: formData.destination?.label,
        // numberOfPeople is included via ...formData
      },
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId,
    });
    setLoading(false);
    toast("Trip saved successfully!");
    navigate(`/view-trip/${docId}`);
  };

  // Fetch User Profile after Login (unchanged)
  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
      onGenerateTrip();
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-15 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕️🌴</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        {/* Departure Location */}
        <div>
          <h2 className="text-xl my-3 font-medium">Where are you departing from?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_KEY}
            selectProps={{
              value: formData.departureLocation,
              onChange: (place) => handleInputChange("departureLocation", place),
              isClearable: true,
              placeholder: "Enter departure location...",
            }}
            options={{
              types: ["geocode"],
              componentRestrictions: { country: "US" },
            }}
          />
        </div>

        {/* Destination */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_KEY}
            selectProps={{
              value: formData.destination,
              onChange: (place) => handleInputChange("destination", place),
              isClearable: true,
              placeholder: "Enter destination...",
            }}
            options={{
              types: ["geocode"],
              componentRestrictions: { country: "US" },
            }}
          />
        </div>

        {/* Number of Days */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
          <Input
            type="number"
            placeholder="Ex. 3"
            value={formData.days}
            onChange={(e) => handleInputChange("days", e.target.value)}
          />
        </div>

        {/* Step 4: Add Number of People input field */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many people are traveling?</h2>
          <Input
            type="number"
            placeholder="Ex. 2"
            min="1" // Ensures a positive number
            value={formData.numberOfPeople}
            onChange={(e) => handleInputChange("numberOfPeople", e.target.value)}
          />
        </div>

        {/* Budget */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                className={`p-4 border cursor-pointer rounded-lg ${formData.budget === item.title ? "shadow-2xl border-black" : ""
                  }`}
                onClick={() => handleInputChange("budget", item.title)}
              >
                <h2 className="text-3xl">{item.icon}</h2>
                <h2 className="font-serif text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Companion */}
        <div>
          <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelsList.map((item, index) => (
              <div
                key={index}
                className={`p-4 border cursor-pointer rounded-lg ${formData.companion === item.title ? "shadow-2xl border-black" : ""
                  }`}
                onClick={() => handleInputChange("companion", item.title)}
              >
                <h2 className="text-3xl">{item.icon}</h2>
                <h2 className="font-serif text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="my-10 flex justify-end">
        <Button disabled={loading} onClick={onGenerateTrip}>
          {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : "Generate Trip"}
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={(val) => setOpenDialog(val)}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div className="flex font-bold text-lg">
                <img src="/logo.svg" alt="Logo" />
                <h2>Trip Planner</h2>
              </div>
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the App with Google authentication</p>
              <Button onClick={login} className="w-full mt-5 gap-4 items-center">
                <FcGoogle />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;