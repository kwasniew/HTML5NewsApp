/*global console:true Downloader:true PubSub:true Offline:true Show:true Model:true */

(function(window, undefined){
    "use strict";

    function Model(){
        console.log("Start!");

        this.model = new Model();
        this.show = new Show();

        this.model.getArticles();
        this.show.showArticles();

        window.downloader = this.downloader;
    }



    window.Model = Model;

})( window );