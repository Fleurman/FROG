var hookedProperty = function(fn,key,value) {
    "use strict"
    let prop = value;
    Object.defineProperty(this,key,{
        set: (v)=>{
            prop = v;
            fn(v);
        },
        get:()=>{
            return prop;
        }
    });
};
var immutableProperty = function(key,value) {
    Object.defineProperty(this,key,{
        get:()=>{
            return value;
        }
    });
};