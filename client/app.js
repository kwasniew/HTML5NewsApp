/*global console:true Downloader:true  */
;(function(window, undefined){
    "use strict";

    function App(){

    }

    App.prototype.start = function () {
        console.log("Start!");

        var title = document.createElement('h1');
        title.innerText = 'Hello World!';
        document.body.appendChild(title);

        this.downloader = new Downloader();
        this.downloader.start();

        window.downloader = this.downloader;

    };

    window.App = App;

})( window );