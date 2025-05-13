import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Hero from './components/custom/Hero'
import Header from './components/custom/Header'
import AboutUs from './components/custom/about-us'
import TripPlannerSection from './components/custom/whychoseus'
import WhatWeOfferSection from './components/custom/whatwedo'
import ContactUs from './components/custom/contactus'
import Footer from './components/custom/footer'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{width:'100%'}}>
    <Header/>
      <Hero></Hero>
      <WhatWeOfferSection/>
      <TripPlannerSection/>
      <AboutUs/>
      <ContactUs/>
      <Footer/>

    </div>
  )
}

export default App
