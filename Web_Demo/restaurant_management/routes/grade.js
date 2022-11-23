const express = require('express');
var mongoose = require('mongoose');
const router = express.Router()
// var url = "mongodb+srv://ninhnam:12341234@cluster0.bk54g.mongodb.net/reviews_db?retryWrites=true&w=majority";
// var url = "mongodb://localhost:27017/";

const Grade = require('../models/Grade');


router.route('/detail/:id').get(async (req, res) => {
    try {
        let gradeDetail = await Grade.find({restaurant_id: req.params.id})
        res.send(gradeDetail)
    } catch (error) {
        res.status(404).json(error)
    }
})

router.route('/rated/:restaurantId/:grate/:score').post(async (req, res) => {
    try {
        let newGrade = await new Grade({
            restaurant_id: req.params.restaurantId,
            date: new Date,
            grade: req.params.grate,
            score: Number(req.params.score)
        })

        await newGrade.save()
        res.send({msg: "add rated success"});
    } catch (error) {
        res.send({msg: "not updated"});
    }
})

router.route('/delete/listGrade').put(async (req, res) => {
    try {
        console.log(req.body)
        let deleteArr = req.body.map(item => {
            return mongoose.Types.ObjectId(item)
        });
        console.log(deleteArr)
        await Grade.deleteMany({_id: {$in: deleteArr}})
        req.send("delete success")
    } catch (error) {
        res.send({msg: "not updated"});
    }
})

router.route('/chart/column-chart').get(async (req, res) => {
    try {
        let twelveMonthRating = await Grade.aggregate([
            {
                $project:
                    {
                    restaurant_id: "$restaurant_id", 
                    month: { $month: "$date" }
                    }
            },
            {$group: {_id: { month: "$month"}, total: {$count: {}} }},
            {$sort: {"_id.month":  1}},
         ])

        res.send(twelveMonthRating)
    } catch (error) {
        res.send({"msg": "failed get 12 month rating"})
    }
})

router.route('/chart/doughnut-chart').get(async (req, res) => {
    try {
        let gradeLevel = await Grade.aggregate([
            {
                $project:
                    {
                    restaurant_id: "$restaurant_id", 
                    grade: "$grade"
                    }
            },
            {$group: {_id: { grades: "$grade"}, total: {$count: {}} }},
            {$sort: {"total": -1, "_id.grades":  1}},
        ])

        res.send(gradeLevel)
    } catch (error) {
        res.send({"msg": "failed get  grade level"})
    }
})



module.exports = router