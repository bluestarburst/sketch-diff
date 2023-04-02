import React, { useState } from "react";

function size() {
    alert('Size changed');
}

function UI(props) {
    // const useState =
    const [brushSize, setVar] = useState(1);

    return (
        <div className="UI">
            <button className="brush-size" onClick={size}>Change size</button>
        </div>
    );
}

export default UI;