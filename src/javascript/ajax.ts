function clearData(savedData) {
    for (let i = 0; i < savedData.length; i++){
        localStorage.removeItem(savedData[i])
    }
    showSavedData()

}

function login (){

    let firstRequest = new XMLHttpRequest

    let username, password

    firstRequest.onreadystatechange = function() {
        if (firstRequest.readyState == XMLHttpRequest.DONE && firstRequest.status == 200) {
            uploadData()
        } else if (firstRequest.readyState == XMLHttpRequest.DONE) {
            showModal("login-modal")
            // add event listener to "login button"
            let secondRequest = new XMLHttpRequest

            secondRequest.onreadystatechange = function() {
                if (secondRequest.readyState == XMLHttpRequest.DONE && secondRequest.status == 200) {
                    uploadData()
                }
            }
            document.getElementById("submit-login").addEventListener("click", function(e: MouseEvent){
                let credFormData = new FormData(document.getElementById("login-form") as HTMLFormElement)
                secondRequest.open("POST","/login")
                secondRequest.send(credFormData)
                closeModal()
            }
            )
        }
    }

    firstRequest.open("POST", "/login")
    firstRequest.send(null)
}

function uploadData() {
    let uploadRequest = new XMLHttpRequest
    uploadRequest.open("POST", "/save")

    let results: Array<string> = new Array<string>()
    //get all rows
    let numRows = localStorage.length
    results.push("[")
    for (let i = 0; i< numRows; i++) {
        var val = localStorage.getItem(localStorage.key(i))
        results.push(val)
        if (i < numRows-1){
            results.push(",")
        }
    }
    results.push("]")

    var resultString = results.join("")

    uploadRequest.onreadystatechange = function(){
        if (uploadRequest.readyState == XMLHttpRequest.DONE && uploadRequest.status == 200) {
            let results = JSON.parse(uploadRequest.responseText)
            console.log(results)
            if (results.Saved != null) {
                clearData(results.Saved)
            }

            if (results.Unsaved != null) {
                alert("a number of data elements were not saved, presumably because they have overlapping survey IDs")
            }
        }
    }
    uploadRequest.send(resultString)
}

function handleUpload(){
    if (!navigator.onLine){
        alert("you are not online right now\n\nTry connecting to the internet and trying again.")
        return
    }
        
    login()
}
