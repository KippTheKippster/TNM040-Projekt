import React, { useState } from 'react';
import texToSvg from 'tex-equation-to-svg';

function EquationToSvgConverter() {
  const [equation, setEquation] = useState('');
  const [svg, setSvg] = useState('');

  const convertToSvg = () => {
    try {
      const svgString = texToSvg(equation);
      setSvg(svgString);
    } catch (error) {
      console.error('Error converting equation to SVG:', error);
      setSvg('');
    }
  };
  
  const handleDownload = () => {
    downloadSvg(svg, "equation.svg");
  }


  return (
    <div>
      <input
        type="text"
        value={equation}
        onChange={(e) => setEquation(e.target.value)}
        placeholder="Enter LaTeX Equation"
      />
      <button onClick={convertToSvg}>Convert to SVG</button>
      <div>
        <p>SVG Output:</p>
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    </div>
  );
}

export default EquationToSvgConverter;
