import { MathMLToLaTeX } from 'mathml-to-latex';

const semanticsSelector = "#latex-container span span span.katex-mathml math semantics";

function getChildrenWithSymbol(root, code, list) {
    for (let i = 0; i < root.children.length; i++) 
    {
        const child = root.children[i]
        if (child.children.length == 0) //Is a text element
        {
            //const outerHTML = "<math>" + "<" + child.nodeName + ">"  + child.innerHTML + "</" + child.nodeName + ">" + "</math>";
            const outerHTML = "<math>" + child.outerHTML + "</math>";
            if (MathMLToLaTeX.convert(outerHTML) == code)
                list.push(child);
        }

        getChildrenWithSymbol(child, code, list);
    }

    return list;
}

function getMathMLElementsByCode(code) 
{
    let semantics = document.querySelector("#latex-container span span span.katex-mathml math semantics");
    if (semantics == null) //No eqution being shown.
        return [];

    return getChildrenWithSymbol(semantics, code, []);
}

export {getMathMLElementsByCode, semanticsSelector};