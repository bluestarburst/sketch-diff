import React, { useState } from "react";
import circ from "./White_circ.png";
import "./UI.css";

function UI(props) {
    function size(newSize) {
        props.setVar(newSize)
    }

    return (
        <div className="UI">
            {/* <button> className="brush-size bg-red-600" onClick={() => {size(2)}}Size 1</button>
            &nbsp;&nbsp;&nbsp;
            <button>className="brush-size bg-orange-700" onClick={() => {size(5)}}Size 2</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-yellow-700" onClick={() => {size(8)}}>Size 3</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-green-700" onClick={() => {size(11)}}>Size 4</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-blue-700" onClick={() => {size(14)}}>Size 5</button> */}

            <div className= "circle_class">

            <img src={circ}className="one_brush" onClick={() => {size(2)}} alt="size1" />;
            <img src={circ}className="two_brush" onClick={() => {size(5)}} alt="size2" />;
            <img src={circ}className="three_brush" onClick={() => {size(8)}} alt="size3" />;
            <img src={circ}className="four_brush" onClick={() => {size(11)}} alt="size4" />;
            <img src={circ}className="five_brush" onClick={() => {size(14)}} alt="size5" />;
            </div>
                 
{/* 
            <button className="brush-size bg-red-600" onClick={() => {size(2)}}>Size 1</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-orange-700" onClick={() => {size(5)}}>Size 2</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-yellow-700" onClick={() => {size(8)}}>Size 3</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-green-700" onClick={() => {size(11)}}>Size 4</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-blue-700" onClick={() => {size(14)}}>Size 5</button> */}
        </div>
    );
}

export default UI;