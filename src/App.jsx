import { useState, useEffect } from 'react'
import './App.css'
import React from "react";
//import { MathComponent } from "mathjax-react";
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'
import CodeMirror from '@uiw/react-codemirror';

import {EditorView} from "@codemirror/view"

//TODO try to use LatexToMathML and render MathML because react-latex-next is big poo poo

let baseTheme = EditorView.baseTheme({
  ".cm-o-replacement": {
    display: "inline-block",
    width: ".5em",
    height: ".5em",
    borderRadius: ".25em",
    textAlign: "left"
  },
  "&light .cm-o-replacement": {
    backgroundColor: "#04c"
  },
  "&dark .cm-o-replacement": {
    backgroundColor: "#5bf"
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

  const [equationString, setEquationString] = useState("\\huge\\frac{\\pi + x^2}{2}")
  const [recentElements, setRecentElements] = useState([]);
  const [elementIndex, setElementIndex] = useState(0)


  function onKeyDown(event)
  {
    if (event.code == "ArrowRight")
    {
      addLaTeXCaretIndex(1);
    }
    else if (event.code == "ArrowLeft")
    {
      addLaTeXCaretIndex(-1);
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
    addLaTeXCaretIndex(0);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  function addLaTeXCaretIndex(add)
  {
    const elements = MathMLReader.getAllMathMLElements()
    console.log(elements)
    let index = Math.min(Math.max(elementIndex + add, 0), elements.length - 1)
    if (index != elementIndex) //Stupid?
      setElementIndex(index);

    console.log(index)
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
    let w = 1/* Math.max(h / 20, 1);*/
    let x = window.scrollX + rect.right;
    let y = window.scrollY + rect.top;

    caret.style.minWidth = w + "px";
    caret.style.minHeight = h + "px";
    caret.style.left = Math.round(x) + "px";
    caret.style.top = Math.round(y) + "px";
    caret.style.animation = "none";
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

  return (
    <>
    <Latex>{String.raw`$${equationString}$`}</Latex>
    <div id='latex-caret'></div>  
    </>
  );


}

export default App;