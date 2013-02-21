/*global console:true, $:true, Download:true  */

(function (window, undefined) {
    "use strict";

    function Crawler(){

        this.download = new Download();
    }

    Crawler.prototype.getArticles = function(){
        return this.download.getArticles();
    };


    window.Crawler = Crawler;

})( window );