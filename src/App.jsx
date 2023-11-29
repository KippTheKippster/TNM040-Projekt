import { useState, useEffect } from 'react'
import './App.css'
import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

function App()
{ 
  const [equationString, setEquationString] = useState("\\frac{}{}")

  useEffect(() => 
  {
    let a = document.querySelector("#root span mjx-container mjx-assistive-mml mjx-container mjx-assistive-mml math msup mn")
    console.log(a);
  });

  const config = {
    loader: { load: ["input/asciimath"] },
  };

  return (
    <div>
    <h2>Basic MathJax example with Latex</h2>
    <MathJaxContext config={config}>
      {<MathJax hideUntilTypeset={"every"} dynamic>{"\\(" + equationString + "\\)"}</MathJax>}
    </MathJaxContext>
    <textarea name="E" id="" cols="30" rows="10" value={equationString} onChange={(e) => {setEquationString(e.target.value)}}></textarea>
    </div>
  );
}

export default App;