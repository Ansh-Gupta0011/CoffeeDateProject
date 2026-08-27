const mongoose = require("mongoose");

const cafeSchema = new mongoose.Schema(
    {
        id: {
            type: mongoose.Schema.Types.Mixed
        },

        name: {
            type: String,
            required: true
        },

        address: {
            type: String,
            default: ""
        },

        rating: {
            type: Number,
            default: null
        },

        ratingCount: {
            type: Number,
            default: 0
        },

        mapsUrl: {
            type: String,
            default: ""
        }
    },
    { _id: false }
);

const coffeeDateSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        cafe: {
            type: cafeSchema,
            required: true
        },

        userIp: {
            type: String,
            default: ""
        },

        userLocation: {
            lat: {
                type: Number,
                default: null
            },

            lng: {
                type: Number,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "CoffeeDate",
    coffeeDateSchema
);