function clearData(savedData) {
    for (var i = 0; i < savedData.length; i++) {
        localStorage.removeItem(savedData[i]);
    }
    showSavedData();
}
function login() {
    var firstRequest = new XMLHttpRequest;
    var username, password;
    firstRequest.onreadystatechange = function () {
        if (firstRequest.readyState == XMLHttpRequest.DONE && firstRequest.status == 200) {
            uploadData();
        }
        else if (firstRequest.readyState == XMLHttpRequest.DONE) {
            showModal("login-modal");
            var secondRequest_1 = new XMLHttpRequest;
            secondRequest_1.onreadystatechange = function () {
                if (secondRequest_1.readyState == XMLHttpRequest.DONE && secondRequest_1.status == 200) {
                    uploadData();
                }
            };
            document.getElementById("submit-login").addEventListener("click", function (e) {
                var credFormData = new FormData(document.getElementById("login-form"));
                secondRequest_1.open("POST", "/login");
                secondRequest_1.send(credFormData);
                closeModal();
            });
        }
    };
    firstRequest.open("POST", "/login");
    firstRequest.send(null);
}
function uploadData() {
    var uploadRequest = new XMLHttpRequest;
    uploadRequest.open("POST", "/save");
    var results = new Array();
    var numRows = localStorage.length;
    results.push("[");
    for (var i = 0; i < numRows; i++) {
        var val = localStorage.getItem(localStorage.key(i));
        results.push(val);
        if (i < numRows - 1) {
            results.push(",");
        }
    }
    results.push("]");
    var resultString = results.join("");
    uploadRequest.onreadystatechange = function () {
        if (uploadRequest.readyState == XMLHttpRequest.DONE && uploadRequest.status == 200) {
            var results_1 = JSON.parse(uploadRequest.responseText);
            console.log(results_1);
            if (results_1.Saved != null) {
                clearData(results_1.Saved);
            }
            if (results_1.Unsaved != null) {
                alert("a number of data elements were not saved, presumably because they have overlapping survey IDs");
            }
        }
    };
    uploadRequest.send(resultString);
}
function handleUpload() {
    if (!navigator.onLine) {
        alert("you are not online right now\n\nTry connecting to the internet and trying again.");
        return;
    }
    login();
}
