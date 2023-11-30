import { React, useState, useEffect, ReactDOM } from 'react'
import ReactDOMServer from 'react-dom/server'

import './App.css'
//import { MathComponent } from "mathjax-react";
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'
import CodeMirror from '@uiw/react-codemirror';
import { MathJax, MathJaxContext } from "better-react-mathjax";

import {EditorView} from "@codemirror/view"

//TODO try to use LatexToMathML and render MathML because react-latex-next is big poo poo

let baseTheme = EditorView.baseTheme({
  ".cm-o-replacement": {
    display: "inline-block",
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
let laTeXCaretAtEnd = false;

const renderDropdownContent = (symbolObject) => {
  return symbolObject.symbols.map((symbol, index) => (
    <button key={index} onClick={() => onInsertButtonPressed(symbol[0])}>
      {/* Display the symbol using the Latex component */}
      {<Latex>{String.raw`$${symbol[0]}$`}</Latex>}
    </button>
  ));
};

const buttons = symbols.map((symbolObject, index) => (
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
))

function App()
{ 
  console.log("App called");

  const [equationString, setEquationString] = useState("\\frac{\\pi + x^2}{2}")
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
    else if (event.code == "Backspace")
    {
      removeLaTeXText();
    }
    else if (event.key.length == 1)
    {
      addLaTexText(event.key)
    }
  }


  //document.removeEventListener('keydown', onKeydown); //Javascript big pee pee poo poo
  //document.addEventListener('keydown', onKeydown, true);

  //runs after render
  useEffect(() => 
  {
    //MathMLReader.renderMathHTMLComponents(equationString)
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

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  function addLaTeXCaretIndex(add)
  {
    const elements = MathMLReader.getAllMathHTMLComponents()
    let index = Math.min(Math.max(elementIndex + add, 0), elements.length - 1)
    laTeXCaretAtEnd = index == elements.length - 1;
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

    //let rect = element.getBoundingClientRect();

    //let h = (rect.bottom - rect.top)
    //let w = Math.max(h / 20, 1);
    //let x = window.scrollX + rect.right;
    //let y = window.scrollY + rect.top;
    let h = element.h
    let w = 1
    let x = element.x + element.w
    let y = element.y

    caret.style.minWidth = w + "px";
    caret.style.minHeight = h + "px";
    caret.style.left = x + "px";
    caret.style.top = y + "px"
  }

  function addLaTexText(text)
  {
    if (document.activeElement.tagName != "BODY")
      return;

    let startIndex = equationString.length
    const element = MathMLReader.getAllMathHTMLComponents()[elementIndex]
    console.log(element)
    if (element != null)
      startIndex = element.endIndex

    const newString = 
      equationString.substring(0, startIndex) + 
      text + 
      equationString.substring(startIndex)

    setEquationString(newString)
  }

  function removeLaTeXText()
  {
    if (document.activeElement.tagName != "BODY")
      return;

    const element = MathMLReader.getAllMathHTMLComponents()[elementIndex]
    if (element == null)
    {
      setEquationString(equationString.substring(0, equationString.length - 1))
      return
    }

    //console.log(element)
    const newString = 
      equationString.substring(0, element.startIndex) + 
      equationString.substring(element.endIndex)

    setEquationString(newString)
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

  function onMathJaxLoad()
  {
    const elements = MathMLReader.renderMathHTMLComponents(equationString)
    const latexContainer = document.getElementById("latex-container")
    if (!laTeXCaretAtEnd)
      addLaTeXCaretIndex(0)
    else 
      addLaTeXCaretIndex(99999) //Bruh
    if (latexContainer == null || ReactDOM == null)
      return
    
    //latexContainer.innerHTML += ReactDOMServer.renderToString(elements)
  }

  const config = {
    loader: { load: ["input/asciimath"] },
  };

  return (
    <>
      <MathJaxContext config={config}>
        <div className='logo'>
          <img src="/src/Squeezy_LaTex_logo2.svg" alt="Logo" />
        </div>
        <div className="dropdown-container">
          {buttons}
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
          <MathJax dynamic onTypeset={onMathJaxLoad}>{"\\(" + equationString + "\\)"}</MathJax>
          {/*MathMLReader.renderMathHTMLComponents(equationString)*/}
          <div id='latex-caret'></div>
        </div>
        <div className='Buttons'> 
        <button type="button" onClick={onDownloadButtonClicked}>Download</button>
        </div>
      </MathJaxContext>

    </>
  );


}

export default App;