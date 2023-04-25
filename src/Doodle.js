import CanvasDraw from "react-canvas-draw";
import React from 'react'
import './Doodle.css';
import { useRef } from 'react'
import { useEffect, useState } from "react";
import Title from "./Title"
// import modelJSON from "./model/model.json"
import * as tf from '@tensorflow/tfjs';
import { classes } from "./classes";
import { envelopeArr } from "./EnvelopeImgArray2";

// import test from "./envelope.png"

// ok nvm it has to be in an asycn function

// hehe oops


export default function Doodle(props) {
  function clearCanvas() {
    ref.current.eraseAll()
  }
  function undoCanvas() {
    ref.current.undo()
  }

  const [model, setModel] = useState(null)

  const [imgUrl, setImgURL] = useState("")
  const [greyScaleURL, setGreyScaleURL] = useState("")
  // const [classList, setClassList] = useState(classes.split(' ', 100))
  const [classList, setClassList] = useState(classes)
  const [predictedLabel, setPredictedLabel] = useState("")


  async function loadModel() {
    
    console.log("LOADED MODEL")

    const zeros = tf.zeros([1, 28, 28, 1])
    // turn into array
    var arr = await zeros.array()
    console.log(arr)
    const response = await fetch("https://jfabj133hh.execute-api.us-east-2.amazonaws.com/test/sketchmodel", {
      method: "POST",
      body: JSON.stringify({
        data:
          envelopeArr

      }),
      headers: {
        "Content-Type": "text/plain",
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Headers": "*"
        // "Access-Control-Allow-Methods": "*"

      }
    })
    console.log(await response.json())

    // var models = await tf.loadLayersModel("model2/model.json")
    // setModel(models)

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

    // preprocess(imgurl)

    // predictImage(document.getElementById("canv").children[0].children[1])
    // predictImage(document.getElementById("test"))
    // return;
    // const imgThing = await ref.current.get
    setImgURL(imgurl)
    // predictImage(document.getElementById("canv").children[0].children[1]);
    // return

    const img = document.createElement('img');
    img.src = imgurl

    var imgData
    // document.body.appendChild(img)

    img.addEventListener('load', async () => {

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = img.width
      canvas.height = img.height

      // draw a white background
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.drawImage(img, 0, 0, img.width, img.height)

      

      const dpi = window.devicePixelRatio
      // const imgData = canvas.contextContainer.getImageData(0, 0, canvas.width, canvas.height);


      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      var minX = 1000000
      var minY = 1000000
      var maxX = 0
      var maxY = 0

      console.log(imgData)

      


      // for (var y = 0; y < canvas.height; y++) {
      //   for (var x = 0; x < canvas.width; x++) {
      //     var i = (y * 4) * canvas.width + x * 4;
      //     var avg = 255 - (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;

      //     // imgData.data[i] = avg;
      //     // imgData.data[i + 1] = avg;
      //     // imgData.data[i + 2] = avg;
      //     if (avg != 0) {
      //       if (x < minX) {
      //         minX = x
      //       }
      //       if (x > maxX) {
      //         maxX = x
      //       }
      //       if (y < minY) {
      //         minY = y
      //       }
      //       if (y > maxY) {
      //         maxY = y
      //       }
      //     }
      //   }
      // }

      //loop through the pixels, turning the transparent ones white and the others black (0 or 255) 
      for (var i = 0; i < imgData.data.length; i += 4) {
        var avg = 255 - (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
        imgData.data[i] = avg;
        imgData.data[i + 1] = avg;
        imgData.data[i + 2] = avg;
        if (avg != 0) {
          var x = (i / 4) % canvas.width
          var y = Math.floor((i / 4) / canvas.width)
          if (x < minX) {
            minX = x
          }
          if (x > maxX) {
            maxX = x
          }
          if (y < minY) {
            minY = y
          }
          if (y > maxY) {
            maxY = y
          }
        }
      }



      console.log(minX, minY, maxX, maxY)

      ctx.putImageData(imgData, 0, 0, 0, 0, canvas.width, canvas.height)

      imgData = ctx.getImageData(minX * dpi, minY * dpi, (maxX - minX) * dpi, (maxY - minY) * dpi)

      // document.body.appendChild(canvas)

      console.log(imgData)

      preprocess(canvas)

      predictImage(canvas)



      //define width and height of image
      // canvas.width = 28
      // canvas.height = 28

      // ctx.drawImage(img, 0, 0, 28, 28) //draws image of dimensions 28 * 28

      // imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // console.log(imgData)



      // ctx.putImageData(imgData, 0, 0, 0, 0, canvas.width, canvas.height)
      // console.log(ctx.getImageData(0, 0, canvas.width, canvas.height))

      // const url = canvas.toDataURL(0, 0, canvas.width, canvas.height)

      // setGreyScaleURL(url) // here

      // console.log(imgData)



      // // canvas.remove()
      // // img.remove()

    })

    // console.log(greyScaleURL)
    console.log("hit end")

  }

  function predictImage(imgData) {
    const pred = model.predict(preprocess(imgData)).dataSync() // we should display the result on the screen

    // preprocess()
    console.log(pred)

    let max = -100
    let maxIdx = 0

    for (let i = 0; i < pred.length; i++) {
      if (pred[i] > max) {
        max = pred[i]
        maxIdx = i
      }
    }


    console.log(classList[maxIdx])
  }

  function preprocess(imgData) {
    return tf.tidy(async () => {
      //convert to a tensor
      // let tensor = tf.browser.fromPixels(imgData) 
      let tensor = tf.browser.fromPixels(imgData)
      // make all pixels of alpha 0 to 255
      // tensor = tensor.slice([0, 0, 0], [-1, -1, 3])
      // console.log(tensor)


      // convert to 28 * 28
      const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()

      // turn array of 3 arrays into 1 array
      var newArr = tf.mean(resized, 2)
      // convert 28 * 28 to 28 * 28 * 1
      newArr = newArr.expandDims(2)

      const offset = tf.scalar(255.0);

      const normalized = newArr.div(offset);

      tf.browser.toPixels(normalized, document.getElementById("test"))

      const batched = normalized.expandDims(0)


      console.log(batched.shape)
      const zeros = tf.zeros([1, 28, 28, 1])
      console.log(zeros.shape)
      

      var imgArr = await batched.array()

      console.log(imgArr)

      const response = await fetch("https://jfabj133hh.execute-api.us-east-2.amazonaws.com/test/sketchmodel", {
        method: "POST",
        body: JSON.stringify({
          data:
            imgArr

        }),
        headers: {
          "Content-Type": "text/plain",
          // "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Headers": "*"
          // "Access-Control-Allow-Methods": "*"

        }
      })
      const data = await response.json()

      console.log(data.predictions[0])

      let max = -100
      let maxIdx = 0

      for (let i = 0; i < data.predictions[0].length; i++) {
        if (data.predictions[0][i] > max) {
          max = data.predictions[0][i]
          maxIdx = i
        }
      }

      console.log(max + " " + maxIdx)

      console.log(classList[maxIdx])

      setPredictedLabel(classList[maxIdx])
      
    }
    )
  }


  function preprocess2(imgData) {
    return tf.tidy(async () => {
      //convert to a tensor 
      // let tensor = tf.browser.fromPixels(imgData)
      let tensor = tf.browser.fromPixels(document.getElementById("canv").children[0].children[1])
      console.log(tensor)

      // turn 3 channels to 1 channel


      //resize 
      const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()

      const greyScale = resized.mean(2)
      console.log(greyScale.shape)

      //normalize 
      const offset = tf.scalar(255.0);
      const normalized = tf.scalar(1.0).sub(greyScale.div(offset));
      console.log(normalized.shape)

      tf.browser.toPixels(normalized, document.getElementById("test"))

      //We add a dimension to get a batch shape 
      const batched = normalized.expandDims(0)

      var imgArr = await batched.array()

      console.log(imgArr)

      const response = await fetch("https://jfabj133hh.execute-api.us-east-2.amazonaws.com/test/sketchmodel", {
        method: "POST",
        body: JSON.stringify({
          data:
            imgArr

        }),
        headers: {
          "Content-Type": "text/plain",
          // "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Headers": "*"
          // "Access-Control-Allow-Methods": "*"

        }
      })
      const data = await response.json()

      console.log(data.predictions[0])

      let max = -100
      let maxIdx = 0

      for (let i = 0; i < data.predictions[0].length; i++) {
        if (data.predictions[0][i] > max) {
          max = data.predictions[0][i]
          maxIdx = i
        }
      }

      console.log(max + " " + maxIdx)

      console.log(classList[maxIdx])

      setPredictedLabel(classList[maxIdx])

      return batched
    })
  }




  return (
    <div className="canvas" id="canv">
      <CanvasDraw brushColor="#000000" ref={ref} brushRadius={props.brushSize} hideGrid style={{ boxShadow: "0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)" }} />
      
      <button className="clear bg-purple-600" onClick={clearCanvas}>Clear</button>
      &nbsp;&nbsp;&nbsp;
      <button className="undo bg-purple-600" onClick={undoCanvas}>Undo</button>
      &nbsp;&nbsp;&nbsp;
      <button className="bg-purple-600" onClick={getImageData}>Click</button>
      {predictedLabel !== "" && (
        <p>{"Predicted: " + predictedLabel}</p>
      )}
      
      
      {/* <canvas id="test" style={{display: "none"}} />
      <img src={imgUrl} style={{display: "none"}} />
      <img src={greyScaleURL} style={{display: "none"}} /> */}
    </div>
  )
}



