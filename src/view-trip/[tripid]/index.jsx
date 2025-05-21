import { db } from '@/service/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-hot-toast';
import InfoSection from './components/InfoSection';
import Hotels from './components/Hotels';
import PlacesToVisit from './components/PlacesToVisit';
import Services from './components/Services';
import Footer from './components/Footer';
import TravelExpertChatbot from './components/TravelExpertChatbot';

function Viewtrip() {
    const {tripId} = useParams();
    const [trip, setTrip] = useState([])
    
    useEffect(() => {
        tripId && GetTripData();
    }, [tripId])

    // Used to get trip information from firebase 
    const GetTripData = async() => {
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            console.log("Document:", docSnap.data());
            setTrip(docSnap.data())
        }
        else{
            console.log("No Such Document");
            toast('No trip found!')
        }
    }
  
    return (
        <div>
            <InfoSection trip={trip} />
            <Hotels trip={trip} />
            <PlacesToVisit trip={trip} />
            <Services trip={trip} />
            <Footer trip={trip}/>
            <TravelExpertChatbot tripData={trip} />
        </div>
    )
}

export default Viewtrip