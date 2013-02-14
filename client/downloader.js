/*global console:true, $:true, RSVP:true */
;(function (window, undefined) {
    "use strict";

    function Downloader(){
        this.betahostUrl = 'http://apitestbeta3.medianorge.no';
        this.localUrl = 'http://localhost:8001';
        this.hostUrl = this.localUrl;
        this.rootUrl = this.hostUrl+'/news/';
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
        }, function(){
            console.error('promise root error');
        }).then(function(url){
            return self.getSections(url);
        }).then(function(sectionsData){
            console.log('sections-common');

            self.common = sectionsData;
            var identity = sectionsData.querySelector('identityLabel[uniqueName="ece_frontpage"]');
            console.log(sectionsData, identity);

            return this.getArticle(this.localUrl + articleUrl);
        });




    };

    Downloader.prototype.getArticle = function(url){
        var promise = new RSVP.Promise();
        var self = this;

        console.log('getArticle', url);

        var ajax = this.makeRequest(url);
        ajax.then(function(data){
            console.log("getArticle ok");
            promise.resolve(data);
        }, function(err){
            console.log("getArticle error", arguments);
            promise.reject(err);
        });

        return promise;
    };

    Downloader.prototype.makeRequest = function(url){
        var promise = new RSVP.Promise();
        var self = this;

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
            promise.resolve( data );
        }, function(err){
            console.error('getSections root error');
            promise.reject( new Error( arguments ) );
        });

        return promise;
    };

    window.Downloader = Downloader;

})( window );