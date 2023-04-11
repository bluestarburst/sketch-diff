import React from 'react'
import './Doodle.css';
import { useRef } from 'react'
import { useEffect, useState } from "react";
import Title from "./Title"
// import modelJSON from "./model/model.json"
import * as tf from '@tensorflow/tfjs';
import { classes } from "./classes2";
import { fabric } from './fabric.js';

// import test from "./envelope.png"

// ok nvm it has to be in an asycn function

// hehe oops

var model;
var classNames = classes.split(' ');
var coords = [];
var mousePressed = false;
var mode;


export default function Doodle(props) {

    const [canvas, setCanvas] = useState(null)

    async function loadModel() {
        model = await tf.loadLayersModel('model2/model.json')

        //warm up 
        model.predict(tf.zeros([1, 28, 28, 1]))

        //allow drawing on the canvas 
        
    }

    useEffect(() => {
        loadModel()
    }, [])

    /*
get the best bounding box by trimming around the drawing
*/
    function getMinBox() {
        //get coordinates 
        var coorX = coords.map(function (p) {
            return p.x
        });
        var coorY = coords.map(function (p) {
            return p.y
        });

        //find top left and bottom right corners 
        var min_coords = {
            x: Math.min.apply(null, coorX),
            y: Math.min.apply(null, coorY)
        }
        var max_coords = {
            x: Math.max.apply(null, coorX),
            y: Math.max.apply(null, coorY)
        }

        //return as strucut 
        return {
            min: min_coords,
            max: max_coords
        }
    }

    /*
    get the current image data 
    */
    function getImageData() {
        //get the minimum bounding box around the drawing 
        const mbb = getMinBox()

        //get image data according to dpi 
        const dpi = window.devicePixelRatio
        const imgData = canvas.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
            (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
        return imgData
    }

    /*
    get the prediction 
    */
    function getFrame() {
        //make sure we have at least two recorded coordinates 
        if (coords.length >= 2) {

            //get the image data from the canvas 
            const imgData = getImageData()

            //get the prediction 
            const pred = model.predict(preprocess(imgData)).dataSync()

            //find the top 5 predictions 
            const indices = findIndicesOfMax(pred, 5)
            const probs = findTopValues(pred, 5)
            const names = getClassNames(indices)

            console.log(names)

            //set the table 
            // setTable(names, probs)
        }

    }

    /*
    get the the class names 
    */
    function getClassNames(indices) {
        var outp = []
        for (var i = 0; i < indices.length; i++)
            outp[i] = classNames[indices[i]]
        return outp
    }

    /*
    load the class names 
    */
    // async function loadDict() {
    //     if (mode == 'ar')
    //         loc = 'model2/class_names_ar.txt'
    //     else
    //         loc = 'model2/class_names.txt'

    //     await $.ajax({
    //         url: loc,
    //         dataType: 'text',
    //     }).done(success);
    // }

    /*
    load the class names
    */
    function success(data) {
        const lst = data.split(/\n/)
        for (var i = 0; i < lst.length - 1; i++) {
            let symbol = lst[i]
            classNames[i] = symbol
        }
    }

    /*
    get indices of the top probs
    */
    function findIndicesOfMax(inp, count) {
        var outp = [];
        for (var i = 0; i < inp.length; i++) {
            outp.push(i); // add index to output array
            if (outp.length > count) {
                outp.sort(function (a, b) {
                    return inp[b] - inp[a];
                }); // descending sort the output array
                outp.pop(); // remove the last index (index of smallest element in output array)
            }
        }
        return outp;
    }

    /*
    find the top 5 predictions
    */
    function findTopValues(inp, count) {
        var outp = [];
        let indices = findIndicesOfMax(inp, count)
        // show 5 greatest scores
        for (var i = 0; i < indices.length; i++)
            outp[i] = inp[indices[i]]
        
        console.log(outp)
        return outp
    }

    /*
    preprocess the data
    */
    function preprocess(imgData) {
        return tf.tidy(() => {
            //convert to a tensor 
            let tensor = tf.browser.fromPixels(imgData, 1)

            //resize 
            const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()

            //normalize 
            const offset = tf.scalar(255.0);
            const normalized = tf.scalar(1.0).sub(resized.div(offset));

            //We add a dimension to get a batch shape 
            const batched = normalized.expandDims(0)
            return batched
        })
    }

    /*
    load the model
    */

    /*
    allow drawing on canvas
    */


    /*
    clear the canvs 
    */
    function erase() {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        coords = [];
    }

    const initCanvas = () => (
        new fabric.Canvas('canvas', {
            height: 300,
            width: 300,
            backgroundColor: '#ffffff',
            isDrawingMode: 1,
            freeDrawingBrush: {
                color: "black",
                width: 20
            }
        })
    );

    function recordCoor(event) {
        var pointer = canvas.getPointer(event.e);
        var posX = pointer.x;
        var posY = pointer.y;

        if (posX >= 0 && posY >= 0 && mousePressed) {
            coords.push(pointer)
        }
    }

    useEffect(() => {
        setCanvas(initCanvas());
    }, []);

    useEffect(() => {
        if (canvas) {
            canvas.on('mouse:up', function (e) {
                getFrame();
                mousePressed = false
            });
            canvas.on('mouse:down', function (e) {
                mousePressed = true
            });
            canvas.on('mouse:move', function (e) {
                recordCoor(e)
            });
        }
    }, [canvas]);

    return (<div>
        <canvas id="canvas" />
    </div>)
}
