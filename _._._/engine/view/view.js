
importScript(__("view/lib/flow.js"));

importScript(__("view/lib/gadget.js"));

importScript(__("view/lib/insert.js"));


function doGadgets(){
  processGadgets();
  processInserts();
}

function doFlows() {
  let flows = document.querySelectorAll("[frog]");
  for(let i = 0; i<flows.length; i++){
    let el = flows[i];
    new Flow(el);
  }
}