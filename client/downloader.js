/*global console:true, $:true, RSVP:true, PubSub:true  */
;(function (window, undefined) {
    "use strict";

    function errorFun(){
        console.error('promise root error', arguments);
    }

    function Downloader(){
        this.betahostUrl = 'http://apitestbeta3.medianorge.no';
        this.betahostUrlLong = 'http://apitestbeta3.medianorge.no:80';
        this.localhostUrl = 'http://localhost:8001';

        this.rootUrl = this.betahostUrl+'/news/';

        this.articles = [];
    }

    Downloader.prototype.start = function () {
        var self = this;
        console.log("Download Start!");

        //TODO when cors is fixed move it inside sections
        var articleUrl = "/news/publication/common/searchContents/instance?id=24517&contentType=article";

        var rootPromise = this.getRootUrl(this.rootUrl);

        rootPromise.then(function(url){
            console.log('root url resolved', url);
            return url;
        }).then(function(url){
            console.log('sections url', url);
            return self.getSections(url);
        }).then(function(deskedUrl){

            console.log('desked-articles', deskedUrl);

            return self.getArticlesList(deskedUrl);

        }).then(function(articles){

            var promises = [];

            console.log('get aticles-articles', articles);
            function load(){ console.log('loaded image'); }



            var entries = articles.querySelectorAll('entry');
            var len = entries.length;
            var articleUrl, entry, articleImage, elId, elImg;
            var title;

            var articlesList = [];


            for (var i = len - 1; i >= 0; i--) {
                entry = entries[i];

                elId = entry.querySelector('id');
                articleUrl = self.betahostUrlLong+'/news/publication/common/searchContents/instance?id=24517&contentType=article';
                articleUrl = elId ? elId.textContent : false;

                //one article just return 404 for no reason, ommit it
                if(articleUrl.indexOf('24486') > -1) {
                    console.log('ommit this article', articleUrl.indexOf('24486'));
                    continue;
                }

                elImg = entry.querySelector('link[type^="image"]');
                articleImage = 'http://ap.mnocdn.no/incoming/article7122344.ece/ALTERNATES/w580cFree/sovedekk-xshEl7UtjK.jpg?updated=150220131021';
                articleImage = elImg ? elImg.getAttribute('href') : articleImage;

                articleImage = articleImage.replace('{snd:mode}/{snd:cropversion}', 'ALTERNATES/w380c34');

                title = entry.querySelector('title') ? entry.querySelector('title').textContent : 'Empty title';

                articlesList.push({url: articleUrl, img: articleImage, title: title});

            }

            self.articlesList = articlesList;

            PubSub.publish( 'downloaded:articles-list', {list: articlesList });

            len = articlesList.length;
            for (i = len - 1; i >= 0; i--) {

                promises.push(self.getArticle(entry.url));

            }

            return RSVP.all(promises);

        }).then(function(allArticles){

            console.log('end', arguments);

            PubSub.publish( "downloaded:articles", allArticles );

        }, errorFun);




    };

    Downloader.prototype.getArticle = function(url){
        var promise = new RSVP.Promise();
        var self = this;


        console.log('getArticle', url);

        var ajax = this.makeRequest(url);
        ajax.then(function(data){
            console.log("getArticle ok");
            self.articles.push(data);
            promise.resolve(data);
        }, function(err){
            console.log("getArticle error", arguments);
            promise.reject(err);
        });

        return promise;
    };

    Downloader.prototype.getArticlesList = function(url){
        var promise = new RSVP.Promise();
        var self = this;

        console.log('getArticles', url);

        var ajax = this.makeRequest(url);
        ajax.then(function(data){
            console.log("getArticles ok");
            promise.resolve(data);
        }, function(err){
            console.log("getArticles error", arguments);
            promise.reject(err);
        });

        return promise;
    };

    Downloader.prototype.makeRequest = function(url){
        var promise = new RSVP.Promise();
        var self = this;

        console.log('makeRequest to url: ', url);

        /** UUU tralalala local hacking */
        url = url.replace(this.betahostUrlLong, this.localhostUrl);
        url = url.replace(this.betahostUrl, this.localhostUrl);



        $.ajax({
            url: url,
            dataType: "xml",
            //dataType: "application/atom+xml",
            hdeaders: {
                'accept':"application/atom+xml"
            },
            success: function(data){
                console.log('makeRequest ok', data);
                promise.resolve( data );
            },
            error: function(xhr, type){
                console.error('makeRequest root error');
                promise.reject(new Error( arguments ) );
            }
        });

        return promise;
    };

    Downloader.prototype.getRootUrl = function(url){
        var promise = new RSVP.Promise();
        var self = this;

        var ajax = this.makeRequest(url);
        ajax.then(function(data){
            console.log('getRootUrl ok');
            console.log('resolve with',  data.baseURI + data.querySelector('link[rel="sections-common"]').getAttribute('href'));
            promise.resolve( data.baseURI + data.querySelector('link[rel="sections-common"]').getAttribute('href') );
        }, function(err){
            promise.reject(err);
        });

        return promise;
    };

    Downloader.prototype.getSections = function(url){
        var self = this;
        var promise = new RSVP.Promise();

        console.log('getSections', url);

        var ajax = this.makeRequest(url);
        ajax.then(function(data){
            console.log('getSections ok');
            self.root = data;

            var identity = data.querySelector('identityLabel[uniqueName="sport_bt"]');
            console.log(data, identity);
            self.identity = identity;

            self.entry = identity.parentElement.parentElement;
            self.desked = self.entry.querySelector('link[rel="http://www.snd.no/types/relation/desked"]');

            var link = self.desked.getAttribute('href').replace('{areaLimit}&', '');
            link = link.replace('{offset?}', 0);
            link = link.replace('{limit?}', 100);

            console.log("getSections resolve with link", link);

            promise.resolve( link );
        }, function(err){
            console.error('getSections root error');
            promise.reject( new Error( arguments ) );
        });

        return promise;
    };

    window.Downloader = Downloader;

})( window );