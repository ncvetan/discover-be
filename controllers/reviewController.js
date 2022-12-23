require('dotenv').config();
const Place = require('../models/place');
const Review = require('../models/review');
const Filter = require('bad-words');

const filter = new Filter();

async function getAvgReviewScore(place) {
    let result = await Review.aggregate([
        { $match: { _id: { $in: place.reviews } } },
        { $group: { _id: place._id, average: { $avg: '$rating' } } },
    ]);

    if (result !== undefined && result.length !== 0) {
        return result[0].average.toFixed(1);
    }
    return 0;
}

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
    let body = req.body;

    if (!body.rating) {
        return res.status(400).json({ err: 'Missing rating' });
    }
    if (!body.description) {
        return res.status(400).json({ err: 'Missing description' });
    }

    body.description = filter.clean(body.description);

    const review = new Review(body);

    try {
        const doc = await review.save();

        let place = await Place.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { reviews: doc._id } },
            { upsert: true, new: true }
            );

        const avgReviewScore = await getAvgReviewScore(place);
        place.avgReviewScore = avgReviewScore;
        console.log(avgReviewScore);
        place.save();

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
