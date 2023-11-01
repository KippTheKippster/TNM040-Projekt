import { useState } from 'react'
import './App.css'

import * as React from "react";

import { MathComponent } from "mathjax-react";

window.addEventListener("DOMContentLoaded", () => {
  console.log("Dom loaded")
})

document.addEventListener('click', function(e) {  //Listens to clicked html elements
  prevClickedTarget = e.target;
  console.log(prevClickedTarget)
}, false);  

let prevClickedTarget = null;

function App() // Här körs appen
{ 
  console.log("Wa");

  const [equationString, setEquationString] = useState("")

  function onEquationChanged(e)
  {
    setEquationString(String.raw`${e.target.value}`)
  }

  function onInsertButtonPressed(target)
  {
    const finalString = equationString + "\\pi";
    document.getElementById("equation-input").value = finalString;
    setEquationString(finalString);
  }

  var a = 
  [
    ["\\frac{}{}", 5, "/"],
    ["\\pi",  -1, "π"],
    ["\\pass", -1,]
  ]

  return (
    <>
      <div>
        <h1>LaTex är koolt</h1>
        <button onClick={onInsertButtonPressed} id='insert-button'>π</button>
        <div id='text-box-container'>
          <textarea onChange={onEquationChanged} id="equation-input" className='text-box'/>
        </div>
        <div id='latex-container'>
          <MathComponent tex={String.raw`${equationString}`} />
        </div>
      </div>
    </>
  )
}

export default App