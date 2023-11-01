import { useState } from 'react'

import './App.css'

window.addEventListener("DOMContentLoaded", () => {
  console.log("Dom loaded")
  
})


function App() 
{
  const [laTexTarget, setLaTexString] = useState(null)
  const [equationTarget, setEquationString] = useState(null)

  const equationInput = document.getElementById("equationInput")
  const laTexInput = document.getElementById("laTexInput")
  const insertButton = document.getElementById("insertButton")

  function onLatexChanged(target)
  {
    if (equationInput != null)
      equationInput.value = laTexInput.value

    setLaTexString(target)
  }

  function onEquationChanged(target)
  {
    if (laTexInput != null)
      laTexInput.value = equationInput.value

    setEquationString(target)
  }

  function insertButtonPressed()
  {
    if (laTexInput == null)
      return

    laTexInput.value += "\\pi"

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
        <button onClick={insertButtonPressed} id='insertButton'>π</button>
        <div id='text-box-container'>
            <textarea onChange={onLatexChanged} id="laTexInput" className='text-box'/>
            <textarea onChange={onEquationChanged} id="equationInput" className='text-box'/>
        </div>
        <p></p>
      </div>
    </>
  )
}

export default App
