/** This module defines the routes for pins using the simple-memory-store as db memory
 *
 * @contributors Anna Deeva, Marvin Kullick
 * @licence CC BY-SA 4.0
 *
 * @module routes/pins
 * @type {Router}
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module  (to set module.exports)
// 3.) exports (which is module.exports)

// modules
const express = require('express');
const mongoose = require('mongoose');
const logger = require('debug')('we2:pins');
const codes = require('../restapi/http-codes'); // if you like, you can use this for status codes, e.g. res.status(codes.success);
const HttpError = require('../restapi/http-error.js');

const db = mongoose.connect('mongodb://localhost:27017/we2');
const PinModel = require('../models/pin');


const pins = express.Router();

const storeKey = 'pins';


// routes **************
pins.route('/')
    .get((req, res, next) => {

        let limit = req.query.limit;
        if (limit === undefined) limit = 0;
        let offset = parseInt(req.query.offset);

        if (offset < 0) {
            let err = new HttpError('Offset cant be below zero!');
            next(err);
        }
        if (limit.toString().toLowerCase() === 'nolimit') {
            limit = 0;
        } else {
            limit = parseInt(limit);
        }

        PinModel.find({}, (err, items) => {
            res.json(items);
        }).skip(offset).limit(limit);
    })
    .post((req,res,next) => {
        let pin = new PinModel(req.body);
        pin.save (err => {
            if (err) {
                return next(err);
            }
            res.status(201).json(pin).end();
        });
    });


// pins.route('/:id').....
pins.route('/:id')
    .get((req, res, next) => {
        PinModel.findOne({ _id : req.params.id}, (err, item) => {
            if (item == null) {
                next(err);
            } else {
                res.json(item);
            }
        });
    })
    .post((req, res, next) => {
        let err = new HttpError(`POST to wrong URL!`, codes.wrongmethod);
        next(err);
    })
    .put((req, res, next) => {
        if (req.params.id !== req.body._id) {
            let err = new HttpError("ID is not similar too Pin-ID");
            next(err);
        }
        if (req.body.hasOwnProperty('__v') || req.body.hasOwnProperty('timestamps')) {
            let err = new HttpError("Property '__v' or 'timestamp' cannot be changed!");
            next(err);
        }

        PinModel.findByIdAndUpdate({_id : req.params.id}, req.body,
            {runValidators:true,
                new: true},
            (err, item) => {
                res.json(item).status(200).end();
            });
    })
    .patch((req, res, next) => {
        if (req.body.hasOwnProperty('__v') || req.body.hasOwnProperty('timestamps')) {
            let err = new HttpError("Property '__v' or 'timestamp' cannot be changed!");
            next(err);
        }

        PinModel.findByIdAndUpdate({_id : req.params.id}, req.body,
            {runValidators:true,
                new: true},
            (err, item) => {
                res.json(item).status(200);
            });
    })
    .delete((req, res, next) => {
        PinModel.findOne({ _id : req.params.id}, (err, item) => {
            if (item == null) next(err);
        });

        PinModel.findByIdAndRemove({_id : req.params.id}, (err, item) => {
            res.json(item).status(200).end();
        });
    });


/**
 * This middleware would finally send any data that is in res.locals to the client (as JSON) or, if nothing left, will send a 204.
 */
pins.use(function(req, res, next){
    if (res.locals.items) {
        res.json(res.locals.items);
        delete res.locals.items;
    } else if (res.locals.processed) {
        res.set('Content-Type', 'application/json'); // not really necessary if "no content"
        if (res.get('Status-Code') == undefined) { // maybe other code has set a better status code before
            res.status(204); // no content;
        }
        res.end();
    } else {
        next(); // will result in a 404 from app.js
    }
});

module.exports = pins;
