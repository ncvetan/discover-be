const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: {
            type: String,
            enum: ['food', 'shopping', 'entertainment', 'landmark'],
            required: true,
        },
        description: { type: String, required: true },
        address: {
            countryCode: {
                type: String,
                minLength: 2,
                maxLength: 3,
                default: 'CA',
            },
            province: { type: String },
            city: { type: String },
            streetName: { type: String },
            streetNumber: { type: String },
            unit: { type: String },
            postalCode: { type: String },
        },
        phone: { type: String, default: 'Not listed' },
        attributes: [{ type: String, maxLength: 6 }],
        // Each day of the week has an array of start/end times. Using arrays allows for multiple intraday periods of open times.
        // If an array has a singular entry with s=0, e=1440, it will be open 24hrs that day, if s=0,e=0, it is closed.
        hours: {
            sun: [
                {
                    start: { type: Number, min: 0, max: 1440 },
                    end: { type: Number, min: 0, max: 1440 },
                },
            ],
            mon: [
                {
                    start: { type: Number, min: 0, max: 1440 },
                    end: { type: Number, min: 0, max: 1440 },
                },
            ],
            tue: [
                {
                    start: { type: Number, min: 0, max: 1440 },
                    end: { type: Number, min: 0, max: 1440 },
                },
            ],
            wed: [
                {
                    start: { type: Number, min: 0, max: 1440 },
                    end: { type: Number, min: 0, max: 1440 },
                },
            ],
            thu: [
                {
                    start: { type: Number, min: 0, max: 1440 },
                    end: { type: Number, min: 0, max: 1440 },
                },
            ],
            fri: [
                {
                    start: { type: Number, min: 0, max: 1440 },
                    end: { type: Number, min: 0, max: 1440 },
                },
            ],
            sat: [
                {
                    start: { type: Number, min: 0, max: 1440 },
                    end: { type: Number, min: 0, max: 1440 },
                },
            ],
        },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model('Place', PlaceSchema);
