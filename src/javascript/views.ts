// function displayEditableRow(r: row): string{
//     let template: string = `
//         <tr>
//             <td content="editable">${escapeHTMLStr(String(r.id))}</td>`
//
//     for (let i = 0; i < r.data.length; i++) {
//         template += `<td content="editable">{escapeHTMLStr(${r.data[i]})}</td>`
//     }
//
//     template += "</tr>"
//
//     return template
// }
//
// function displaySavedRow(r: row): string {
//     let tmpl: string = ""
//     return tmpl
// }
//
// function displayStoredData(): string {
//     return("this is a test");
// }
// modal logic below

    // global variable holding the one currently open modal
let openModalID = ""
let openModals =[]

function dimPage(){
    document.getElementById("dimmer").classList.remove("hide")
}

function undimPage(){
    document.getElementById("dimmer").classList.add("hide")
}

function closeModal() {
    if (openModals.length > 0){
        hide(openModals[openModals.length-1])
        openModals.pop()

    }
    if (openModals.length ==0) {
        undimPage()
    } else {
        unhide(openModals[openModals.length-1])
    }

}

function hide(m){
    document.getElementById(m).classList.add("hide")
}


function unhide(m){
    document.getElementById(m).classList.remove("hide")
}

function showModal(m){
    if (openModals.length > 0){
        hide(openModals[openModals.length - 1])
    }

    openModals.push(m)
    dimPage()

    var currModel = document.getElementById(m)
    currModel.getElementsByClassName("close-button")[0].addEventListener("click", closeModal)
    currModel.classList.remove("hide")
    currModel.classList.add("pos-absolute")
    currModel.scrollTop = 0
}

function renderRowLabels(r):string {
    let result = "<tr>"
    for (let i = 0; i < formObjects.length; i++){
        result += "<th>"
        result += formObjects[i]
        result += "</th>"
    }

    let newObj = JSON.parse(r)
    for (let i = 0 ; i< newObj.data.length; i++){
        result += "<th>"
        result += newObj.data[i].key.toString()
        result += "</th>"
    }
    return result+"</tr>"
}

function renderSavedRow(r):string {
    let newObj = JSON.parse(r)
    let result = "<tr>"
    for (let i = 0 ; i< newObj.data.length; i++){
        result += "<td>"
        result += newObj.data[i].value.toString()
        result += "</td>"
    }
    return result+"</tr>"
}

function showSavedData(): void {
    let results: Array<string> = new Array<string>()
    //get all rows
    results.push("<table>")
    let numRows = localStorage.length

    if (numRows > 0) {
        var nextRow = localStorage.getItem(localStorage.key(0))
        results.push(renderRowLabels(nextRow))
    }

    for (let i = 0; i< numRows; i++) {
        var nextRow = localStorage.getItem(localStorage.key(i))
        results.push(renderSavedRow(nextRow))
    }
    results.push("</table>")

    var resultString = results.join("")

    document.getElementById("saved-data-table").innerHTML = resultString
    document.getElementById("badge").innerHTML = numRows.toString()
}

document.getElementById("addRecord").addEventListener("click", function(){showModal("entry-form-modal")})

document.getElementById("btn-upload").addEventListener("click",
    function(){
        showModal("upload-modal")
        handleUpload()
        closeModal()
    }
)

document.getElementById("entry-form-save").addEventListener("click", saveEntryForm)
showSavedData()
