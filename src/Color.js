import React, { useState } from "react";
import { TwitterPicker} from 'react-color';
import "./Color.css";

function Color(props) {
  function setColor(newColor) {
    console.log(newColor)
      props.setVar(newColor.hex)
  }
       return(
       <TwitterPicker onChange={(color, event) => {setColor(color)}} />
       
       );
}

export default Color;
