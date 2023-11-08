import { useState } from 'react'
import './App.css'
import React from "react";
//import { MathComponent } from "mathjax-react";
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'

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

  function onInsertButtonPressed(symbol) {
    const finalString = equationString + symbol;
    document.getElementById("equation-input").value = finalString;
    setEquationString(finalString);
  }

  const greek = [
    ["\\alpha", -1],
    ["\\beta", -1],
    ["\\gamma", -1],
    ["\\Gamma", -1],
    ["\\delta", -1],
    ["\\Delta", -1],
    ["\\epsilon", -1],
    ["\\varepsilon", -1],
    ["\\zeta", -1],
    ["\\eta", -1],
    ["\\theta", -1],
    ["\\vartheta", -1],
    ["\\iota", -1],
    ["\\kappa", -1],
    ["\\lambda", -1],
    ["\\Lambda", -1],
    ["\\mu", -1],
    ["\\nu", -1],
    ["\\xi", -1],
    ["\\omicron", -1],
    ["\\Pi", -1],
    ["\\pi", -1],
    ["\\varpi", -1],
    ["\\rho", -1],
    ["\\varrho", -1],
    ["\\Sigma", -1],
    ["\\sigma", -1],
    ["\\varsigma", -1],
    ["\\tau", -1],
    ["\\Upsilon", -1],
    ["\\Phi", -1],
    ["\\phi", -1],
    ["\\varphi", -1],
    ["\\chi", -1],
    ["\\Psi", -1],
    ["\\psi", -1],
    ["\\Omega", -1],
    ["\\omega", -1]
  ];
  
  const relation = [
    ["\\leq", -1]
  ]

  const logic = [
    ["\\forall", -1]
  ]

  const geometry = [
    ["\\angle", -1]
  ]

  const arrows = [
    ["\\rightarrow", -1]
  ]

  const other_symbols = [
    ["\\partial", -1]
  ]

  const symbols = [
    greek, relation, logic, geometry, arrows, other_symbols
  ]

  //download button funktion.. 
  function onDownloadButtonClicked(e) {
    downloadText("SqueezyLatextEquation", equationString)
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


        </div>
        </div>

    </>
  );


}

export default App;