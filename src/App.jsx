import { useState, useEffect } from 'react'
import './App.css'
import React from "react";
//import { MathComponent } from "mathjax-react";
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'
import symbols from './Symbols.jsx';
import functions from './Functions.jsx';
import * as MathMLReader from './mathml/MathMLReader.jsx'

window.addEventListener("DOMContentLoaded", () => {
  console.log("Dom loaded")
})

/*
document.addEventListener('click', function(e) {  //Listens to clicked html elements
  prevClickedTarget = e.target;
  console.log(prevClickedTarget)
}, false);  
*/

let prevClickedTarget = null;

function App() // Här körs appen
{ 
  console.log("App called");

  const [equationString, setEquationString] = useState("")

  //runs after render
  useEffect(() => 
  {
    let semantics = document.querySelector("#latex-container span");
    console.log(semantics); 
    if (semantics == null) //No renderable equation.
      return;

    console.log("adding")
    semantics.addEventListener("click", function(e){
      //alert("You clicked " + e + " times");
      console.log(e)
    });
  });

  function onEquationChanged(e)
  {
    setEquationString(String.raw`${e.target.value}`)
  }

  function onInsertButtonPressed(symbol) {
    const finalString = equationString + symbol;
    document.getElementById("equation-input").value = finalString;
    setEquationString(finalString);
  }

  function onLatextContainerClicked(e)
  {
    console.log("HUD")
    console.log(e)
  }

  //download button funktion.. 
  function onDownloadButtonClicked(e) {
    downloadText("SqueezyLatextEquation", equationString)
  }

  function onMathmlClicked()
  {
    const elements = MathMLReader.getMathMLElementsByCode("\\pi");
    console.log("Got elenemts: ");
    console.log(elements);
  }

  function downloadText(filename, text) {   
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(equationString));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  } 

  return (
    <>
      <div>
        <div className='logo'>
          <img src="/src/Squeezy_LaTex_logo2.svg" alt="Logo" />
        </div>
        <div>
          {/* Creates a button for every element in the first row of symbols array */}
          {symbols.map((symbol, index) => (
            <button key={index} onClick={() => onInsertButtonPressed(symbol[0])}>
              {<Latex>{String.raw`$${symbol[0]}$`}</Latex>}
            </button>
          ))}
        </div>
        <div id='text-box-container'>
          <textarea onChange={onEquationChanged} id="equation-input" className='text-box'/>
        </div>
        <div id='latex-container'>
          <Latex>{String.raw`$${equationString}$`}</Latex>
        </div>
        <div className='Buttons'> 
        <button type="button" onClick={onDownloadButtonClicked}>Download</button>
        <button type='button' onClick={onMathmlClicked}> </button>

        </div>
        </div>

    </>
  );


}

export default App;