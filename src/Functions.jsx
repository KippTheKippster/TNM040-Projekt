const matrix = [
  ["\\begin{Bmatrix}\na & b \n\\end{Bmatrix}", -26],
  ["\\begin{vmatrix}\na & b \\\\ \nc & d\n\\end{vmatrix}", -26],
  ["\\begin{Vmatrix}\na & b \\\\ \nc & d\n\\end{Vmatrix}", -26],
  ["\\begin{pmatrix}\na & b \\\\ \nc & d\n\\end{pmatrix}", -26],
  ["\\begin{bmatrix}\na & b \\\\ \nc & d\n\\end{bmatrix}", -26],
  ["\\begin{Bmatrix}\na & b \\\\ \nc & d\n\\end{Bmatrix}", -26],
]

 const trigonometri = [
  ["\\sin{x}", -1],
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
  ["\\int_{a}^{b}", 0],
  ["\\iint{}", -1],
  ["\\iint_{a}^{b}", 0],
  ["\\iiint{}", -1],
  ["\\iiint_{a}^{b}", 0],
  ["\\oint{}", -1],
  ["\\oint_{a}^{b}", 0],
  ["dx", 0],
  ["dy", 0],
  ["\\partial x", 0],
  ["\\partial y", 0],
  ["d\\theta", 0]
]

const summation = [
  ["\\sum{}", -1],
  ["\\sum_{a}^{n}", 0],
  ["\\sum_{a}", 0],
  ["\\prod{}", 0],
  ["\\prod_{a}^{b}", 0],
  ["\\prod_{a}", 0],
  ["\\amalg{}", -1],
  ["\\amalg_{a}^{b}", 0],
  ["\\amalg_{a}", 0],
  ["\\bigcup{}", -1],
  ["\\bigcup_{a}^{b}", 0],
  ["\\bigcup_{a}", 0],
  ["\\bigcap{}", -1],
  ["\\bigcap_{a}^{b}", 0],
  ["\\bigcap_{a}", 0],
  ["\\bigvee{}", -1],
  ["\\bigvee_{a}^{b}", 0],
  ["\\bigvee_{a}", 0],
  ["\\bigwedge{}", -1],
  ["\\bigwedge_{a}^{b}", 0],
  ["\\bigwedge_{a}", 0],
  ["\\sum_{k}\\binom{n}{k}", 0],
  ["\\sum_{i=0}^{n}", 0],
  ["\\prod_{k=1}^{n}A_k", 0]
]

const exponential_and_roots = [
  ["x^a", 0],
  ["x_a", 0],
  ["x_b^a", -2,],
  ["{_b^a}x", 0],
  ["e^{-i\\omega t}", 0],
  ["x^2", 0],
  ["\\sqrt{x}", -1],
  ["\\sqrt[a]{x}", -1],
  ["\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}", 0],
  ["\\sqrt{a^2+b^2}", 0]
]

const limits_and_log = [
  ["\\log_a{}", -1],  
  ["\\log{}", -1],
  ["\\lim_{x\\to\\infty}", -1],
  ["\\ln{}", -1],
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
  { name: 'Matrix', functions: matrix },
  { name: 'Trigonometry', functions: trigonometri },
  { name: 'Fractions and Binomial', functions: fractions_and_binomial },
  { name: 'Integral', functions: integral },
  { name: 'Summation', functions: summation },
  { name: 'Exponential and Roots', functions: exponential_and_roots },
  { name: 'Log and Limits', functions: limits_and_log },
  { name: 'Accents', functions: accent },
]

export default functions;
