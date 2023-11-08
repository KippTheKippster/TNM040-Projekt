const brackets = [
    ["|", -1],
    ["(\,", -1],
    ["\\{", -1],
    ["\\lceil", -1],
    ["\\ulcorner", -1],
    ["\\|", -1],
    [")\,", -1],//maybe )\\,
    ["\\}", -1],
    ["\\rceil", -1],
    ["\\urcorner", -1],
    ["/", -1],
    ["\\[\,", -1],//maybe \\[\\,
    ["\\langle", -1],
    ["\\lfloor", -1],
    ["\\llcorner", -1],
    ["\\backslash", -1],
    ["\\]\,", -1],//maybe \\]\\,
    ["\\rangle", -1],
    ["\\rfloor", -1],
    ["\\lrcorner", -1] 
 ]

  const functions = [
    brackets //, trigonometric, exponential, 
  ]

  export default functions;