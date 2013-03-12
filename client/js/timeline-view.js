/*global console:true $:true Swipe:true SwipeView:true Handlebars:true */

(function(window, undefined){
    "use strict";

    function TimelineView(type){
        console.log("Start!");
        var types = {
            'default': 'swipeview'
        };

        type = type || 'default';
        this.type = types[type];

        this.menu();
    }

    TimelineView.prototype.registerImageDownload = function(notifyImageDownloader) {
        $('#saveForOffline').on('click', notifyImageDownloader);
        $('#saveForOffline').on('tap', notifyImageDownloader);
        $('body').swipeDown(notifyImageDownloader);
    };

    TimelineView.prototype.registerClearDB = function(notifyClear) {
        $('#clearOffline').on('click', notifyClear);
        $('#clearOffline').on('tap', notifyClear);
    };

    TimelineView.prototype.showArticles = function(articles){
        console.log('TimelineView:thenTimelineViewArticles', arguments);
        this.viewArticles('then', articles);
    };

    TimelineView.prototype.showError = function(articles){
        var h1 = document.createElement('h1');
        h1.className = 'alert alert-error';
        h1.innerText = "no articles, check internet connection";
        document.body.appendChild(h1);
    };

    TimelineView.prototype.viewArticles = function(name, articles){
        console.log('TimelineView:viewArticles', arguments);

        var pages = this.prepareTimelineArticles(articles);

        if(this[this.type]){
            this[this.type](pages);
        }

    };



    var clickOnArticle = function(e){
        /*jshint validthis:true */
        var page = parseInt(this.getAttribute('data-id'), 10);

        if(window.mySwipeView){
            window.mySwipeView.goToPage(page);
        }
    };

    TimelineView.prototype.prepareTimelineArticles = function(articles){
        var len = articles.length;

        var pages = [];
        var entry, article;

        var source   = $("#timeline-article-template").html();
        var templateArticle = Handlebars.compile(source);

        for (var i =0; i < len; i++) {

            entry = articles[i];
            entry.base = entry.base ? entry.base : entry.img;

            entry.date = entry.published.split('T')[0] ?
            entry.published.split('T')[0] : entry.published;

            article = templateArticle(entry);

            pages.push(article);

        }

        var timelineSource = $("#timeline-template").html();
        var templateTimeline = Handlebars.compile(timelineSource);

        var timelineFront = templateTimeline({articles: pages});

        pages.unshift(timelineFront);


        return pages;
    };

    TimelineView.prototype.swipeview = function(pages){
        var swipe = document.getElementById('swipe');
        swipe.parentNode.removeChild(swipe);

        for (var i = 0; i < pages.length; i++) {
            var contain = document.createElement('div');
            contain.className = 'page-container';

            var page = pages[i];
            page.className = 'page-item';
            contain.innerHTML = page;

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

    TimelineView.prototype.menu = function(){
        $(document).ready(function() {

          $('body').addClass('js');

          var $menu = $('#side-menu'),
            $menulink = $('.side-menu-link'),
            $wrap = $('#wrap');

          $menulink.click(function() {
            $menulink.toggleClass('active');
            $wrap.toggleClass('active');
            return false;
          });
        });
    };

    window.TimelineView = TimelineView;

})(window);