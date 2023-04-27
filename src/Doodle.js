import CanvasDraw from "react-canvas-draw";
import React from 'react'
import './Doodle.css';
import { useRef } from 'react'
import { useEffect, useState } from "react";
import Title from "./Title"
// import modelJSON from "./model/model.json"
import * as tf from '@tensorflow/tfjs';
import { classes } from "./classes";

// ok nvm it has to be in an asycn function

// hehe oops


export default function Doodle(props) {
  function clearCanvas(){
    ref.current.eraseAll()
  }
  function undoCanvas(){
    ref.current.undo()
  }

  var model

  const [imgUrl, setImgURL] = useState("")
  const [greyScaleURL, setGreyScaleURL] = useState("")
  const [classList, setClassList] = useState(classes.split(' ', 100))


  async function loadModel() {
    model = await tf.loadLayersModel("model/model.json")
  }

  useEffect(() => {
    loadModel() // noice
  }, [])

  useEffect(() => {
    document.title = "Team Name";
  }, [imgUrl, greyScaleURL]);


  const ref = useRef(null)

  const getImageData = async () => {

    const imgurl = await ref.current.getDataURL()
    const imgThing = await ref.current.get
    setImgURL(imgurl)

    const img = document.createElement('img');
    img.src = imgurl

    var imgData

    img.addEventListener('load', async () => {
      model = await tf.loadLayersModel("model/model.json")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = img.width
      canvas.height = img.height

      ctx.drawImage(img, 0, 0, img.width, img.height)

      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      //define width and height of image
      // canvas.width = 28
      // canvas.height = 28

      // ctx.drawImage(img, 0, 0, 28, 28) //draws image of dimensions 28 * 28

      // imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // console.log(imgData)

      // for (var y = 0; y < canvas.height; y++) {
      //   for (var x = 0; x < canvas.width; x++) {
      //     var i = (y * 4) * canvas.width + x * 4;
      //     var avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
          
      //     imgData.data[i] = avg;
      //     imgData.data[i + 1] = avg;
      //     imgData.data[i + 2] = avg;
      //   }
      // }

      // ctx.putImageData(imgData, 0, 0, 0, 0, canvas.width, canvas.height)
      // console.log(ctx.getImageData(0, 0, canvas.width, canvas.height))

      // const url = canvas.toDataURL(0, 0, canvas.width, canvas.height)

      // setGreyScaleURL(url) // here

      // console.log(imgData)


      const pred = model.predict(preprocess(imgData)).dataSync() // we should display the result on the screen
      console.log(pred)
      
      let max = 0.0
      let maxIdx = 0

      for (let i = 0; i < pred.length; i++){
        if (pred[i]  > max){
          max = pred[i]
          maxIdx = i
        }
      }
      
      
      console.log(classList[maxIdx])
      canvas.remove()
      img.remove()

    })

    console.log(greyScaleURL)
    console.log("hit end")

  }

  function preprocess(imgData) {
    return tf.tidy(() => {
      console.log("preprocess")
      console.log(imgData);

      //convert the image data to a tensor 
      let tensor = tf.browser.fromPixels(imgData, 1)
      //resize to 28 x 28 
      const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()
      console.log(resized)
      // Normalize the image 
      const offset = tf.scalar(255.0);
      console.log(offset)
      const normalized = tf.scalar(1.0).sub(resized.div(offset));
      console.log(normalized)
      //We add a dimension to get a batch shape 
      
      const batched = normalized.expandDims(0)
      console.log(batched)
      return batched
    })
  }


  return (
    <div className="canvas">
      <CanvasDraw brushColor="#600" ref={ref} brushRadius={props.brushSize} hideGrid style={{ boxShadow: "0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)"}} />
     <div className="canvas_buttons">
          <button className= "undo" onClick={undoCanvas}>Undo</button>
          <button className= "clear" onClick={clearCanvas}>Clear</button>
          <button className="clicky" onClick={getImageData}>Click</button>
     </div>    
      <img src={imgUrl} />
      <img src={greyScaleURL} />
    </div>
  )
}
