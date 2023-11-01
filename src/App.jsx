import { useState } from 'react'
import './App.css'

import * as React from "react";

import { MathComponent } from "mathjax-react";

window.addEventListener("DOMContentLoaded", () => {
  console.log("Dom loaded")
})

function App() // Här körs appen
{
  console.log("Wa");

  const [equationString, setEquationString] = useState("")

  function onEquationChanged(target) {
    setEquationString(String.raw`${target.target.value}`)
  }

  function onInsertButtonPressed(target) {
    const finalString = equationString + "\\pi";
    document.getElementById("equationInput").value = finalString;
    setEquationString(finalString);
  }

  var a =
    [
      ["\\frac{}{}", 5, "/"],
      ["\\pi", -1, "π"],
      ["\\pass", -1,]
    ]

  return (
    <>
      <div>
        <div className='logo'>
          <img src="src/Squeezy_LaTex_logo.svg" alt="Logo"></img>
        </div>
        <button onClick={onInsertButtonPressed} id='insertButton'>π</button>
        <div id='text-box-container'>
          <textarea onChange={onEquationChanged} id="equationInput" className='text-box' />
          <MathComponent tex={String.raw`${equationString}`} />
        </div>
      </div>
    </>
  )
}

export default App