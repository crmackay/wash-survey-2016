var datum = (function () {
    function datum(k, v) {
        this.key = k;
        this.value = v;
    }
    return datum;
}());
var row = (function () {
    function row(id, data) {
        this.id = id;
        this.data = data;
    }
    row.prototype.makeStatic = function () { };
    row.prototype.save = function () {
        var isSaved = false;
        if (!window.localStorage) {
            alert("your browser does not support local storage, or you are in \"private mode\"");
            isSaved = false;
        }
        else {
            try {
                localStorage.setItem(String(this.id), JSON.stringify(this.data));
            }
            catch (err) {
                alert(err);
                isSaved = false;
            }
            isSaved = true;
        }
        this.makeStatic();
        return isSaved;
    };
    row.prototype.delete = function () {
    };
    return row;
}());
function uploadDataset(d, endpoint) {
    return true;
}
function escapeHTMLStr(s) {
    var newString;
    for (var i = 0; i < s.length; i++) {
    }
}
function escapeHTMLChar(s, forAttribute) {
    var MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
}
function loadDataset() { }
function skipLogic() { }
function authenticate() { }
function testAPIConn() { }
