const express = require('express');
const router = express.Router();

const placeController = require('../controllers/placeController');
const reviewController = require('../controllers/reviewController');

const { jwtCheck, checkRequiredPermissions } = require('../utilities/auth.js');

// Get index page
router.get('/', placeController.index);

/* PLACES ROUTES */

// Get a list of places for a specific category (food, shopping, entertainment, landmark)
router.get('/places/:category/:pg', placeController.placeList);

// Get a specific place
router.get('/places/:id', placeController.placeDetails);

router.post(
    '/places/create',
    jwtCheck,
    checkRequiredPermissions(['create:place']),
    placeController.placeCreatePOST
);

/* REVIEW ROUTES */

// Get a list of reviews for a specific place
router.get('/places/:id/reviews/:pg', reviewController.reviewList);

// Get a specific review for a specific place
router.get('/places/:id/reviews/:reviewid', reviewController.reviewDetails);

// GET request to get form for creating a review for a specific place
router.get('/places/:id/reviews/create', reviewController.reviewCreateGET);

// POST request create a review for a specific place
router.post(
    '/places/:id/reviews/create',
    jwtCheck,
    reviewController.reviewCreatePOST
);

// GET request delete a review for a specific place
router.get(
    '/places/:id/reviews/:reviewid/delete',
    reviewController.reviewDeleteGET
);

// POST request delete a review for a specific place
router.post(
    '/places/:id/reviews/:reviewid/delete',
    jwtCheck,
    reviewController.reviewDeletePOST
);

placeController.index;
module.exports = router;
