/** Main application file to start the client side single page app (only a stub for Ü4)
 *
 * @author Johannes Konert
 * @licence  CC BY-SA 4.0
 */

requirejs.config({
    baseUrl: "js",
    paths: {
        jquery: '_lib/jquery-1.11.3',
        underscore: '_lib/underscore-1.8.3',
        backbone: '_lib/backbone-1.2.3',
        models: 'models/pins',
        views: 'views/pins'
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

// AMD conform require as provided by require.js
require(['jquery','backbone', 'models', 'views'],
        function($, Backbone, result, pinViews) {

    // TODO your first code steps here
    console.log("JavaScript is running!");
    // see this console.log in Browser window (developer console, F12)

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'firstpage': 'firstpage'
        }
    });

    var myAppRouter = new AppRouter();

    myAppRouter.on ('route:home', function () {
        console.log("Page Loaded");
    });
    myAppRouter.on ('route:firstpage', function (page) {
        console.log("First Loaded");
        $('body').prepend('<h1>Pinterest Pins App</h1>');
    });


    result.Collection.fetch({
        success: function(pins) {
            // gebe im Erfolgsfall Größe der PinCollection aus
            console.log(pins.length);

            // neuer PinView wird erstellt und ausgegeben
            let firstPin = pins.models[0];
            var pinView = new pinViews.PinView({model: firstPin});
            console.log(pinView.render().el);
        },
        error: function() { "Nicht geschafft!" }
    });


    var pinListView = new pinViews.PinListView({collection: result.Collection});
    pinListView.render();

    // finally start tracking URLs to make it a SinglePageApp (not really needed at the moment)
    Backbone.history.start({pushState: true}); // use new fancy URL Route mapping without #
});

