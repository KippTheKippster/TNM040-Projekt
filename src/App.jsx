import { useState, useEffect, memo } from 'react'
import './App.css'
import React from "react";
//import { MathComponent } from "mathjax-react";
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'
import CodeMirror from '@uiw/react-codemirror';

import { EditorView } from "@codemirror/view"
import { MathJax, MathJaxContext } from "better-react-mathjax";

import { Icon } from '@iconify/react';

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

let codeMirrorCursorIndex = 0;

function App() // Här körs appen
{
  console.log("App called");

  const [equationString, setEquationString] = useState("")
  const [recentElements, setRecentElements] = useState([]);
  const [elementIndex, setElementIndex] = useState(0)
  //const [showDropdown, setShowDropdown] = useState(false); //dropdown 

  let codeMirrorFirstUpdate = true

  function onKeyDown(event) {
    if (event.code == "ArrowRight") {
      //addLaTeXCaretIndex(1);
    }
    else if (event.code == "ArrowLeft") {
      //addLaTeXCaretIndex(-1);
    }
  }

  //runs after render
  useEffect(() => {
    const __latex = document.querySelector("#latex-container span.__Latex__")
    if (__latex != null && __latex.children.length == 0) {
      if (__latex.textContent[0] == '$') {
        __latex.textContent = __latex.textContent.substring(1);
      }
      if (__latex.textContent.endsWith("$")) {
        __latex.textContent = __latex.textContent.slice(0, -1);
      }
    }
    //document.addEventListener('keydown', onKeyDown);
    document.addEventListener("insertButtonPressed", onInsertButtonPressed)
    return () => {
      //  document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener("insertButtonPressed", onInsertButtonPressed)
    };
  });

  function addLaTeXCaretIndex(add) {
    const elements = MathMLReader.getAllSpanElements()
    let index = Math.min(Math.max(elementIndex + add, 0), elements.length - 1)
    console.log(index)
    if (index != elementIndex) //Stupid?
      setElementIndex(index);

    drawLaTeXCaret(elements[index])
  }

  function drawLaTeXCaret(element) {
    const caret = document.getElementById("latex-caret");

    if (element == null) {
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

  function onEquationChanged(e) {
    codeMirrorCursorIndex += e.length - equationString.length
    codeMirrorCursorIndex = Math.max(0, codeMirrorCursorIndex)
    setEquationString(String.raw`${e}`)
  }

  function onInsertButtonPressed(e) {
    const symbol = e.detail
    const finalString =
      equationString.slice(0, codeMirrorCursorIndex) + symbol +
      equationString.slice(codeMirrorCursorIndex);

    codeMirrorCursorIndex += symbol.length
    //document.getElementById("equation-input").value = finalString;
    setEquationString(finalString);

    // Update recentElements state
    setRecentElements((prevElements) => {
      // Check if the symbol is already in the recent elements
      if (!prevElements.includes(symbol)) {
        // Add the new symbol to the beginning of the array
        return [symbol, ...prevElements.slice(0, 7)]; // Keep only the latest 8 elements
      }
      return prevElements;
    });
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

  function downloadSVG(filename) {
    const container = document.getElementById("latex-container")
    const svgContent = container.getElementsByTagName("svg")[0]
    var svgData = svgContent.outerHTML;
    var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  // Download LaTeX as PNG
  function downloadPNG(filename, res) {
    const latexContainer = document.getElementById('latex-container');
    const svg = latexContainer.getElementsByTagName("svg")[0]
    const svgData = new XMLSerializer().serializeToString(svg)
    var blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgDataUrl = URL.createObjectURL(blob)

    let image = new Image()
    image.addEventListener('load', () => { //Converts svg data to png data Legend https://gist.github.com/tatsuyasusukida/1261585e3422da5645a1cbb9cf8813d6
      const svgWidth = svg.getAttribute("width").slice(0, -2)
      const svgHeight = svg.getAttribute("height").slice(0, -2)
      const width = res * svgWidth
      const height = res * svgHeight
      const canvas = document.createElement('canvas')

      canvas.setAttribute('width', width)
      canvas.setAttribute('height', height)

      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, width, height)

      const dataUrl = canvas.toDataURL('image/png')
      var link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })

    image.src = svgDataUrl

  }

  function onCodeMirrorUpdate(v) {
    if (v.changedRanges.length > 0) {
      let index = codeMirrorCursorIndex
      v.state.selection.ranges[0].from = index
      v.state.selection.ranges[0].to = index
    }

    if (codeMirrorFirstUpdate == false) {
      //console.log("Setting cursor!")
      codeMirrorCursorIndex = v.state.selection.ranges[0].from
    }

    codeMirrorFirstUpdate = false
  }

  const config = {
    loader:
    {
      load: ['input/tex', 'output/svg', '[tex]/require']
    },
    tex:
    {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
    }
  };

  return (
    <>
    
      <MathJaxContext
        config={config}
        version={3}
        src='https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'
      >
        <img id="logo" src="/src/Squeezy_LaTex_logo2.svg" alt="Logo" />
       
        {/* info box */}
        <div className="btn-help">
          
          <i className="bi bi-question-1g"></i> 
          <div className="text-section">
            <h5>INFO</h5>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut aliquam, neque aliquid qui nulla quibusdam quos natus temporibus consequuntur vero recusandae illum provident aut ex, assumenda nobis?</p>
          </div>
        </div>

        <div className="dropdown-container">  
          <h2>Symbols:</h2>
          {symbols.map((symbolObject, index) => (
            // Create a "dropdown" for each object
            <div key={index} className="dropdown">
              {/* The button for the dropdown displays the name of the object */}
              <button className="dropbtn">

                {/* Display the first symbol underneath the name */}
                {symbolObject.symbols.length > 0 && (
                  <MathJax>{String.raw`$${symbolObject.symbols[0][0]}$`}</MathJax>
                )}
                <h2>{symbolObject.name}</h2>
                {/*<br />*/}

              </button>
              <div className="dropdown-content">
                {/* Call the function to render dropdown content */}
                {renderDropdownContent(symbolObject.symbols)}
              </div>
            </div>
          ))}
          <h2>Functions:</h2>
          {functions.map((functionObject, index) => (
            <div key={index} className="dropdown">
              <button className="dropbtn">

                {functionObject.functions.length > 0 && (
                  <MathJax>{String.raw`$${functionObject.functions[0][0]}$`}</MathJax>
                )}
                <h2>{functionObject.name}</h2>
              </button>
              <div className="dropdown-content">
                {renderDropdownContent(functionObject.functions)}
              </div>
            </div>
          ))}
        </div>
        <div className="recent-elements">
          <h2>Recents:</h2>
          {recentElements.map((element, index) => (
            <button key={index} onClick={() => onInsertButtonPressed({ detail: element })}>
              {<MathJax>{String.raw`$${element}$`}</MathJax>}
            </button>
          ))}
        </div>
        <div id='text-box-container'>
          {<CodeMirror theme={baseTheme} onUpdate={onCodeMirrorUpdate} onChange={onEquationChanged} readOnly={false} id="equation-input" className='text-box' value={equationString} />}
        </div>
        <div id='latex-container'>
          <MathJax dynamic>{String.raw`$${"\\displaystyle " + equationString}$`}</MathJax>
          <div id='latex-caret'></div>
        </div>

        {/* <div className='Buttons'>
          <button onClick={() => downloadText("SqueezyLatextEquation.txt", equationString)}>Download as text file</button>
          <button onClick={() => downloadPNG("SqueezyLatextEquation", 256)}>Download as PNG</button>
          <button onClick={() => downloadSVG("SqueezyLatextEquation")}>Download as SVG</button>

        </div> */}

        <div className="sec-center"> 
          <input className="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
          <label className="for-dropdown" for="dropdown">Download <Icon icon="line-md:download-outline-loop" width="25" height="25" /></label>
          <div className="section-dropdown"> 
            <a href="#" onClick={() => downloadText('SqueezyLatextEquation.txt', equationString)}> as Text</a>
            <a href="#" onClick={() => downloadPNG('SqueezyLatextEquation', 256)}> as PNG</a> {/*som en bredd på 256 pixlar eller en upplösning på 256 DPI  */}
            <a href="#" onClick={() => downloadSVG('SqueezyLatextEquation')}> as SVG</a>
          </div>
        </div>
      </MathJaxContext>
    </>
  );
}

const renderDropdownContent = (array) => {
  return array.map((item, index) => (
    <button key={index} onClick={() => document.dispatchEvent(new CustomEvent("insertButtonPressed", { detail: item[0] }))}>
      {/* Display the item using the Latex component */}
      {<MathJax>{String.raw`$${item[0]}$`}</MathJax>}
    </button>
  ));
};

const dropdownContainer =
  <div className="dropdown-container">
    <h2>Symbols:</h2>
    {symbols.map((symbolObject, index) => (
      // Create a "dropdown" for each object
      <div key={index} className="dropdown">
        {/* The button for the dropdown displays the name of the object */}
        <button className="dropbtn">

          {/* Display the first symbol underneath the name */}
          {symbolObject.symbols.length > 0 && (
            <MathJax>{String.raw`$${symbolObject.symbols[0][0]}$`}</MathJax>
          )}
          <h2>{symbolObject.name}</h2>
          {/*<br />*/}

        </button>
        <div className="dropdown-content">
          {/* Call the function to render dropdown content */}
          {renderDropdownContent(symbolObject.symbols)}
        </div>
      </div>
    ))}
    <h2>Functions:</h2>
    {functions.map((functionObject, index) => (
      <div key={index} className="dropdown">
        <button className="dropbtn">

          {functionObject.functions.length > 0 && (
            <MathJax>{String.raw`$${functionObject.functions[0][0]}$`}</MathJax>
          )}
          <h2>{functionObject.name}</h2>
        </button>
        <div className="dropdown-content">
          {renderDropdownContent(functionObject.functions)}
        </div>
      </div>
    ))}
  </div>

export default App;
