/*global console:true, $:true  */

(function (window, undefined) {
    "use strict";

    function Downloader(){
        this.rootUrl = 'http://apitestbeta3.medianorge.no/news/';
    }

    Downloader.prototype.getArticles = function(succ){
        succ(new Array(4));
    };

    Downloader.prototype.makeRequest = function(config){
        var self = this;
        var url = config.url;
        console.log('makeRequest to url: ', url);


        $.ajax({
            url: url,
            dataType: "xml",
            headers: {
                'accept':"application/atom+xml"
            },
            success: function(data){
                console.log('makeRequest ok', data);
                config.success( data );
            },
            error: function(xhr, type){
                console.error('makeRequest root error', type, xhr);
                config.error(new Error( type, xhr ) );
            }
        });
    };

    window.Downloader = Downloader;

})( window );