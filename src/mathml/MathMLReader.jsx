import { MathMLToLaTeX } from 'mathml-to-latex';
import { symbol } from 'prop-types';

const semanticsSelector = "#latex-container span span span.katex-mathml math semantics";
let mathMLList = []

function mathMLToLatexInterpreter(child, code)
{
    if (child.children.length != 0)
        return null;

    const outerHTML = "<math>" + child.outerHTML + "</math>";        
    if (MathMLToLaTeX.convert(outerHTML) == code)
        return child;

    return null
}

function mathMLToSpanInterpreter(child)
{
    if (mathMLList.length == 0 || child.children.length != 0)
        return null;

    if (child.textContent == mathMLList[0].textContent)
    {
        mathMLList.shift();
        return child;
    }
    return null;
}

function getChildrenWithSymbol(root, list, interpreter, ...args)
{
    for (let i = 0; i < root.children.length; i++) 
    {
        const child = root.children[i]
        //if (child.children.length == 0) //Is a text element
        {
            const result = interpreter(child, args)
            if (result != null)
                list.push(result)
        }

        getChildrenWithSymbol(child, list, interpreter, args);
    }

    return list;
}

function getMathMLElementsByCode(code) 
{
    const semantics = document.querySelector("#latex-container span span span.katex-mathml semantics");
    if (semantics == null) //No eqution being shown.
        return [];

    return getChildrenWithSymbol(semantics, [], mathMLToLatexInterpreter, code);
}

function getAllSpanElements() 
{
    const base = document.querySelector("#latex-container span span span.katex-html span");
    if (base == null) //No eqution being shown.
        return [];

    const list = getChildrenWithSymbol(base, [], (child) => 
    {
        const text = child.textContent.replace(/\u200B/g,'') // Removes big funny whitespace chars
        if (child.children.length == 0 && text != "")
        {
            console.log("code: " + child.textContent.charCodeAt(0) + ": " + child.textContent)
            return child;
        }

        return null
    });
    return list;
}

function getSpanElementsByCode(code) 
{
    const base = document.querySelector("#latex-container span span span.katex-html span");
    if (base == null) //No eqution being shown.
        return [];

    mathMLList = getMathMLElementsByCode(code); //Slow and stupid
    const list = getChildrenWithSymbol(base, [], mathMLToSpanInterpreter)
    return list;
}

export {getMathMLElementsByCode, getSpanElementsByCode, getAllSpanElements, semanticsSelector};