require('dotenv').config();
const Place = require('../models/place');
const Review = require('../models/review');
const getPhotoReference = require('../utilities/photos');

exports.index = function (req, res) {
    res.json({ time: new Date() });
};

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

exports.placeList = async function (req, res) {
    const acceptable = new Set([
        'entertainment',
        'food',
        'shopping',
        'landmark',
    ]);
    const reg = /^\d+$/;

    if (acceptable.has(req.params.category) && reg.test(req.params.pg)) {
        const limitVal = 18;
        let placeList = await Place.find(
            { category: `${req.params.category}` },
            'name address attributes hours reviews'
        )
            .sort({ name: 1 })
            .limit(limitVal)
            .skip((Number(req.params.pg) - 1) * limitVal)
            .lean();
        for (let i = 0; i < placeList.length; i++) {
            let avgReview = await getAvgReviewScore(placeList[i]);
            placeList[i].avgReviewScore = avgReview;
        }

        return res.json(placeList);
    }
    return res.status(400).json({ message: 'Category not recognized' });
};

// Respond with the full details for a specific place
exports.placeDetails = async function (req, res) {
    let doc = await Place.findById(req.params.id)
        .populate({
            path: 'reviews',
            options: {
                limit: 3,
            },
        })
        .lean();

    const photoRef = await getPhotoReference(doc.name);
    if (photoRef !== null) {
        doc.photoRef = photoRef;
    }
    return res.json(doc);
};

// Create a new place on HTTP POST
exports.placeCreatePOST = async function (req, res) {
    let body = req.body;
    const place = new Place(body);
    console.log(place);

    try {
        const doc = await place.save();
        return res.status(201).json(doc);
    } catch (err) {
        console.log(err);
    }
};

// Handle delete on HTTP POST
exports.placeDeletePOST = function (req, res) {
    res.send('NOT IMPLEMENTED: Place delete POST');
};

// Handle updating a place
exports.placeUpdatePOST = function (req, res) {
    res.send('NOT IMPLEMENTED: Place update POST');
};
