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

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';

import Chart from 'chart.js/auto';
import { Bar } from "react-chartjs-2";

var bMobile =   // will be true if running on a mobile device
  navigator.userAgent.indexOf("Mobile") !== -1 ||
  navigator.userAgent.indexOf("iPhone") !== -1 ||
  navigator.userAgent.indexOf("Android") !== -1 ||
  navigator.userAgent.indexOf("Windows Phone") !== -1;

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

  const [diffusedImage, setDiffusedImage] = useState(null)
  const [diffusedImage2, setDiffusedImage2] = useState(null)

  const [model, setModel] = useState(null)

  const [imgUrl, setImgURL] = useState("")
  const [imgUrl2, setImgURL2] = useState("")
  const [greyScaleURL, setGreyScaleURL] = useState("")
  // const [classList, setClassList] = useState(classes.split(' ', 100))
  const [classList, setClassList] = useState(classes)
  const [predictedLabel, setPredictedLabel] = useState("")

  const [topPredictionValues, setTopPredictionValues] = useState([])
  const [topPredictionLabels, setTopPredictionLabels] = useState([])
  const [chartData, setChartData] = useState(undefined)


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
    document.title = "Paintify";
  }, [imgUrl, greyScaleURL]);


  const ref = useRef(null)

  const getImageData = async () => {

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const imgurl = await ref.current.getDataURL()

    // get image uri without data:image/png;base64,
    // const imgblob = imgurl.split(',')[1]

    // console.log(imgblob)

    // var request = {
    //   "inputs": ("basketball, highres, high quality, best resolution"),
    //   "image": imgblob,
    //   "negative_prompt": "lowres, bad anatomy, worst quality, low quality, city, traffic",
    //   "controlnet_type": "scribble"
    // }

    // const responseDiffusion = await fetch("https://dw8hrfe3u0z4cghk.us-east-1.aws.endpoints.huggingface.cloud", {
    //   method: "POST",
    //   body: JSON.stringify(request),
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Accept": "image/png",
    //   }
    // })


    // // read image data from response
    // const data2 = await responseDiffusion.blob()
    // console.log("RESULTs")
    // console.log(data2)

    // // convert image data to URL
    // const url = URL.createObjectURL(data2)
    // console.log(url)
    // setDiffusedImage(url)




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

      const imgurl2 = await canvas.toDataURL("image/png")
      console.log(imgurl2)
      setImgURL2(imgurl2)



      const dpi = window.devicePixelRatio
      // const imgData = canvas.contextContainer.getImageData(0, 0, canvas.width, canvas.height);


      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      var minX = 1000000
      var minY = 1000000
      var maxX = 0
      var maxY = 0

      console.log(imgData)


      //loop through the pixels, turning the transparent ones white and the others black (0 or 255) 
      for (var i = 0; i < imgData.data.length; i += 4) {
        var avg = 255 - (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
        imgData.data[i] = avg;
        imgData.data[i + 1] = avg;
        imgData.data[i + 2] = avg;
        if (avg != 0) {
          if (avg < 235) {
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
          }
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

      // imgData = ctx.getImageData(minX * dpi, minY * dpi, (maxX - minX) * dpi, (maxY - minY) * dpi)

      // document.body.appendChild(canvas)

      console.log(imgData)

      preprocess(canvas, imgurl, imgurl2)

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

  const [newPromptWord, setNewPromptWord] = useState("")
  const [newPrompt, setNewPrompt] = useState("best quality, extremely detailed, accurate")
  const [newNegativePrompt, setNewNegativePrompt] = useState("longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality")

  function preprocess(imgData, imgurl, imgurl2) {
    return tf.tidy(async () => {

      //convert to a tensor
      // let tensor = tf.browser.fromPixels(imgData) 
      let tensor = tf.browser.fromPixels(imgData)

      // delete canvas element
      imgData.remove()

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

      var topValues = [...data.predictions[0]]
      var topValues = topValues.sort((a, b) => b - a).slice(0, 5);
      console.log(data.predictions[0])
      var topLabels = []


      for (let i = 0; i < 5; i++) {
        topLabels.push(classList[data.predictions[0].indexOf(topValues[i])]);
      }
      console.log(topValues)
      console.log(topLabels)

      setTopPredictionValues(topValues)
      setTopPredictionLabels(topLabels)

      const newChartData = {
        labels: topLabels,
        datasets: [{
          label: "confidence level",
          backgroundColor: "rgb(65,105,225)",
          borderColor: "rgb(65,105,225)",
          data: topValues
        }]
      }

      setChartData(newChartData)

      console.log(chartData)

      console.log(max + " " + maxIdx)

      console.log(classList[maxIdx])
      var tempPrompt = classList[maxIdx]
      setPredictedLabel(classList[maxIdx])
      if (isOverriding) {
        // setNewPromptWord(newPromptWord)
        tempPrompt = newPromptWord
      }

      const imgblob = imgurl2.split(',')[1] // POTENTIAL FIX

      // START TEST

      asyncGhibli(tempPrompt, imgurl2)

      // END TEST

      console.log("start")

      var request = {
        "inputs": (tempPrompt + ", " + newPrompt),
        "image": imgblob,
        "negative_prompt": newNegativePrompt,
        "controlnet_type": "scribble",
        "guidance_scale": 25,
        "num_inference_steps": 30,
      }


      const responseDiffusion = await fetch("https://dw8hrfe3u0z4cghk.us-east-1.aws.endpoints.huggingface.cloud", {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
          "Accept": "image/png",

        }
      })

      // read image data from response
      const data2 = await responseDiffusion.blob()
      setIsLoading(false);
      console.log("RESULTs")
      console.log(data2)

      // convert image data to URL
      const url = URL.createObjectURL(data2)
      console.log(url)
      setDiffusedImage(url)

      console.log("end")

    }
    )
  }

  function onChangeInput(e) {
    setNewPromptWord(e.target.value);
  }

  async function asyncGhibli(tempPrompt, imgurl2) {
    const imgblob3 = imgurl2.split(',')[1]

    var request3 = {
      "inputs": ("a ghibli " + tempPrompt + " beautiful, high quality, colorful background, best resolution"),
      "image": imgblob3,
      "strength": 0.85,
      "guidance_scale": 7.5,
      "negative_prompt": newNegativePrompt + ", lowres, bad anatomy, worst quality, low quality, city, traffic, nsfw",
    }

    const responseDiffusion3 = await fetch("https://dtl65q7r3afsqrlw.us-east-1.aws.endpoints.huggingface.cloud", {
      method: "POST",
      body: JSON.stringify(request3),
      headers: {
        "Content-Type": "application/json",
        "Accept": "image/png",

      }
    })

    // read image data from response
    const data3 = await responseDiffusion3.blob()
    setIsLoading(false);
    console.log("RESULTs")
    console.log(data3)

    // convert image data to URL
    const url3 = URL.createObjectURL(data3)
    console.log(url3)
    setDiffusedImage2(url3)
  }



  const [isOverriding, setIsOverriding] = useState(false)

  const [isLoading, setIsLoading] = useState(false);

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




      return batched
    })
  }

  useEffect(() => {
    console.log("BRUSH COLOR", props.brushColor);
  }, [props.brushColor]);
  return (
    <div className="canvas" id="canv">
      <CanvasDraw className="canvas-real" brushColor={props.brushColor} ref={ref} brushRadius={props.brushSize} hideGrid style={{ boxShadow: "0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)", width: "600px", height: "600px" }} />

      <div>
        <Button variant="contained" color="primary" onClick={clearCanvas}>Clear</Button>
        {/* <button className="clear bg-purple-600" onClick={clearCanvas}>Clear</button> */}
        {/* &nbsp;&nbsp;&nbsp; */}
        {/* <button className="undo bg-purple-600" onClick={undoCanvas}>Undo</button> */}
        <Button variant="contained" color="primary" onClick={undoCanvas}>Undo</Button>
        {/* &nbsp;&nbsp;&nbsp; */}

        {/* <button className="bg-purple-600" onClick={getImageData}>Click</button> */}
        <Button variant="contained" color="primary" onClick={getImageData}>Submit</Button>
      </div>
      {/* <br /> */}

      <div className="rows-real">
        <TextField id="outlined-basic" label="Override Prompt" variant="outlined" disabled={!isOverriding} value={newPromptWord} onChange={onChangeInput} />
        <Switch label="Override Prediction" onChange={(e) => {
          setIsOverriding(e.target.checked)
          console.log(isOverriding)
        }} />
      </div>

      <div className="gap">
        <TextField id="outlined-basic" label="Override Prompt" variant="outlined" value={newPrompt} onChange={(e) => {
          setNewPrompt(e.target.value)
          console.log(newPrompt)
        }} />
        <TextField id="outlined-basic" label="Override Prompt" variant="outlined" value={newNegativePrompt} onChange={(e) => {
          setNewNegativePrompt(e.target.value)
          console.log(newNegativePrompt)
        }} />
      </div>

      {predictedLabel !== "" && (
        <p style={{ color: "black" }}>{"Predicted: " + predictedLabel}</p>
      )}

      {/* {<img src={`https://quickchart.io/chart?c=${{type: 'bar', data: {labels: ${JSON.stringify(labels)}, datasets: ${JSON.stringify(datasets)}}}}`} />} */}

      {chartData && (
        <Bar data={chartData} options={{ duration: 2000, easing: 'easeOutQuart', scales: { x: { ticks: { font: { weight: 'bold', size: 25 }, }, }, y: { ticks: { font: { weight: 'bold', size: 25 }, }, }, }, }} />
      )}


      <div>
        {isLoading ? <CircularProgress /> : null}
      </div>

      
      {diffusedImage ? <img src={diffusedImage} className="inside-img" /> : null}
      {diffusedImage2 ? <img src={diffusedImage2} className="inside-img" /> : null}

      {/* {<Button variant="contained" size="small" color="secondary">test</Button>} */}

      {/* <img src={imgUrl} /> */}


      {/* <canvas id="test" style={{display: "none"}} />
      
      <img src={greyScaleURL} style={{display: "none"}} /> */}



      {/* <div className="canvas">
      <CanvasDraw brushColor={props.brushColor} ref={ref} brushRadius={props.brushSize} hideGrid style={{ boxShadow: "0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)"}} />
     <div className="canvas_buttons">
          <button className= "undo" onClick={undoCanvas}>Undo</button>
          <button className= "clear" onClick={clearCanvas}>Clear</button>
          <button className="clicky" onClick={getImageData}>Click</button>
     </div>    
      <img src={imgUrl} />
      <img src={greyScaleURL} /> */}
    </div>
  )
}
