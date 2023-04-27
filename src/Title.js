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
                "sketches", "insects", "houses", "faces", "animals", "stars", "food", "cars", "buildings", "rainbows", "the sun", "rain", "hearts", "skeletons","books",
                "fashion", "nature", "cities"
            ]}
               
            typeSpeed = {100}
            loop
/>
      </div>
        {/* <img src= {dd} className="title_image" alt="dd"/> */}

     </div>
    
   );
}

