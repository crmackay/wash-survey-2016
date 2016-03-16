let formObjects:string[] = ["surveyid", "surveyor-name", "batey", "house-number", "q1", "q1-other", "q1a", "q1a-other", "q2", "q2-mins", "q3", "q4", "q5", "q5-other", "q6", "q6-other", "q7", "q8", "q8-number", "q9", "q9-other", "q10", "q10a", "q10a-other", "comments"]

// for every name in formObjects, get it value from doc.[...]form.elements[""].value
    // this works except for checked boxs?

// put into a json object, with key of the form ID

// save json object into the database, and then update the page view, and the number badge



function getCheckboxValue(question): string {
    let values: Array<string> = new Array<string>();
    for (let i =0; i <question.length; i++){
        if (question[i].checked == true){
            values.push(question[i].value)
        }
    }
    return values.join(", ")
}


function gatherEntryFormData(form): row {
    let data: Array<datum> = new Array<datum>();

    let newID = form.elements["surveyid"].value

    for (let i = 0; i < formObjects.length; i++ ) {
        let currKey = formObjects[i]
        console.log(currKey)

        if (currKey == "q5") {
            var newDatum = new datum(currKey.toString(), getCheckboxValue(form.elements[currKey]))
            data.push(newDatum)

        } else {
            console.log(currKey)
            var newDatum = new datum(currKey.toString(), form.elements[currKey].value.toString())
            data.push(newDatum)

        }
        //if q5 use getCheckboxValue()
    }


    var newRow = new row(newID, data)
    return newRow
}

let lastBatey: string
let lastSurveyor: string

function saveEntryForm(e){
    var currentForm = document.getElementById("entry-form")
    var newRow = gatherEntryFormData(currentForm)
    var newRowString = JSON.stringify(newRow)
    if (!window.localStorage){
        alert("your device is not supported\n\n or you are in 'pivate' mode")
    }
    localStorage.setItem(newRow.id.toString(), newRowString);
    var currForm = currentForm as any
    lastBatey = currForm.elements["batey"].value
    lastBatey = currForm.elements["surveyor-name"].value
    currForm.reset()
    currForm.elements["batey"].value = lastBatey
    currForm.elements["surveyor-name"].value = lastSurveyor
    closeModal();
    showSavedData();
}

let controlledForm = document.getElementById("entry-form") as HTMLFormElement

let formElems = controlledForm.elements
//
// for (let i =0; i< formElems.length; i++) {
//     let elem = formElems[formObjects[i]]
//     console.log(elem)
//     if (elem != null){
//
//         if (elem.length > 1){
//             console.log(elem[i])
//             for (let j = 0; j < elem[i].length; j++){
//                 elem[j].addEventListener("change", formHandlers[elem[j].id])
//             }
//         }else {
//             elem.addEventListener("change", formHandlers[elem.id])
//         }
//     }
//
// }
