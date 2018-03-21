/**
 *  Backbone View (stub code) using the #xx-yy-zz-template from DOM to render ... into target element #xx-yy-target
 *  Needs model to be set from outside
 *
 *  (file can be deleted or changed for Ü4 Pins)
 *
 *  @contributors Anna Deeva, Marvin Kullick
 *  @licence  CC BY-SA 4.0
 */
define(['backbone', 'jquery', 'underscore', 'models'], function(Backbone, $, _, result) {
    var PinView = Backbone.View.extend({
        tagName: 'div',
        className: 'pin',
        template: _.template($('#pin-template').text()),
        events: {
            'click .likeButton': 'saveLike'
        },
        render: function() {
            let timestamp = this.model.attributes.timestamp;
            // Konvertiert timestamp zu einem lesbaren Datum
            this.model.attributes.timestamp =  new Date(timestamp).toISOString().split('T')[0];
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },
        saveLike: function(e) {
            if (e.offsetX < 40 && e.offsetY < 40) { // wird nur dann angewendet, wenn Like-Buttons oben links gecklickt werden
                let ranking = parseInt(this.model.attributes.ranking);
                let changed = false;
                if (this.model.attributes.like === "isLiked") {
                    //console.log ("unlike");
                    this.model.set({like: "", ranking: ranking});
                } else {
                    //console.log ("like");
                    ranking++;
                    this.model.set({like: "isLiked", ranking: ranking});
                    changed = true;
                }
                console.log(this.model.attributes.ranking);
            }
            if ((e.offsetX > 40 || e.offsetY > 40) && (e.offsetX < 220 || e.offsetY < 250)) {
                let views = parseInt(this.model.attributes.views);
                views++;
                this.model.set({views: views});
                //console.log(this.model.attributes.views);
                modalView.model.set({description: this.model.attributes.description, display: "block",
                    ranking: this.model.attributes.views, timestamp: this.model.attributes.timestamp});
            }
            this.model.save({views: this.model.attributes.views, ranking: this.model.attributes.ranking}, {patch: true});
        }
    });


    var PinListView = Backbone.View.extend({
        el: '#main',
        template: undefined,
        render: function() {
            this.$el.empty();

            // Rendern von einzelnen Pins
            this.collection.each(function(pin) {
                var pinView = new PinView({model: pin});
                this.$el.prepend(pinView.render().el);
            }, this);
            return this;
        },
        initialize: function() {
            this.listenTo(this.collection,'add', this.render);
        }
    });

    var ModalView = Backbone.View.extend({
        el: '#modal-append',
        template: _.template($('#modal-template').text()),
        events: {
            'click .close': 'closeModal'
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },
        closeModal: function() {
            this.model.set({display: "none"});
        }
    });

    var modalView = new ModalView({model: result.ModalModel});
    modalView.render().el;


    var pinViews = {};
    pinViews.PinView = PinView;
    pinViews.PinListView = PinListView;
    return pinViews;
});
