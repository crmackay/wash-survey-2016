class datum {
    key: string;
    value: string;

    constructor(k: string, v: string){
        this.key = k;
        this.value = v;
    }
}

class row {
    id: number;
    data: datum[];

    constructor(id: number, data: datum[]){
        this.id = id;
        this.data = data
    }
    makeStatic(){}
    save(): boolean {
        let isSaved: boolean = false;
        // update row in localstorage
        // insert/update row into dom as a saved row
        if (!window.localStorage) {
            alert("your browser does not support local storage, or you are in \"private mode\"");
            isSaved = false;
        } else {
            try {
                localStorage.setItem(String(this.id), JSON.stringify(this.data));
            } catch(err) {
                alert(err);
                isSaved = false;
            }
            isSaved = true;
        }

        this.makeStatic()

        return isSaved;
    }

    delete(){
        // remove row from localstorage
        // remove row from DOM
    }
}

function uploadDataset(d: row[], endpoint: string): boolean{

    // make PUT request to API endpoint
    // handle errors
    return true;
}

function escapeHTMLStr(s: string){
    let newString: string;
    for(let i = 0 ; i < s.length; i++){
        // escapeHTMLChar(s[i]);
    }
}

function escapeHTMLChar (s: string, forAttribute) {
    var MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    // return s.replace(forAttribute ? /[&<>'"]/g : /[&<>]/g, function(c) {
    //     return MAP[c];
    // });
}

function loadDataset(){}

function skipLogic(){}

// authenticate the user to verify they can upload data
function authenticate(){}

// create a connection to the API endpoint, to verify internet is working (HTTP HEAD request)
function testAPIConn(){}
