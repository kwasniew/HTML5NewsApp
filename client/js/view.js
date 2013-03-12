/*global console:true $:true Swipe:true SwipeView:true */

(function(window, undefined){
    "use strict";

    function View(type){
        console.log("Start!");
        var types = {
            'default': 'standardRender',
            'swipe': 'swipe',
            'swipeview': 'swipeview'
        };

        type = type || 'default';
        this.type = types[type];
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
        this.viewArticles('then', articles);
    };

    View.prototype.showError = function(articles){
        var h1 = document.createElement('h1');
        h1.className = 'alert alert-error';
        h1.innerText = "no articles, check internet connection";
        document.body.appendChild(h1);
    };

    View.prototype.viewArticles = function(name, articles){
        console.log('View:viewArticles', arguments);

        var pages = this.prepareFrontpageArticles(articles);

        if(this[this.type]){
            this[this.type](pages);
        }

    };



    var clickOnArticle = function(e){
        /*jshint validthis:true */
        var page = parseInt(this.getAttribute('data-id'), 10);
        if(window.mySwipe){
            window.mySwipe.slide(page, 1000);
        }

        if(window.mySwipeView){
            window.mySwipeView.goToPage(page);
        }


    };

    View.prototype.prepareFrontpageArticles = function(articles){
        var len = articles.length;
        var article, img, h2, entry, text, date, footer;

        var pages = [];
        var frontPage = document.createElement('div');
        pages.push(frontPage);

        for (var i =0; i < len; i++) {

            entry = articles[i];

            article = document.createElement('div');
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

            article.appendChild(h2);
            article.appendChild(img);
            article.appendChild(footer);

            var frontArticle = article.cloneNode(true);
            frontArticle.setAttribute('class', 'container-fluid main-page-article');
            frontArticle.setAttribute('data-id', i+1);
            frontArticle.addEventListener('click', clickOnArticle, false);

            frontPage.appendChild(frontArticle);

            //article = article.cloneNode(true);
            article.appendChild(text);

            pages.push(article);

        }

        return pages;
    };



    View.prototype.standardRender = function(pages){

        var len = pages.length;
        var listEl = document.querySelector('.articleList');

        var fronArticles = pages[0];

        listEl.appendChild(pages[0]);


        var container = document.querySelector('.container-fluid');
        var viewport = document.querySelector('.viewport');

        for (var i = 1; i < len; i++) {

            var secondScreen = container.cloneNode(true);
            if(this.type === 'swipe'){
                secondScreen.style.display = 'none';// = 'display:none;';
            }


            secondScreen.querySelector('.row-fluid').replaceChild(pages[i], secondScreen.querySelector('.articleList'));

            viewport.appendChild(secondScreen);
        }
    };


    View.prototype.timelineRender = function(pages){

        var len = pages.length;
        var listEl = document.querySelector('.articleList');

        var fronArticles = pages[0];

        listEl.appendChild(pages[0]);


        var container = document.querySelector('.container-fluid');
        var viewport = document.querySelector('.viewport');

        for (var i = 1; i < len; i++) {

            var secondScreen = container.cloneNode(true);
            if(this.type === 'swipe'){
                secondScreen.style.display = 'none';// = 'display:none;';
            }


            secondScreen.querySelector('.row-fluid').replaceChild(pages[i], secondScreen.querySelector('.articleList'));

            viewport.appendChild(secondScreen);
        }
    };

    View.prototype.swipe = function(pages){
        this.standardRender(pages);

        window.mySwipe = new Swipe(document.getElementById('swipe'), {
            startSlide: 0,
            speed: 400,
            auto: false,
            callback: function(event, index, elem) {
            }
        });
        function homepage(e){
            e.preventDefault();

            window.mySwipe.slide(0, 1000);
            //window.location.hash = 'wrap';
        }

        $('#homepage').click(homepage);
        $('.js-homepage').click(homepage);
    };

    View.prototype.swipeview = function(pages){
        var swipe = document.getElementById('swipe');
        swipe.parentNode.removeChild(swipe);

        for (var i = 0; i < pages.length; i++) {
            var contain = document.createElement('div');
            contain.className = 'page-container';

            var page = pages[i];
            page.className = 'page-item';
            contain.appendChild(page);

            pages[i] = contain;
        }

        var mySwipeView = new SwipeView('#swipeview', {
            numberOfPages: 3,
            hastyPageFlip:true
        });

        mySwipeView.onFlip(function(){
            console.log('flip');

            var el,
            upcoming,
            i;

            for (i=0; i<3; i++) {
                upcoming = mySwipeView.masterPages[i].dataset.upcomingPageIndex;

                if (upcoming !== mySwipeView.masterPages[i].dataset.pageIndex) {
                    el = mySwipeView.masterPages[i];
                    el.innerHTML = '';
                    el.appendChild(pages[upcoming]);
                }
            }
        });

        mySwipeView.onMoveIn(function(){
            console.log('onMoveIn', arguments, this);
        });

        mySwipeView.updatePageCount(pages.length);
        mySwipeView.masterPages[0].dataset.pageIndex = pages.length-1;
        mySwipeView.masterPages[0].dataset.upcomingPageIndex = mySwipeView.masterPages[0].dataset.pageIndex;

        // Load initial data
        for (i=0; i<3; i++) {
            var pageIndex = i===0 ? pages.length-1 : i-1;

            mySwipeView.masterPages[i].appendChild(pages[pageIndex]);
        }

        function homepage(e){
            e.preventDefault();

            window.mySwipeView.goToPage(0);
            //window.location.hash = 'wrap';
        }

        $('#homepage').click(homepage);
        $('.js-homepage').click(homepage);

        window.mySwipeView = mySwipeView;
    };

    window.View = View;

})(window);