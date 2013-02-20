

(function(){
    var prog;
    var app;

    var clear = function(){
        basket.clear();
        setTimeout(function(){
            window.location.reload();
        }, 1000);
    };
    window.onerror = clear;

    var runApp = function(){
        //init application
        prog.stop();

        app = new App();
        app.start();

        Zepto(document.body).tap(clear);
        Zepto(document.body).click(clear);
    };

    var progressCallback = function (progress) {

        if(!prog){
            prog = new Progress(runApp);

            prog.setProgress(progress * 100);
            prog.start();
        }

        prog.setProgress(progress * 100);
    };

    basketLoader.load([
        [{
            url: 'style.css', expire: 0.0001
        },{
            url: 'progress.js', expire: 0.0001
        }],[{
            url: 'zepto.js', expire: 0.0001
        }],[{
            url: 'offline.js', expire: 0.0001
        },{
            url: 'downloader.js', expire: 0.0001
        }],[{
            url: 'app.js', expire: 0.0001
        }]
        ], progressCallback, true);


}());