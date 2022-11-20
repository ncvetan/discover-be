require('dotenv').config();
const Place = require('../models/place');
const Review = require('../models/review');

// List reviews for a specific place
exports.reviewList = async function (req, res) {
    const limitVal = 10;
    const reviewList = await Review.find({ parentId: `${req.params.id}` })
        .sort({ name: 1 })
        .limit(limitVal)
        .skip((Number(req.params.pg) - 1) * limitVal);
    return res.json(reviewList);
};

// Get details for a specific review
exports.reviewDetails = function (req, res, next) {
    Review.findById(req.params.reviewid).exec((err, reviewDetails) => {
        if (err) {
            return next(err);
        }
        res.json(reviewDetails);
        return;
    });
};

// Get form to make a new review for a specific place via HTTP GET
exports.reviewCreateGET = function (req, res) {
    res.send('NOT IMPLEMENTED: Review create get');
};

// Handle a new review on a HTTP POST
exports.reviewCreatePOST = async function (req, res) {
    const body = req.body;

    if (!body.rating) {
        return res.status(400).json({ err: 'Missing rating' });
    }
    if (!body.description) {
        return res.status(400).json({ err: 'Missing description' });
    }

    const review = new Review(body);

    try {
        const doc = await review.save();
        await Place.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { reviews: doc._id } },
            { upsert: true, new: true }
        );
        return res.status(201).json(doc);
    } catch (err) {
        return res.status(500).json({ err: 'Error in updating place reviews' });
    }
};

// Handle the deletion of a review
exports.reviewDeleteGET = function (req, res) {
    res.send('NOT IMPLEMENTED: Review delete GET');
};

// Handle the deletion of a review
exports.reviewDeletePOST = async function (req, res) {
    res.send('NOT IMPLEMENTED: Review delete POST');
};
