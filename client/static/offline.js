/*global console:true, $:true, RSVP:true, PubSub:true */
;(function (window, undefined) {
    "use strict";

    function Offline(){
        PubSub.subscribe( "downloaded:articles", function(name, articles){

            console.log('downloaded:articles and store offline', arguments);

            articles.map(addArticle);

        });

        PubSub.subscribe( "get:articles", function(name){
            //todo check articles
            getArticles(function(articles){
                if(articles.length){
                    PubSub.publish( 'show:articles', articles);
                }else{
                    PubSub.publish( 'no:articles', articles);
                }
            });
            //else download articles
        });


        start(function(){
            console.log("offline started");
        },function(){
            console.log("offline error");
        });

        //clearDB();
    }

    var db;

    function dbError(){
        console.log('offline db error', arguments);
    }

    /* websql ft: b=e?window.openDatabase('fthtml5app','','FT HTML5 App Content',41943040) */
    // 41943040 == 40 * 1024 * 1024   ~ 40MB
    function start(successCallback, errorCallback){


        console.log('offline start');
         try{
                db = openDatabase('articles3', '', 'aftenposten database', (40 * 1024 * 1024) );
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

        console.log('create callback', db);

        if(db.version === ""){
            db.changeVersion('', '1', function (t) {
                migration1(t);
            }, dbError, successCallback);
        }else{
            successCallback();
        }

    }

    function addArticle(article){

        //TODO this should be done after success of changeVersion....
        // console.log('before adding', db);

        var limitImages = 500;

        db.transaction(function (tx) {
            // console.log('insert into articles', db, tx);
            // url: articleUrl, img: articleImage, title
            tx.executeSql('INSERT INTO Articles (url, date, title, bodytext, img) VALUES (?, ?, ?, ?, ?)',
                [article.url, article.lastModified, article.title, article.bodytext.innerHTML, article.img],
                function(tx, resultSet){
                    console.log('saved article', arguments);
                },function(){
                     console.log("error: cant add article", arguments);
                });
        });

    }

    function clearDB () {

        db.transaction(function (tx) {
            console.log('delete data', db, tx);
            tx.executeSql('DELETE FROM Articles');
            tx.executeSql('DELETE FROM ArticleImages');
        });

    }

    function toArray(data){
        var output = [];
        // HACK Convert row object to an array to make our lives easier
        for (var i = 0, l = data.length; i < l; i = i + 1) {
            output.push(data.item(i));
        }
        return output;
    }

    function getArticles(successCallback){
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

    }

    window.Offline = Offline;

}(this));

