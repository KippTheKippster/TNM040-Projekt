const brackets = [
  ["|", 0],
  ["(\,", 0],
  ["\\{", 0],
  ["\\lceil", 0],
  ["\\ulcorner", 0],
  ["\\|", 0],
  [")\,", 0],//maybe )\\,
  ["\\}", 0],
  ["\\rceil", 0],
  ["\\urcorner", 0],
  ["/", 0],
  ["\\[\,", 0],//maybe \\[\\,
  ["\\langle", 0],
  ["\\lfloor", 0],
  ["\\llcorner", 0],
  ["\\backslash", 0],
  ["\\]\,", 0],//maybe \\]\\,
  ["\\rangle", 0],
  ["\\rfloor", 0],
  ["\\lrcorner", 0] 
]

 const trigonometri = [
  ["\\sin{}", -1],
  ["\\cos{}", -1],
  ["\\tan{}", -1],
  ["\\arcsin{}", -1],
  ["\\arccos{}", -1],
  ["\\arctan{}", -1],
  ["\\csc{}", -1],
  ["\\sec{}", -1],
  ["\\cot{}", -1],
  ["\\sinh{}", -1],
  ["\\cosh{}", -1],
  ["\\tanh{}", -1],
  ["\\operatorname{arsinh{}}", -1],
  ["\\operatorname{arcosh{}}", -1],
  ["\\operatorname{artanh{}}", -1],
  ["\\operatorname{csch{}}", -1],
  ["\\operatorname{sech{}}", -1],
  ["\\coth{}", -1],
  ["\\operatorname{arcsch{}}", -1]
]

const fractions_and_binomial = [
  ["\\frac{a}{b}", -4],
  ["\\frac{dy}{dx}", 0],
  ["\\frac{\\Delta y}{\\Delta x}", 0],
  ["\\frac{\\partial y}{\\partial x}", 0],
  ["\\frac{\\delta y}{\\delta x}", 0],
  ["\\binom{n}{k}", -4],
  ["a | b", -4]
]

const integral = [
  ["\\int{x}", -1],
  ["\\int_{a}^{b}x", 0],
  ["\\iint{x}", -1],
  ["\\iint_{a}^{b}x", 0],
  ["\\iiint{x}", -1],
  ["\\iiint_{a}^{b}x", 0],
  ["\\oint{x}", -1],
  ["\\oint_{a}^{b}x", 0],
  ["\\oiint{x}", -1],
  ["\\oiint_{a}^{b}x", 0],
  ["\\oiiint{x}", -1],
  ["\\oiiint_{a}^{b}x", 0],
  ["dx", 0],
  ["dy", 0],
  ["d\\theta", 0]
]

const summation = [
  ["\\sum{x}", -1],
  ["\\sum_{a}^{n}x", 0],
  ["\\sum_{a}x", 0],
  ["\\prodx", 0],
  ["\\prod_{a}^{b}x", 0],
  ["\\prod_{a}x", 0],
  ["\\amalg{x}", -1],
  ["\\amalg_{a}^{b}x", 0],
  ["\\amalg_{a}x", 0],
  ["\\bigcup{x}", -1],
  ["\\bigcup_{a}^{b}x", 0],
  ["\\bigcup_{a}x", 0],
  ["\\bigcap{x}", -1],
  ["\\bigcap_{a}^{b}x", 0],
  ["\\bigcap_{a}x", 0],
  ["\\bigvee{x}", -1],
  ["\\bigvee_{a}^{b}x", 0],
  ["\\bigvee_{a}x", 0],
  ["\\bigwedge{x}", -1],
  ["\\bigwedge_{a}^{b}x", 0],
  ["\\bigwedge_{a}x", 0],
  ["\\sum_{k}\\binom{n}{k}", 0],
  ["\\sum_{i=0}^{n}x", 0],
  ["\\prod_{k=1}^{n}A_k", 0]
]

const exponential = [
  ["x^a", 0],
  ["x_a", 0],
  ["x_b^a", -2,],
  ["{_b^a}x", 0],
  ["e^{-i\\omega t}", 0],
  ["x^2", 0]
]

const roots = [
  ["\\sqrt{x}", -1],
  ["\\sqrt[a]{x}", -1],
  ["\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}", 0],
  ["\\sqrt{a^2+b^2}", 0]
]

const limits_and_log = [
  ["\\lim_{x\\to\\infty} x", -1],
  ["\\ln{x}", -1],
  ["\\log_a{x}", -1],
  ["\\log{x}", -1]
]

const accent = [
  ["\\dot{x}", -1],
  ["\\ddot{x}", -1],
  ["\\hat{x}", -1],
  ["\\check{x}", -1],
  ["\\breve{x}", -1],
  ["\\widetilde{x}", -1],
  ["\\bar{x}", -1],
  ["\\bar{\\bar{x}}", -1],
  ["\\overbrace{x}", -1],
  ["\\underbrace{x}", -1],
  ["\\vec{x}", -1]
]

const functions = [
  { name: 'Brackets', functions: brackets },
  { name: 'Trigonometry', functions: trigonometri },
  { name: 'Fractions and Binomial', functions: fractions_and_binomial },
  { name: 'Integral', functions: integral },
  { name: 'Summation', functions: summation },
  { name: 'Exponential', functions: exponential },
  { name: 'Roots', functions: roots },
  { name: 'Limits and Log', functions: limits_and_log },
  { name: 'Accents', functions: accent },
]
  

  export default functions;