import React, { useState } from "react";

function UI(props) {
    function size(newSize) {
        props.setVar(newSize)
    }

    return (
        <div className="UI">
            <button className="brush-size bg-red-900" onClick={() => {size(2)}}>Size 1</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-orange-700" onClick={() => {size(5)}}>Size 2</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-yellow-700" onClick={() => {size(8)}}>Size 3</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-green-700" onClick={() => {size(11)}}>Size 4</button>
            &nbsp;&nbsp;&nbsp;
            <button className="brush-size bg-blue-700" onClick={() => {size(14)}}>Size 5</button>
        </div>
    );
}

export default UI;