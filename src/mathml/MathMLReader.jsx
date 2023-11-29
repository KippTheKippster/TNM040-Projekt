import { MathMLToLaTeX } from 'mathml-to-latex';
import { symbol } from 'prop-types';
import React from "react";
import symbols from '../Symbols';
import { encode } from 'punycode';

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

function getChildrenWithInterpreter(root, list, interpreter, ...args)
{
    for (let i = 0; i < root.children.length; i++) 
    {
        const child = root.children[i]
        //if (child.children.length == 0) //Is a text element
        {
            const result = interpreter(child, ...args)
            if (result != null)
                list.push(result)
        }

        getChildrenWithInterpreter(child, list, interpreter, ...args);
    }

    return list;
}

function getAllMathMLElements()
{
    const latexContainer = document.querySelector("#latex-container");
    if (latexContainer == null)
        return [];
    const math = latexContainer.getElementsByTagName("math")[0]
    if (math == null) //No eqution being shown.
        return [];
        
    return getChildrenWithInterpreter(math, [], (child) => 
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

function getAllSpanElements() 
{
    //const base = document.querySelector("#latex-container span span span.katex-html span");//#latex-container span mjx-container mjx-math
    const math = document.querySelector("#latex-container span mjx-container mjx-math");
    if (math == null) //No eqution being shown.
        return [];  

    const list = getChildrenWithInterpreter(math, [], (child) => 
    {
        let text = child.textContent.replace(/\u200B/g,'') // Removes big funny whitespace chars
         if (text != "none")
        {
            //console.log("code: " + child.textContent.charCodeAt(0) + ": " + child.textContent)
            return child;
        }

        return null
    });
    return list;
}

function getAllMatchingMjxMathMLElements()
{
    let mathMLElements = getAllMathMLElements()
    if (mathMLElements == [])
        return [];
    
    const mjxMath = document.querySelector("#latex-container span mjx-container mjx-math");
    if (mjxMath == null)
        return [];

    //console.log(mathMLElements)

    const list = getChildrenWithInterpreter(mjxMath, [], (child, mathMLElements) =>
    {
        if (mathMLElements.length == 0)
            return null;

        const mlTag = "MJX-" + mathMLElements[0].tagName.toUpperCase()
        const mjxTag = child.tagName;
        if (mjxTag == mlTag)
        {
            mathMLElements.shift()
            return child
        }
        return null
    }, mathMLElements)

    console.log(list)

    return list;
}

let startAA;

function createMathHTMLComponent(element, index)
{
    //const outerHTML = "<math>" + child.outerHTML + "</math>";   
    let text = "";
    let code = "";
    if (element.children.length > 0 && element.children[0].tagName == "MJX-C")
    {
        for (let i = 0; i < element.children.length; i++)
        {
            text = getComputedStyle(element.children[i], ':before').getPropertyValue('content').replaceAll('"', "")
            code = MathMLToLaTeX.convert("<math><mi>" + text + "</mi></math>"); //Bruh  TODO FIX!!!!
        }

        return;
    }

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

    console.log(e)

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
    console.log("DJHSOAI")
    return (
        <div className='MathHTMLComponents'>
            { getAllMatchingMjxMathMLElements().map(createMathHTMLComponent) }
        </div>
    )
}

export {getAllSpanElements, semanticsSelector, renderMathHTMLComponents, getAllMathHTMLComponents};