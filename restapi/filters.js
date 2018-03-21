/**
 * middleware filter functions (filter, offset, limit, search)
 *
 * @contributors Anna Deeva, Marvin Kullick
 * @licence MIT
 */


const logger = require('debug')('we2:pins');
const store = new (require('simple-memory-store'))();
const HttpError = require('../restapi/http-error.js');

/**
 * Help function for filterFunction and filterFunctionForAllItems
 *
 * @param item: pin/comment
 * @param filterValues
 * @returns error (if bad filter parameters) or filtered object
 */
function selectProperties(item, filterValues) {
    let result = {};
    let err = undefined;

    filterValues.forEach(function (property) {
        // bad filter parameters
        if (item[property] === undefined) {
            err = new HttpError(`Bad Request!`, 400);
        }
        result[property] = item[property];
    });
    return {record: result, err: err};
}


/* Middleware for filtering only for one item */
exports.filterFunction = function (item) {
    return function(req, res, next) {
        let filter = req.query.filter;
        if (filter) {

            // Separate filter values and add them to an array
            let filterValues = filter.split(',');
            let pin = store.select(item, req.params.id);

            result = selectProperties(pin, filterValues);

            (result.err) ? next(result.err) : res.json(result.record);
        } else {
            next();
        }
    }
}

/* Middleware for filtering for all items */
exports.filterFunctionForAllItems = function() {
    return function(req, res, next) {

        let filter = req.query.filter;
        if (filter) {

            // Separate filter values and add them to array
            let filterValues = filter.split(',');

            let filteredItems = [];
            let allItems = res.locals.items;
            let err = undefined;

            if (!allItems) {
                next();
            } else {
                allItems.forEach(function (pin) {
                    result = selectProperties(pin, filterValues);
                    err = result.err;
                    filteredItems.push(result.record);
                });
            }

            if (err) {
                next(err);
            } else {
                res.locals.items = filteredItems;
                next();
            }
        } else {
            next();
        }
    }
}


/* Middleware for offset and limit */
exports.offsetFunction = function () {
    return function (req, res, next) {
        let offset = req.query.offset;
        let limit = req.query.limit;
        let offsetItems = [];

        if (offset || limit) {
            let allItems = res.locals.items;
            if (!offset) offset = 0;
            if (!limit || limit > allItems.length) {
                limit = allItems.length;
            } else if (limit > 0) {
                //convert String to Int to get sum
                limit = parseInt(limit, 10) + parseInt(offset, 10);
            }

            if (isNaN(parseInt(offset, 10)) || isNaN(parseInt(limit, 10)) || parseInt(offset, 10) < 0
                || parseInt(limit, 10) <= 0 || parseInt(offset) >= allItems.length) {
                let err = new HttpError(`Bad Request!`, 400);
                next(err);
                return; // important to avoid code to continue after next(err) returns.
            }

            for (let i = offset; i < limit; i++) {
                offsetItems.push(allItems[i]);
            }
            res.locals.items = offsetItems;
            next();
        } else {
            next();
        }
    }
}


/* Middleware for search */
exports.searchFunction = function () {
    return function(req, res, next) {
        let searchAttributes = {};
        let result = [];
        let allPins = res.locals.items;


        if (allPins) {
        Object.keys(allPins[0]).forEach(function (property) {
            // if there are queries like properties
            if (req.query[property] !== undefined) searchAttributes[property] = req.query[property];
            delete req.query[property];
        });
        logger(req.query);
        Object.keys(req.query).forEach(function (value) {
            if (value !== "filter" && value !== "offset" && value !== "limit") {
                let err = new HttpError(`Bad Request Value!`, 400);
                next(err);
                return; // important to avoid code to continue after next(err) returns.
            }
        });

        if (searchAttributes.length !== 0) {
            // push items to result if they contain all search values (also as substring) in their properties
            allPins.forEach(function (item) {
                let temp = true;
                Object.keys(searchAttributes).forEach(function (property) {
                    let string = "" + item[property];
                    let substring = "" + searchAttributes[property];
                    if (!string.includes(substring)) {
                        temp = false;
                        return;
                    }
                });
                if (temp) result.push(item);
            });
        }
        logger(result);
        res.locals.items = result;
        next();
        } else {
            next();
        }
    }
}