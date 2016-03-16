var formObjects = ["surveyid", "surveyor-name", "batey", "house-number", "q1", "q1-other", "q1a", "q1a-other", "q2", "q2-mins", "q3", "q4", "q5", "q5-other", "q6", "q6-other", "q7", "q8", "q8-number", "q9", "q9-other", "q10", "q10a", "q10a-other", "comments"];
function getCheckboxValue(question) {
    var values = new Array();
    for (var i = 0; i < question.length; i++) {
        if (question[i].checked == true) {
            values.push(question[i].value);
        }
    }
    return values.join(", ");
}
function gatherEntryFormData(form) {
    var data = new Array();
    var newID = form.elements["surveyid"].value;
    for (var i = 0; i < formObjects.length; i++) {
        var currKey = formObjects[i];
        if (currKey == "q5") {
            var newDatum = new datum(currKey.toString(), getCheckboxValue(form.elements[currKey]));
            data.push(newDatum);
        }
        else {
            var newDatum = new datum(currKey.toString(), form.elements[currKey].value.toString());
            data.push(newDatum);
        }
    }
    var newRow = new row(newID, data);
    return newRow;
}
var lastBatey;
var lastSurveyor;
function saveEntryForm(e) {
    var currentForm = document.getElementById("entry-form");
    var newRow = gatherEntryFormData(currentForm);
    var newRowString = JSON.stringify(newRow);
    if (!window.localStorage) {
        alert("your device is not supported\n\n or you are in 'pivate' mode");
    }
    localStorage.setItem(newRow.id.toString(), newRowString);
    var currForm = currentForm;
    lastBatey = currForm.elements["batey"].value;
    lastBatey = currForm.elements["surveyor-name"].value;
    currForm.reset();
    currForm.elements["batey"].value = lastBatey;
    currForm.elements["surveyor-name"].value = lastSurveyor;
    closeModal();
    showSavedData();
}
var controlledForm = document.getElementById("entry-form");
var formElems = controlledForm.elements;
