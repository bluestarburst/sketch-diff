import CanvasDraw from "react-canvas-draw";
import React from 'react'
import './Doodle.css';
import { useRef } from 'react'
import { useEffect, useState } from "react";
import Title from "./Title"

import * as tf from '@tensorflow/tfjs';

export default function Doodle() {

  

  const [imgUrl, setImgURL] = useState("")
  const [greyScaleURL, setGreyScaleURL] = useState("")

  useEffect(() => {
    document.title = "Team Name";
  }, [imgUrl, greyScaleURL]);




  const ref = useRef(null)
  const canvasRef = useRef(null)

  const getImageData = async () => {

    const imgurl = await ref.current.getDataURL()
    setImgURL(imgurl)

    const img = document.createElement('img');
    img.src = imgurl

    var imgData

    img.addEventListener('load', () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = 28
      canvas.height = 28

      ctx.drawImage(img, 0, 0, 28, 28)

      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      console.log(imgData)

      for(var y = 0; y < canvas.height; y++){
        for(var x = 0; x < canvas.width; x++){
            var i = (y * 4) * canvas.width + x * 4;
            var avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
            imgData.data[i] = avg;
            imgData.data[i + 1] = avg;
            imgData.data[i + 2] = avg;
        }
      }

      ctx.putImageData(imgData, 0, 0, 0, 0, canvas.width, canvas.height)
      console.log(ctx.getImageData(0, 0, canvas.width, canvas.height))

      const url = canvas.toDataURL(0, 0, canvas.width, canvas.height)

      setGreyScaleURL(url) // here

      canvas.remove()
      img.remove()

    })

    const model = await tf.loadLayersModel('../model/model.json')

    console.log("asdasd")

    const pred = model.predict(preprocess(imgData)).dataSync()
    console.log(pred)

    console.log(greyScaleURL)
    console.log("hit end")

  }

  const preprocess = (imgData) => {
    return tf.tidy(()=>{
      //convert the image data to a tensor 
      let tensor = tf.browser.fromPixels(imgData, 1)
      //resize to 28 x 28 
      const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()
      // Normalize the image 
      const offset = tf.scalar(255.0);
      const normalized = tf.scalar(1.0).sub(resized.div(offset));
      //We add a dimension to get a batch shape 
      const batched = normalized.expandDims(0)
      return batched
    })
  }



  return (
    <div className="canvas">
      <CanvasDraw brushColor="#600" ref={ref} hideGrid style={{ boxShadow: "0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)"}} />
      <button className="" onClick={getImageData}>Click</button>
      <img src={imgUrl} />
      <img src={greyScaleURL} />

    </div>
    
  )
}


