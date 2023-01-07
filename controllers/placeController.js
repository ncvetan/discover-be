require('dotenv').config();
const Place = require('../models/place');
const {getPhotoReference, getPhoto} = require('../utilities/photos');

exports.index = function (req, res) {
    res.json({ time: new Date() });
};

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
            'name address attributes hours reviews avgReviewScore'
        )
            .sort({ name: 1 })
            .limit(limitVal)
            .skip((Number(req.params.pg) - 1) * limitVal)
            .lean();

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
        const photoInfo = await getPhoto(photoRef)
        if (photoInfo !== null)
        {
            doc.photo = photoInfo.photoB64;
            doc.photoType = photoInfo.type;
        }
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
