import React, { useEffect} from "react";
import dd from "./dd.png";
import "./Title.css";
export default function TitleMake() {

   useEffect(() => {
     document.title = "Doodly Doo";  
   }, []);

   return (
     <div className="Title">
       {/* <h1>Doodly Doo</h1> */}
        <img src= {dd} className="title_image" alt="dd"/>
        <h2 className="subtitle">You Draw, We Paint</h2>
     </div>
    
   );
}