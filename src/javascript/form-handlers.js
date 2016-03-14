function disableFormElem(e) {
    if (Array.isArray(e)) {
        for (var i = 0; i < e.length; i++) {
            e[i].disabled = true;
            e[i].value = null;
        }
    }
    else {
        e.disabled = true;
        e.value = null;
    }
}
function skip(s) {
    var form = document.getElementById("entry-form");
    var elem = form.elements[s];
    disableFormElem(elem);
}
var formHandlers = {
    "q1": function (e) {
        if (e.value === "pipe-dwelling" || e.value === "pipe-plot") {
            skip("q1-other");
            skip("q1a");
            skip("q1a-other");
            skip("q2");
            skip("q2-mins");
            skip("q3");
        }
        else if (e.value == "bottle") {
            skip("q1a-other");
        }
        else if (e.value != "other") {
            skip("q1-other");
            skip("q1a");
            skip("q1a-other");
        }
    },
    "q1a": function (e) {
        if (e.value === "pipe-dwelling" || e.value === "pipe-plot") {
            skip("q1a-other");
            skip("q2");
            skip("q2-mins");
            skip("q3");
        }
        else if (e.value != "other") {
            skip("q1a-other");
        }
    },
    "q2": function (e) {
        if (e.value == "on-premisis") {
            skip("q3");
        }
    },
    "q4": function (e) {
        if (e.value == "no" || e.value == "does-not-know") {
            skip("q5");
            skip("q5-other");
        }
    },
    "q5": function (e) {
        if (e.value != "other") {
            skip("q5-other");
        }
    },
    "q6": function (e) {
        if (e.value != "other") {
            skip("q6-other");
        }
        if (e.value == "bush") {
            skip("q7");
            skip("q8");
            skip("q8-number");
        }
    },
    "q7": function (e) {
        if (e.value == "no") {
            skip("q8");
            skip("q8-number");
        }
    },
    "q8": function (e) {
        if (e.value != "share") {
            skip("q8-number");
        }
    },
    "q9": function (e) {
        if (e.value != "other") {
            skip("q9-other");
        }
    },
    "q10": function (e) {
        if (e.value == "yes") {
            skip("q10a");
            skip("q10a-other");
        }
    }
};
