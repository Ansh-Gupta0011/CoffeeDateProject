const express = require("express");

const CoffeeDate = require(
    "../models/CoffeeDate"
);

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {
            date,
            time,
            cafe,
            userIp,
            userLocation
        } = req.body;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required"
            });
        }

        if (!time) {
            return res.status(400).json({
                success: false,
                message: "Time is required"
            });
        }

        if (!cafe || !cafe.name) {
            return res.status(400).json({
                success: false,
                message: "Cafe is required"
            });
        }

        const coffeeDate =
            await CoffeeDate.create({
                date,
                time,
                cafe,
                userIp,
                userLocation
            });

        console.log(
            "Coffee date saved:",
            coffeeDate._id
        );

        return res.status(201).json({
            success: true,
            message:
                "Coffee date saved successfully",
            data: coffeeDate
        });

    } catch (error) {
        console.error(
            "Coffee date save error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to save coffee date"
        });
    }
});

module.exports = router;