var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PinSchema = new Schema({
        title: {type: String, required: true},
        // Validator
        type: {type: String, required: true, enum: ['image', 'video', 'website']},
        src: {type: String, required: true},
        description: {type: String, default: ''},
        // nicht negative Zahl
        views: {type: Number, default: 0, min: 0},
        // nicht negative Zahl
        ranking: {type: Number, default: 0, min: 0}
    },
    {
        timestamps:
            {type: Number, createdAt: 'timestamp', updatedAt: 'changed'}
    });

module.exports = mongoose.model('Pin', PinSchema);
