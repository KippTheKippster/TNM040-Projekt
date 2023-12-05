import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function LatexToSVGDownloader() {
  const [latex, setLatex] = useState('');

  // Function to convert LaTeX to SVG using KaTeX
  const convertLatexToSVG = (latexString) => {
    try {
      return katex.renderToString(latexString, {
        throwOnError: true,
        displayMode: true,
        output: 'svg'
      });
    } catch (error) {
      console.error('Error converting LaTeX to SVG:', error);
      return null;
    }
  };

  // Function to trigger the download of the SVG
  const downloadSVG = (svgContent, filename = 'equation.svg') => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  // Function to handle the conversion and trigger the download
  const handleDownload = () => {
    const svgContent = convertLatexToSVG(latex);
    if (svgContent) {
      downloadSVG(svgContent);
    } else {
      alert('Invalid LaTeX input.');
    }
  };

  return (
    <div>
      <textarea
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        placeholder="Enter LaTeX here"
      />
      <button onClick={handleDownload}>Download SVG</button>
    </div>
  );
}

export default LatexToSVGDownloader;
