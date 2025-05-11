import { db } from '@/service/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import InfoSection from './components/InfoSection';
import Hotels from './components/Hotels';
import PlacesToVisit from './components/PlacesToVisit';
import Footer from './components/Footer';

function Viewtrip() {

    const {tripId} = useParams();
    const [trip, setTrip] = useState([])
    useEffect(()=>{
        tripId&&GetTripData();
    },[tripId])

    // Used to get trip information from firebase 

    const GetTripData = async() => {
        const docRef = doc(db, 'AITrips', tripId );
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            console.log("Document:",docSnap.data());
            setTrip(docSnap.data())
        }
        else{
            console.log("No Such Document");
            toast('No trip FOund!')
        }
    }
  
    return (
    <div>
        <InfoSection trip={trip} />
        <Hotels trip={trip} />
        <PlacesToVisit trip={trip} />
        <Footer trip={trip}/>
    </div>
    
  )
}

export default Viewtrip