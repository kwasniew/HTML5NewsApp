/*global console:true $:true Swipe:true */

(function(window, undefined){
    "use strict";

    function View(){
        console.log("Start!");
    }

    View.prototype.registerImageDownload = function(notifyImageDownloader) {
        $('#saveForOffline').on('click', notifyImageDownloader);
        $('#saveForOffline').on('tap', notifyImageDownloader);
        $('body').swipeDown(notifyImageDownloader);
    };

    View.prototype.registerClearDB = function(notifyClear) {
        $('#clearOffline').on('click', notifyClear);
        $('#clearOffline').on('tap', notifyClear);
    };

    View.prototype.showArticles = function(articles){
        console.log('View:thenViewArticles', arguments);
        View.prototype.viewArticles('then', articles);
    };

    View.prototype.showError = function(articles){
        var h1 = document.createElement('h1');
        h1.className = 'alert alert-error';
        h1.innerText = "no articles, check internet connection";
        document.body.appendChild(h1);
    };


    function clickOnArticle(e){
        /*jshint validthis:true */

        window.location.hash= '';

        window.mySwipe.slide(parseInt(this.getAttribute('data-id'), 10), 1000);
    }

    View.prototype.viewArticles = function(name, articles){
        console.log('View:viewArticles', arguments);
        var entry, img, h2, div, text, footer, date;
        var articlesList = articles;

        var len = articlesList.length;
        var listEl = document.querySelector('.articleList');

        var container = document.querySelector('.container-fluid');
        var viewport = document.querySelector('.viewport');

        for (var i =0; i < len; i++) {

            entry = articlesList[i];

            div = document.createElement('div');
            //div.className = "media well";
            //div.className = "well";

            img = new Image();
            img.onload = entry.img;
            img.src = entry.base ? entry.base : entry.img;
            //img.className = 'media-object';

            h2 = document.createElement('h2');
            h2.innerHTML = entry.title;
            //h2.className = 'media-heading';

            text = document.createElement('div');
            text.innerHTML = entry.bodytext;

            footer = document.createElement('footer');
            date = entry.published.split('T')[0] ?
                entry.published.split('T')[0] : entry.published;
            footer.innerText = 'Published: ' + date;

            //text.className = 'media-body';

            div.appendChild(h2);
            div.appendChild(img);
            div.appendChild(footer);

            var frontArticle = div.cloneNode(true);
            frontArticle.setAttribute('class', 'container-fluid');
            frontArticle.setAttribute('data-id', i+1);
            frontArticle.addEventListener('click', clickOnArticle, false);
            listEl.appendChild(frontArticle);

            //div = div.cloneNode(true);
            div.appendChild(text);



            var secondScreen = container.cloneNode(true);
            secondScreen.style.display = 'none';// = 'display:none;';

            secondScreen.querySelector('.row-fluid').replaceChild(div, secondScreen.querySelector('.articleList'));
            //secondScreen.id = i+1;
            viewport.appendChild(secondScreen);

        }


        window.mySwipe = new Swipe(document.getElementById('swipe'), {
            startSlide: 0,
            speed: 400,
            auto: false,
            callback: function(event, index, elem) {

                //window.location.hash = index;
              // do something cool
              //window.onresize();

            }
        });

        $('#homepage').click(function(e){
            e.preventDefault();

            window.mySwipe.slide(0, 1000);
            //window.location.hash = 'wrap';
        });

    };

    window.View = View;

})(window);