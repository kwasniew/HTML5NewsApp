require(['alf'], function (Alf) {
        var app, publicationName, url, assetsBaseUrl;

        // The name of the publication in LayoutPreview
        publicationName = 'ap_pub_2';

        // The name of the format you want to use
        formatName = 'ipad_landscape';
        //formatName = 'iphone';

        // Article URL. Point this to your DrMobile API endpoint (DrLib)
        url = 'http://rai-dev.aptoma.no:9000/drmobile.json?formatName=' + formatName + '&publicationName=' + publicationName + '&limit=50&callback=?';

        app = {
            initialize: function () {
                this.pages = [];

                this.initBridge();
                this.initLayers();
                this.initScrollView();
            },

            /**
             * Initialize the bridge used for communication between native and HTML
             *
             * @return {void}
             */
            initBridge: function () {
                // This is used to trigger HTML-events by the native layer
                this.event = _.extend({}, Alf.Events);

                // This is used to send event-data to the native app
                this.bridge = _.extend({}, Alf.Events, {
                  initialize: function () {
                        this.frameIndex = 0;
                        this.eventFrames = $('.event-frame');
                        this.bind('all', this.eventTriggered);
                    },

                    /**
                     * Event triggered
                     *
                     * This works like a proxy for all events triggered on this.bridge
                     * Change the src attribute on any of the iframes so the native wrapper app
                     * can intercept it and decode the JSON payload in the URL
                     *
                     * @return {void}
                     */
                    eventTriggered: function () {
                        this.eventFrames[this.frameIndex].src = 'event://' + escape(JSON.stringify([].slice.call(arguments)));
                        this.frameIndex = (this.frameIndex + 1) % this.eventFrames.length;
                    }
                });

                this.bridge.initialize();
            },

            /**
             * Initialize layers
             *
             * This is to enable fullscreen support
             * The article/pages and fullscreen elements are rendered in different "layers"
             *
             * @return {void}
             */
            initLayers: function () {
                this.layerManager = new Alf.layer.Manager();

                this.pageLayer = new Alf.layer.Page({
                    el: '#alf-layer-1',
                    manager: this.layerManager
                });

                this.fullscreenLayer = new Alf.layer.Fullscreen({
                    el: '#alf-layer-2',
                    manager: this.layerManager
                });

                this.pageLayer.render();
                this.fullscreenLayer.render();

                Alf.hub.on('fullscreenWillAppear', function () {
                    // Tell the native wrapper app that an element is about to enter fullscreen mode
                    this.bridge.trigger('fullscreenWillAppear');
                }, this);
            },

            /**
             * Initialize the scroll view
             *
             * This is only needed if you want HTML-navigation
             *
             * @return {void}
             */
            initScrollView: function () {
                var that = this;

                this.scrollView = new Alf.nav.ScrollView($('#alf-layer-1').get(0), {
                    numberOfPages: app.compiledPages.length,
                    renderDeferTime: 100
                });

                this.scrollView.on('pageWillRender', function (el, pageNum) {
                    // Tell the native wrapper that a page is about to be rendered
                    that.bridge.trigger('pageWillRender', pageNum);
                    app.renderPage(el, pageNum);
                });

                this.scrollView.start();
            },

            /**
             * Render the page on screen
             *
             * Takes the compiled content and uses Alf.layout.Page to do the heavy lifting of rendering
             *
             * @param {HTMLElement} el the element to put the page inside
             * @param {number} pageNum the page number
             * @return {void}
             */
            renderPage: function (el, pageNum) {
                var $el = $(el), page;

                page = new Alf.layout.Page({
                    layer: this.pageLayer,
                    assetsBaseUrl: assetsBaseUrl
                });

                page.on('loadComplete', function () {
                    // Tell the native wrapper that a page has finished loading
                    this.bridge.trigger('loadComplete');
                }, this);

                page.decompile(this.compiledPages[pageNum]);

                $el.empty().append(page.el);

                page.render();
            }
        };

        /**
         * Fetch all articles and pages
         */
        $.get(url, function (response) {
            app.compiledPages = [];

            assetsBaseUrl = response.items[0].service.assetsBaseUrl;

            // Convert all article-pages into a flat array of pages
            response.items.forEach(function (article) {
                app.compiledPages = app.compiledPages.concat(article.compiled.pages)
            });

            app.initialize();
        }, 'json');

    });