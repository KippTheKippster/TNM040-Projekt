import { useState, useEffect } from 'react'
import './App.css'
import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

function App()
{ 
  useEffect(() => 
  {
    let a = document.querySelector("#root span mjx-container mjx-assistive-mml mjx-container mjx-assistive-mml math msup mn")
    console.log(a);
  });

  const config = {
    loader: { load: ["input/asciimath"] },
  };
  return (
    <MathJaxContext config={config}>
      <h2>Basic MathJax example with Latex</h2>
      {<MathJax>{"\\(\\int\\frac{x}{2}  \\)"}</MathJax>}
      <MathJax>
        <math>

        <mi>x</mi>
        <msup>
          <mn>2</mn>
          <mn>12</mn>
        </msup>
        </math>
      </MathJax>
    </MathJaxContext>
  );
}

export default App;