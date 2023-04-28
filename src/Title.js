import React, { useEffect} from "react";
// import dd from "./dd.png";
import "./Title.css";
import WebFont from 'webfontloader';
import Typed from "react-typed";

export default function TitleMake() {

  document.title = "Paintify";
   useEffect(() => {
    WebFont.load({ 
      google: {
        families: ['Rubik Spray Paint', 'Delicious Handrawn']}
    });
   }, []);
   return (
     <div className="font-loader">
       <h1>Paintify</h1>
       <div className="sub">
        <Typed
            strings={[
              "drums","the sun","anvils","baseball bats","eyeglasses","grapes","books","wheels","shovels","bread","tables","clouds","chairs","headphones","faces","eyes","airplanes","snakes","lollipops","power outlets","pants","mushrooms","stars","pillows","scissors","t-shirts","teeth","alarm clocks","paper clips","spoons","microphones","candles","pencils","envelopes","helmets","bridges","light bulbs","keys","donuts","birds","circles","beards","coffee cups","butterflies","benches","rifles","cats","socks","ice cream","moustaches","suitcases","hammers","rainbows","knives","cookies","baseballs"
            ]}
               
            typeSpeed = {100}
            loop
/>
      </div>
        {/* <img src= {dd} className="title_image" alt="dd"/> */}

     </div>
    
   );
}

