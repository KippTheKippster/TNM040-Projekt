import { useState, useEffect } from 'react'
import './App.css'
import React from "react";
import Latex from 'react-latex-next'

//pngimport 'katex/dist/katex.min.css'
//import katex from 'katex';

import CodeMirror from '@uiw/react-codemirror';
import html2canvas from 'html2canvas'; // png  

import {EditorView} from "@codemirror/view"

let baseTheme = EditorView.baseTheme({
  "&": {
    display: "inline-block",
    height: "auto",
    textAlign: "left",
    border: "1px solid #c0c0c0",
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

  const [equationString, setEquationString] = useState("")
  const [recentElements, setRecentElements] = useState([]);
  const [elementIndex, setElementIndex] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false);


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

   // Download LaTeX as PNG
  function downloadPNG(filename) {
    const latexContainer = document.getElementById('equation');
    html2canvas(latexContainer).then(canvas => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = filename + '.png';
      link.href = image;
      link.click();
    });
  }
 /* 
function removeKatexHtml(svgContent) {
  // Create a temporary DOM element to manipulate the SVG content
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = svgContent;

  // Find all elements with the class 'katex-html' and remove them
  let katexHtmlElements = tempDiv.getElementsByClassName('katex-html');
  while (katexHtmlElements[0]) {
      katexHtmlElements[0].parentNode.removeChild(katexHtmlElements[0]);
  }

  // Return the modified SVG content
  return tempDiv.innerHTML;
}


// This is the function that combines both steps and is triggered when the user clicks the download button

function handleDownloadSVG(latexString) {
  // Wrap the LaTeX string with the correct delimiters for display mode.
  const wrappedLatexString = `${latexString}`;

  try {
    const svgContentRaw = katex.renderToString(wrappedLatexString, {
      throwOnError: true, // Let's throw an error to catch it for debugging
      displayMode: true,
      output: 'svg',
    });
  
 const svgContent = removeKatexHtml(svgContentRaw)

    // Create a Blob from the SVG content and initiate a download
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'equation.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  } 
  
  catch (error) {
    // Log the error to the console and alert the user.
    console.error('Error rendering LaTeX as SVG:', error);
    alert(`Error rendering LaTeX: ${error.message}`);
  }
}

 // Download LaTeX as PNG
 function downloadPNG(filename) {
  const latexContainer = document.getElementById('equation');
  html2canvas(latexContainer).then(canvas => {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = filename + '.png';
    link.href = image;
    link.click();
  });
}

  */

  return (
    <>
    
   
      <div>
        <img id="logo" src="/src/Squeezy_LaTex_logo2.svg" alt="Logo" />
        <div className="dropdown-container">
          
          {symbols.map((symbolObject, index) => (
            // Create a "dropdown" for each object
            <div key={index} className="dropdown">
              {/* The button for the dropdown displays the name of the object */}
              <button className="dropbtn">
                {/* Display the first symbol underneath the name */}
                {symbolObject.symbols.length > 0 && (
                  <Latex>{String.raw`$${symbolObject.symbols[0][0]}$`}</Latex>
                )}
                <br />
                {symbolObject.name}
              </button>
              {/* This div will contain the dropdown content */}
              <div className="dropdown-content">
                {/* Call the function to render dropdown content */}
                {renderDropdownContent(symbolObject)}
              </div>
            </div>
          ))}
          <div className="recent-elements">
              {recentElements.map((element, index) => (
              <button key={index} onClick={() => onInsertButtonPressed(element)}>
                {<Latex>{String.raw`$${element}$`}</Latex>}
              </button>
            ))}
          </div>
        </div>
        <div id='text-box-container'>
          {<CodeMirror theme={baseTheme} onChange={onEquationChanged} readOnly={false} id="equation-input" className='text-box' value={equationString}/>}
        </div>
        <div id='latex-container'>
          <Latex>{String.raw`$${equationString}$`}</Latex>
          <div id='latex-caret'></div>
        </div>
        <div className='Buttons'>
          <button type="buttontxt" className="Download" onClick={downloadText}>Download as text file </button>
          <div className='dropdownButtons'>
          <button onClick={() => setShowDropdown(!showDropdown)}> Export options: </button>
          {showDropdown && (
            <ul>
              <li><button onClick={() => handleDownloadSVG(equationString)}>Download as SVG</button></li>
              <button onClick={() => downloadPNG("SqueezyLatextEquation")}>Download as PNG</button>
            </ul>
          )}
        </div>
        </div>
      </div>

    </>
  );


}

export default App;