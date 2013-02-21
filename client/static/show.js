/*global console:true */

(function(window, undefined){
    "use strict";

    function Show(){
        console.log("Start!");
    }

    Show.prototype.thenShowArticles = function(articles){
        console.log('Show:thenShowArticles', arguments);
        Show.prototype.showArticles('then', articles);
    };

    Show.prototype.showArticles = function(name, articles){
        console.log('Show:showArticles', arguments);
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

    };

    window.Show = Show;

})(window);