import React, { useEffect} from "react";
import Typed from "react-typed";
import "./TypeWrite.css";


export function TypeWrite1() {
 
    return (
      
    <div>
      <div className="Directions">
        <h2><u>Directions:</u></h2>
      </div>
      <div className="Typed">

    <Typed
            strings={[
                "Step 1: Choose the brush size you desire."
            ]}
               
            typeSpeed = {200}
/>
      </div>
     
    </div>
      
    );
 }

 export function TypeWrite2() {
 
    return (
      <div className="Typed">
 
 <Typed
            strings={[
                "Step 2: Draw whatever you like with whatever colors you want."
            ]}
               
            typeSpeed = {200}
/>
      </div>
     
    );
 }

 export function TypeWrite3() {
 
  return (
    <div className="Typed">
<Typed
            strings={[
                "Step 3: Click on the click button when done."
            ]}
               
            typeSpeed = {200}
/>
    </div>
   
  );
}

export function TypeWrite4() {
 
  return (
    <div className="Typed">

<Typed
            strings={[
                "Step 4: View your AI-generated painting!"
            ]}
               
            typeSpeed = {200}
/>  
    </div>
   
  );
}