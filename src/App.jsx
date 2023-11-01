import { useState } from 'react'
import './App.css'

import * as React from "react";

import { MathComponent } from "mathjax-react";

window.addEventListener("DOMContentLoaded", () => {
  console.log("Dom loaded")
})

function App() 
{
  console.log("Wa");
  const [equationTarget, setEquationString] = useState(null)
  const [insertTarget, setInsert] = useState(null)

  const equationInput = document.getElementById("equationInput")
  const insertButton = document.getElementById("insertButton")

  function onEquationChanged(target)
  {
    setEquationString(target)
  }

  function onInsertButtonPressed(target)
  {
    if (equationInput == null)
      return

    equationInput.value += "\\pi"
    setInsert(target)
  }

  var a = 
  [
    ["\\frac{}{}", 5, "/"],
    ["\\pi",  -1, "π"],
    ["\\pass", -1,]
  ]

  let equationText = "";
  if (equationInput != null)
    equationText = equationInput.value

  return (
    <>
      <div>
        <h1>LaTex är koolt</h1>
        <button onClick={onInsertButtonPressed} id='insertButton'>π</button>
        <div id='text-box-container'>
        <textarea onChange={onEquationChanged} id="equationInput" className='text-box'/>
        </div>
        <MathComponent tex={String.raw`${equationText}`} />
      </div>
    </>
  )
}

export default App
