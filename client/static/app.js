/*global console:true Downloader:true PubSub:true Offline:true Show:true */
;(function(window, undefined){
    "use strict";

    function App(){
        console.log("Start!");

        this.offline = new Offline();
        this.downloader = new Downloader();
        this.show = new Show();

        PubSub.publish( 'get:articles' );

        window.downloader = this.downloader;
    }

    window.App = App;

})( window );