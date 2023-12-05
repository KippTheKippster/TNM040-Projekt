import { useState, useEffect } from 'react'
import './App.css'
import React from "react";
//import { MathComponent } from "mathjax-react";
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'
import CodeMirror from '@uiw/react-codemirror';

import {EditorView} from "@codemirror/view"

let baseTheme = EditorView.baseTheme({
  ".cm-o-replacement": {
    display: "inline-block",
    width: ".5em",
    height: "auto",
    borderRadius: ".25em",
    textAlign: "left"
  }
})

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
  const [recentElements, setRecentElements] = useState([]);
  const [elementIndex, setElementIndex] = useState(0)


  function onKeyDown(event)
  {
    if (event.code == "ArrowRight")
    {
      //addLaTeXCaretIndex(1);
    }
    else if (event.code == "ArrowLeft")
    {
      //addLaTeXCaretIndex(-1);
    }
  }


  //document.removeEventListener('keydown', onKeydown); //Javascript big pee pee poo poo
  //document.addEventListener('keydown', onKeydown, true);

  //runs after render
  useEffect(() => 
  {
    const __latex = document.querySelector("#latex-container span.__Latex__")
    if (__latex != null && __latex.children.length == 0)
    {
      if (__latex.textContent[0] == '$')
      {
        __latex.textContent = __latex.textContent.substring(1);
      }
      if (__latex.textContent.endsWith("$"))
      {
        __latex.textContent = __latex.textContent.slice(0, -1);
      }
    }
    //document.addEventListener('keydown', onKeyDown);
    return () => {
      //  document.removeEventListener('keydown', onKeyDown);
    };
  });

  function addLaTeXCaretIndex(add)
  {
    const elements = MathMLReader.getAllSpanElements()
    let index = Math.min(Math.max(elementIndex + add, 0), elements.length - 1)
    console.log(index)
    if (index != elementIndex) //Stupid?
      setElementIndex(index);

    drawLaTeXCaret(elements[index])    
  }

  function drawLaTeXCaret(element)
  {
    const caret = document.getElementById("latex-caret");

    if (element == null)
    {
      caret.style.minWidth = 0 + "px";
      caret.style.minHeight = 0 + "px";  
      return;
    }

    let rect = element.getBoundingClientRect();

    let h = (rect.bottom - rect.top)
    let w = Math.max(h / 20, 1);
    let x = window.scrollX + rect.right;
    let y = window.scrollY + rect.top;

    caret.style.minWidth = w + "px";
    caret.style.minHeight = h + "px";
    caret.style.left = x + "px";
    caret.style.top = y + "px"
  }

  function onEquationChanged(e)
  {
    setEquationString(String.raw`${e}`)
  }

  function onInsertButtonPressed(symbol) {
    const finalString = equationString + symbol;
    //document.getElementById("equation-input").value = finalString;
    setEquationString(finalString);
    
    // Update recentElements state
    setRecentElements((prevElements) => {
      // Check if the symbol is already in the recent elements
      if (!prevElements.includes(symbol)) {
        // Add the new symbol to the beginning of the array
        return [symbol, ...prevElements.slice(0, 5)]; // Keep only the latest 6 elements
      }
      return prevElements;
    });
  }


  //download button funktion.. 
  function onDownloadButtonClicked(e) {
    downloadText("SqueezyLatextEquation", equationString)
  }

  function onMathmlClicked()
  {
    const elements = MathMLReader.getSpanElementsByCode("\\pi");
    console.log("Got elenemts: ");
    console.log(elements);
  }

  // Download LaTeX as text
  function downloadText(filename, text) {   
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(equationString));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  } 

  const renderDropdownContent = (symbolObject) => {
    return symbolObject.symbols.map((symbol, index) => (
      <button key={index} onClick={() => onInsertButtonPressed(symbol[0])}>
        {/* Display the symbol using the Latex component */}
        {<Latex>{String.raw`$${symbol[0]}$`}</Latex>}
      </button>
    ));
  };

  const renderDropdownContentFunctions = (functionObject) => {
    return functionObject.functions.map((func, index) => (
      <button key={index} onClick={() => onInsertButtonPressed(func[0])}>
        {/* Display the function using the Latex component */}
        {<Latex>{String.raw`$${func[0]}$`}</Latex>}
      </button>
    ));
  };
  
  return (
    <>
      <div>
        <img id="logo" src="/src/Squeezy_LaTex_logo2.svg" alt="Logo" />
        <div className="dropdown-container">
          {symbols.map((symbolObject, index) => (
            <div key={index} className="dropdown">
              <button className="dropbtn">
                {symbolObject.symbols.length > 0 && (
                  <Latex>{String.raw`$${symbolObject.symbols[0][0]}$`}</Latex>
                )}
                <br />
                {symbolObject.name}
              </button>
              <div className="dropdown-content">
                {renderDropdownContent(symbolObject)}
              </div>
            </div>
          ))}
        </div>
        <div className="dropdown-container">
          {functions.map((functionObject, index) => (
            <div key={index} className="dropdown">
              <button className="dropbtn">
                {functionObject.functions.length > 0 && (
                  <Latex>{String.raw`$${functionObject.functions[0][0]}$`}</Latex>
                )}
                <br />
                {functionObject.name}
              </button>
              <div className="dropdown-content">
                {renderDropdownContentFunctions(functionObject)}
              </div>
            </div>
          ))}
        </div>
        <div className="recent-elements">
          {recentElements.map((element, index) => (
            <button key={index} onClick={() => onInsertButtonPressed(element)}>
              {<Latex>{String.raw`$${element}$`}</Latex>}
            </button>
          ))}
        </div>
        <div id='text-box-container'>
          {<CodeMirror theme={baseTheme} onChange={onEquationChanged} readOnly={false} id="equation-input" className='text-box' value={equationString}/>}
        </div>
        <div id='latex-container'>
          <Latex>{String.raw`$${equationString}$`}</Latex>
          <div id='latex-caret'></div>
        </div>
        <div className='Buttons'> 
        <button className='download-button' onClick={() => downloadText("SqueezyLatextEquation.txt", equationString)}>Download as text file</button>
        </div>
      </div>

    </>
  );


}

export default App;