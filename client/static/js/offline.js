/*global console:true Q:true */

(function (window, undefined) {
    "use strict";

    function Offline(){
        var self = this;
        this.db = undefined;


        this.start(function(){
            console.log("offline started");
        },function(){
            console.log("offline error");
        });

        //this.clearDB();
    }

    function dbError(){
        console.log('offline db error', arguments);
    }

    /* websql ft: b=e?window.openDatabase('fthtml5app','','FT HTML5 App Content',41943040) */
    // 41943040 == 40 * 1024 * 1024   ~ 40MB
    Offline.prototype.start = function(successCallback, errorCallback){

        var db;

        console.log('offline start');
         try{
                this.db = openDatabase('articles3', '', 'aftenposten database', (40 * 1024 * 1024) );
                db = this.db;
         }catch(e){
             console.log('catched e', e);
             console.error(e);
             errorCallback();
             return;
         }

        function migration1(t){
            console.log('migrate to 1', db);
            t.executeSql('CREATE TABLE IF NOT EXISTS Articles(url TEXT PRIMARY KEY, date TIMESTAMP, title TEXT, bodytext TEXT, img TEXT)');
            t.executeSql('CREATE TABLE IF NOT EXISTS ArticleImages(id INTEGER PRIMARYKEY KEY ASC, base BLOB, alt TEXT, artid INTEGER)');

        }

        console.log('create callback', db, this.db);

        if(db.version === ""){
            db.changeVersion('', '1', function (t) {
                migration1(t);
            }, dbError, successCallback);
        }else{
            successCallback();
        }

    };

    Offline.prototype.addArticles = function(articles){
        var self = this;
        articles.map(self.addArticle.bind(self));
    };

    Offline.prototype.addArticle = function(article){
        var db = this.db;
        //TODO this should be done after success of changeVersion....
        // console.log('before adding', db);

        var limitImages = 500;

        db.transaction(function (tx) {
            // console.log('insert into articles', db, tx);
            // url: articleUrl, img: articleImage, title
            tx.executeSql('INSERT INTO Articles (url, date, title, bodytext, img) VALUES (?, ?, ?, ?, ?)',
                [article.url, article.lastModified, article.title, article.bodytext, article.img],
                function(tx, resultSet){
                    console.log('saved article', arguments);
                },function(){
                     console.log("error: cant add article", arguments);
                });
        });

    };

    Offline.prototype.clearDB = function() {
        var db = this.db;
        db.transaction(function (tx) {
            console.log('delete data', db, tx);
            tx.executeSql('DELETE FROM Articles');
            tx.executeSql('DELETE FROM ArticleImages');
        });

    };

    function toArray(data){
        var output = [];
        // HACK Convert row object to an array to make our lives easier
        for (var i = 0, l = data.length; i < l; i = i + 1) {
            output.push(data.item(i));
        }
        return output;
    }

    Offline.prototype.getArticles = function(successCallback){
        var db = this.db;
        db.readTransaction(function(tx){
            //SELECT city as cityname, currency as currency FROM places, currency where places.country = currency.country
            tx.executeSql('SELECT * FROM Articles LIMIT 80', [], function (tx, results) {
                var result = toArray(results.rows);

                successCallback(result);


            }, function(){
                //console.log('not selected?', arguments);
                successCallback([]);
            });
        });

    };

    Offline.prototype.getArticlesPromise = function(){
        var deferred = Q.defer();
        this.getArticles(function(data){
            if(data.length)
                deferred.resolve(data);
            else
                deferred.reject('empty db');
        });
        return deferred.promise;
    };

    window.Offline = Offline;

}(this));

