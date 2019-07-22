if (!String.prototype.replaceParams) {
    String.prototype.replaceParams = function() {
        // console.log('REP PARAM',this);
        return this.replace(/(\$([^ ]+))/g,function(s,m,p){
            return UrlHash.get(p) || "";
        });
    };
}