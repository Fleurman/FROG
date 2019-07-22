var Cache = (()=>{

    var o = {};

    var table = {};

    o.get = (key) => {
        return table[key];
    };

    o.set = (key,value) => {
        table[key] = value;
        addRecord(key,value);
    };

    o.has = (key) => {
        return table[key] ? true : false;
    };

    let load = () => {
        for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i);
            table[key] = window.sessionStorage.getItem(key);
        }
    };
    let addRecord = (key,value) => {
        let i = 0;
        while(true){
            try {
                window.sessionStorage.setItem(key,value);
                break;
            } catch (e) {
                let id = window.sessionStorage.key(i++);
                window.sessionStorage.removeItem(id);
            }
        }
    };

    window.addEventListener('load',load);

    return o;

})();