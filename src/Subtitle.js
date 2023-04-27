import React, { useEffect} from "react";
// import dd from "./dd.png";
import "./Subtitle.css";
import WebFont from 'webfontloader';

export default function TitleMake() {

  document.title = "Paintify";
   useEffect(() => {
    WebFont.load({ 
      google: {
        families: ['Delicious Handrawn']}
    });
   }, []);
   return (
     <div className="sub">
       <h1>Paintify AI</h1>
        {/* <img src= {dd} className="title_image" alt="dd"/> */}

     </div>
       );
    }
    