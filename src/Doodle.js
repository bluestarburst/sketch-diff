import CanvasDraw from "react-canvas-draw";
import './Doodle.css';
import {useRef} from 'react'
import { useEffect, useState } from "react";
import Title from "./Title"

export default function Doodle() {

  const [imgUrl, setImgURL] = useState("")

  useEffect(() => {
    document.title = "Team Name";  
  }, [imgUrl]);



  const ref = useRef(null)

  const getImageData = () => {
    console.log(ref.current.getSaveData())
    console.log(ref.current.getDataURL())
    setImgURL(ref.current.getDataURL())
  }

  return (
    <div className="canvas">

        <CanvasDraw ref={ref} style={{ boxShadow: "0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)" }} />
        <button className="" onClick={getImageData}>Click</button>
        <img src={imgUrl}/>
    </div>
  )
}

