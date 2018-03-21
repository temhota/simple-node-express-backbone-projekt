/**
 *  Backbone Model (stub)
 *  Connected to REST API /{pins}
 *
 *  @contributors Anna Deeva, Marvin Kullick
 *  @licence  CC BY-SA 4.0
 */
define(['backbone', 'underscore'], function(Backbone, _) {
    var result = {};

    var PinModel = Backbone.Model.extend({
        urlRoot: '/pins',
        idAttribute: "_id",
        defaults: {
            title: '',
            timestamp: '',
            type: '',
            src: '',
            description: '',
            views: 0,
            ranking: 0,
            changed: '',
            like: ''
        },
        initialize: function() {
        },
        validate: function(attr) {

        }
    });

    var ModalModel = Backbone.Model.extend({
        defaults: {
            title: '',
            timestamp: '',
            src: 'http://via.placeholder.com/700x450/fd9f85/ffffff',
            description: '',
            display: 'none',
            ranking: 0,
        },
        initialize: function() {
        },
        validate: function(attr) {
        }
    });

    var PinCollection = Backbone.Collection.extend({
        model: PinModel,
        url: '/pins',
        //localStorage: new Store('pinsStore'),
        initialize: function() {}
    });

    result.Collection = new PinCollection();
    result.Model = new PinModel();
    result.ModalModel = new ModalModel();
    /*
    result.Collection.fetch({
        success: function() {
            // gebe im Erfolgsfall Größe der PinCollection aus
            //allPins = result.Collection.toJSON();

            console.log(result.Collection.length)
        },
        error: function() { "Nicht geschafft!" }
    });
*/

    return result;
});

