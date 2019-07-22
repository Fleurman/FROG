var FuturePool = function(){
    
    EventListen.call(this);
    
    let count = 0;
    let doneFn = ()=>{};
    let timeout;

    this.add = function(fut){
        if(!(fut instanceof Future)){return;}
        count++;
        fut.addEventListener('value',()=>{
            count--;
            testDone();
        })
        return this;
    };

    this.done = function(fn){
        this.add = ()=>{};
        doneFn = fn;
        testDone.bind(this)();
    };

    let testDone = function(){
        if(count == 0){
            clearTimeout(timeout);
            doneFn();
        }
    }

    this.clearTimeout = function(){
        clearTimeout(timeout);
    };
    this.setTimeout = function(ms,fn,stop=false){
        this.clearTimeout();
        setTimeout(()=>{
            if(stop){doneFn = ()=>{};}
            fn();
        },ms)
        return this;
    };

}