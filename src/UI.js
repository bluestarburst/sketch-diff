import React, { useState } from "react";

function UI(props) {
    function size(newSize) {
        props.setVar(newSize)
    }

    return (
        <div className="UI">
            <button className="brush-size" color="red" onClick={() => {size(2)}}>[Size 1] | </button>
            <button className="brush-size" color="orange" onClick={() => {size(5)}}>[Size 2] | </button>
            <button className="brush-size" color="yellow" onClick={() => {size(8)}}>[Size 3] | </button>
            <button className="brush-size" color="green" onClick={() => {size(11)}}>[Size 4] | </button>
            <button className="brush-size" color="blue" onClick={() => {size(14)}}>[Size 5]</button>
        </div>
    );
}

export default UI;