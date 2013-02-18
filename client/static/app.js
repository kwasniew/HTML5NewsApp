/*global console:true Downloader:true PubSub:true Offline:true */
;(function(window, undefined){
    "use strict";

    function App(){

    }

    App.prototype.start = function () {
        console.log("Start!");

        var title = document.createElement('h1');

        this.offline = new Offline();

        this.downloader = new Downloader();
        //this.downloader.start();

        PubSub.subscribe( "downloaded:articles", showArticles );
        PubSub.subscribe( "show:articles", showArticles );

        PubSub.publish( 'get:articles' );


        window.downloader = this.downloader;

    };

    function showArticles(name, articles){
        console.log('downloaded:articles', arguments);
        var entry, img, h2, div, text;
        var articlesList = articles;

        var len = articlesList.length;
        for (var i = len - 1; i >= 0; i--) {

            entry = articlesList[i];

            img = new Image();
            img.onload = entry.img;
            img.src = entry.img;
            div = document.createElement('div');
            h2 = document.createElement('h2');
            h2.innerHTML = entry.title;
            div.appendChild(h2);
            div.appendChild(img);

            text = document.createElement('div');
            text.innerHTML = entry.bodytext;

            div.appendChild(text);

            document.body.appendChild(div);

        }

    }

    window.App = App;

})( window );