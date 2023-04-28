import React, { useState } from "react";
import { TwitterPicker } from 'react-color';
import "./Color.css";

function Color(props) {
  function setColor(newColor) {
    console.log(newColor)
    props.setVar(newColor.hex)
  }
  return (
    <TwitterPicker colors={
      ['#000000', '#FFFFFF', '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']
    } onChange={(color, event) => { setColor(color) }}
      hex={props.brushColor}
    />

  );
}

export default Color;
