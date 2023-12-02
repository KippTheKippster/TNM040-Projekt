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
            <div className='MathHTMLComponent' style={style}></div>
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
        
    return getChildrenWithInterpreter(math, [math], (child) => 
    {
        const ignoreList = [
            "annotation",
            "mstyle",
        ]

        if (child.children.length == 0 || ignoreList.includes(child.tagName))
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

    const list = getChildrenWithInterpreter(mjxMath, [[mjxMath, mathMLElements.shift()]], (child, mathMLElements) =>
    {
        const mjxTag = child.tagName;
        if (mjxTag == "MJX-C")
            return [child, null]
        
        if (mathMLElements.length == 0)
            return null;

        const mlTag = "MJX-" + mathMLElements[0].tagName.toUpperCase()
        if (mjxTag == mlTag)
        {
            const element = mathMLElements.shift()
            return [child, element]
        }

        return null
    }, mathMLElements)

    return list;
}

let startAA;

function addMathTHMLComponentToTree(root, list)
{
    if (root.tagName == "MJX-MERROR")
        return null

    for (let i = 0; i < root.childrenLength; i++) 
    {
        if (list.length == 0)
            return null

        const child = createMathHTMLComponent(list.shift(), 0)
        if (root.flipChildren == true)
            root.children.unshift(child)
        else    
            root.children.push(child)

        child.parent = root
        addMathTHMLComponentToTree(child, list)
    }

    return root
}

function createMathHTMLComponent(element)
{
    //const outerHTML = "<math>" + child.outerHTML + "</math>";   
    let text = "";
    let code = "";
    const mjxElement = element[0]
    const mathMLElement = element[1]
    if (mjxElement.tagName == "MJX-C")
    {
        text = getComputedStyle(mjxElement, ':before').getPropertyValue('content').replaceAll('"', "")
        code = MathMLToLaTeX.convert("<math><mi>" + text + "</mi></math>"); //Bruh
    }

    let startStringIndex = laTeXString.indexOf(code)
    let endStringIndex = -1
    if (startStringIndex > -1)
    {
        startStringIndex += startAA;
        endStringIndex = code.length + startStringIndex
        startAA += code.length
        laTeXString = laTeXString.substring(code.length)
    }

    let childrenLength = 0
    if (mathMLElement != null)
        childrenLength = mathMLElement.childElementCount 

    let rect = mjxElement.getBoundingClientRect();
    let e = {
        w: rect.right - rect.left,
        h: rect.bottom - rect.top,
        x: window.scrollX + rect.left,
        y: window.scrollY + rect.top,
        textContent: mjxElement.textContent,
        startIndex: startStringIndex,
        endIndex: endStringIndex,
        code: code,
        childrenLength: childrenLength,
        children: [],
        parent: null,
        tagName: mjxElement.tagName,
        flipChildren: true,
        skip: false
    }

    e = changeToTagSpecificSettings(e)

    return (
        e
    )
}

function changeToTagSpecificSettings(element)
{
    switch(element.tagName)
    {
        case("MJX-MROW"):
        {
            element.skip = true
            break
        }
        case("MJX-MFRAC"):
        {
            element.flipChildren = false
            break
        }
        default:
            break;
    }

    return element
}

let laTeXString = ""

function getRootMathHTMLComponent(string)
{
    mathHTMLComponents = []
    laTeXString = string
    startAA = 0;
    let elements = getAllMatchingMjxMathMLElements()
    if (elements.length == 0)
        return

    const root = createMathHTMLComponent(elements.shift())
    const tree = (addMathTHMLComponentToTree(root, elements))
    return tree
}

export {getAllSpanElements, semanticsSelector, getRootMathHTMLComponent};