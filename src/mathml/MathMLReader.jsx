import { MathMLToLaTeX } from 'mathml-to-latex';
import { symbol } from 'prop-types';
import React from "react";
import symbols from '../Symbols';

class MathHTMLComponent extends React.Component
{
    render() {
        console.log(this.props)
        const style = 
        {
            minWidth: this.props.w + "px",
            minHeight: this.props.h + "px",
            left: this.props.x + "px",
            top: this.props.y + "px"
        }

        return (
            <div className='MathHTMLComponent' style={style} key={this.props.key}></div>
        )
    }
}

const semanticsSelector = "#latex-container span span span.katex-mathml math semantics";
let mathMLList = []
let mathHTMLComponents = []

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

function getChildrenWithInterpreter(root, list, interpreter, ...args)
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

        getChildrenWithInterpreter(child, list, interpreter, args);
    }

    return list;
}

function getAllMathMLElements()
{
    const semantics = document.querySelector("#root span span span.katex-mathml semantics");
    if (semantics == null) //No eqution being shown.
        return [];

    return getChildrenWithInterpreter(semantics, [], (child) => 
    {
        const ignoreList = [
            "mrow",
            "annotation",
            "mstyle"
        ]

        if (ignoreList.includes(child.tagName))
            return null

        return child
    });
}

function getMathMLElementsByCode(code) 
{
    const semantics = document.querySelector("#latex-container span span span.katex-mathml semantics");
    if (semantics == null) //No eqution being shown.
        return [];

    return getChildrenWithInterpreter(semantics, [], mathMLToLatexInterpreter, code);
}

function getAllSpanElements() 
{
    const base = document.querySelector("#latex-container span span span.katex-html span");
    if (base == null) //No eqution being shown.
        return [];

    const list = getChildrenWithInterpreter(base, [], (child) => 
    {
        const text = child.textContent.replace(/\u200B/g,'') // Removes big funny whitespace chars
        if (child.children.length == 0 && text != "")
        {
            //console.log("code: " + child.textContent.charCodeAt(0) + ": " + child.textContent)
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
    const list = getChildrenWithInterpreter(base, [], mathMLToSpanInterpreter)
    return list;
}

let startAA;

function createMathHTMLComponent(element, index)
{
    //const outerHTML = "<math>" + child.outerHTML + "</math>";        
    const code = MathMLToLaTeX.convert("<math><mi>" + element.textContent + "</mi></math>"); //Bruh
    //console.log(code)
    //const textContent = "\\pi"
    let startStringIndex = laTeXString.indexOf(code)
    let endStringIndex = -1
    //console.log("AA: " + startAA)
    if (startStringIndex > -1)
    {
        startStringIndex += startAA;
        endStringIndex = code.length + startStringIndex
        startAA += code.length
        laTeXString = laTeXString.substring(code.length)
    }

    //console.log("start: " + startStringIndex)
    //console.log("end: " + endStringIndex)
    let rect = element.getBoundingClientRect();
    const e = <MathHTMLComponent 
    w = {rect.right - rect.left}
    h = {rect.bottom - rect.top} 
    x = {window.scrollX + rect.left}
    y = {window.scrollY + rect.top} 
    key={index}
    textContent = {element.textContent}
    startIndex = {startStringIndex}
    endIndex = {endStringIndex}
    code={code} />

    mathHTMLComponents.push(e)
    return (
        e
    )
}

/*
    {
        [
            "w"= w, 
            "h"= h, 
            "x"= x, 
            "y"= y,
            "key"= index,
            "textContent"= element.textContent,
            "startIndex"= startStringIndex, "endIndex"= endStringIndex,
            "code"= code
        ]
    }/>
    */

function getAllMathHTMLComponents()
{
    return mathHTMLComponents;
}

let laTeXString = ""

function renderMathHTMLComponents(string)
{
    mathHTMLComponents = []
    laTeXString = string
    startAA = 0;
    return (
        <div className='MathHTMLComponents'>
            { getAllSpanElements().map(createMathHTMLComponent) }
        </div>
    )
}

export {getMathMLElementsByCode, getSpanElementsByCode, getAllSpanElements, semanticsSelector, 
    renderMathHTMLComponents, getAllMathHTMLComponents};