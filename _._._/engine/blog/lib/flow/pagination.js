var PaginationLink = function PaginationLink(flow,page,char) {
	
	page = Math.max(0,Math.min(flow.pages,page));

	let el = document.createElement("span");

	el.innerHTML = char;

	if(page != flow.page){
		el.addEventListener("click",() => {
			flow.goToPage(page);
		});
		el.className = "a";
	}

	return el;

};

var pageLinks = function(el,flow){

	let max = flow.pages;
	let cont = document.createElement("span");
	let top = max > 9 ? 9 : max;
	let p = Math.min(flow.page,max);
	let off = p > 4 ? Math.min(max-8,p-4) : 0;
	for(let i = 0; i<top+1; i++){
		cont.appendChild(createPageLink(el,off+i));
	}
	return cont;

};

var Pagination = function Pagination(flow,template = false) {
	
	let nav = document.createElement("nav");
	nav.className = "frog-pagination";
	nav.goToPage = flow.goToPage;

	nav.appendChild(new PaginationLink(flow,0,"&lt;&lt;"));

	nav.appendChild(new PaginationLink(flow,flow.page-1,"&lt;"));

	for (let id = 0; id <= flow.pages; id++) {
		
		nav.appendChild(new PaginationLink(flow,id,""+(id+1)));

	}

	nav.appendChild(new PaginationLink(flow,flow.page+1,"&gt;"));

	nav.appendChild(new PaginationLink(flow,flow.pages,"&gt;&gt;"));

	return nav;

}