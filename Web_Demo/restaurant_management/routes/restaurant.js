const express = require('express')
const router = express.Router()
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

var url = process.env.MONGO_URI;

const Grade = require('../models/Grade');
const Restaurant = require('../models/Restaurant');


router.route('/page/:pagination').post(async (req, res) => {
    let skipNum = (req.params.pagination - 1) * 10 
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("reviews_db");
        var query = {
            $or: [
                {name: new RegExp(req.body.textSearch, "i")},
                {restaurant_id: new RegExp(req.body.textSearch, "i")},
                {cuisine: new RegExp(req.body.textSearch, "i")},
                {borough: new RegExp(req.body.textSearch, "i")},
                {'address.street': new RegExp(req.body.textSearch, "i")},
            ]
        };
        dbo.collection("restaurants").find(query).skip(skipNum).limit(10).sort(req.body.objSortedd).toArray(function(err, result) {
            if (err) throw err;
            res.send(result)
            db.close();
        });
      });
    
})

router.route('/max-restaurant-id').get(async (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("reviews_db");
        dbo.collection("restaurants").find({}).sort({"restaurant_id": -1}).limit(1).toArray(function(err, result) {
            if (err) throw err;
            res.send(result)
            db.close();
        });
      });
    
})

router.route('/create-a-restaurant').post(async (req, res) => {
    try {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("reviews_db");
            var myObj = req.body
            dbo.collection("restaurants").insertOne(myObj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
        res.send({msg: "create success"});
    } catch (error) {
        res.send({msg: "not created"});
    }
})

router.route('/get-a-restaurant/:restaurantId').get(async (req, res) => {
    try {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("reviews_db");
            var query = {"restaurant_id" : req.params.restaurantId};
            dbo.collection("restaurants").find(query).toArray(function(err, result) {
                if (err) throw err;
                res.send(result[0])
                db.close();
            });
        });
    } catch (error) {
        res.send({msg: "Get a reataurant failed"});
    }
})


router.route('/update-restaurant/:restaurantId').put(async (req, res) => {
    try {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("reviews_db");
            var myquery = { restaurant_id: req.params.restaurantId };
            var newvalues = { $set: req.body };
            dbo.collection("restaurants").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close(); 
            });
        });
        res.send({msg: "updated success"});
    } catch (error) {
        res.send({msg: "not updated"});
    }
})

router.route('/delete-restaurant/:restaurantId').delete(async (req, res) => {
    try {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("reviews_db");
            var myquery = { restaurant_id: req.params.restaurantId };
            dbo.collection("restaurants").deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
                db.close();
            });
        });
        res.send({msg: "delete success"});
    } catch (error) {
        res.send({msg: "delete not updated"});
    }
})


router.route('/top3/best-rated-month').post(async (req, res) => {
    try {
        const month = req.body.month;
        let listGrade = await Grade.aggregate([
            {$match: {"grade": {$in: req.body.listGrade}}},
            {
               $project:
                 {
                   restaurant_id: "$restaurant_id", 
                   month: { $month: "$date" }
                 }
             },
             {$match: {"month": Number(month)}},
             {$group: {_id: {
                        restaurant_id: "$restaurant_id", 
                        month: "$month",}, total: {$count: {}} 
             }},
             {$sort: {"total": -1, "_id.restaurant_id":  1}},
             {$limit: Number(req.body.num)}
        ])

        let listResID = await listGrade.map(item => {
            return item._id.restaurant_id
        })

        let listRestaurant = await Restaurant.find({"restaurant_id": {$in: listResID}})

        let listResAndTotal = await listGrade.map(item => {
            return {
                restaurantId: item._id.restaurant_id,
                total: item.total
            }
        })

        let listResult = await listRestaurant.map((item, index) => {
            return {
                "_id": {
                    ...item._doc,
                    "month": Number(month)
                },
                "total": (listResAndTotal.find(res => res.restaurantId == item._doc.restaurant_id)).total
            }
        })


        listResult = listResult.sort(function (a, b) {
            return b.total - a.total
        })

        res.send(listResult)

    } catch (error) {
        console.log(error)
    }
})

router.route('/1-1/best-rated').post(async (req, res) => {

    let listGrade = await Grade.aggregate([
        {$match: {"grade": {$in: req.body.listGrade}}},
        //date from
        {$match: {"date": {$gte: new Date(req.body.dateFrom)}}},
        //date to
        {$match: {"date": {$lte: new Date(req.body.dateTo)}}},
        {$group: {_id: {restaurant_id: "$restaurant_id"}, total: {$count: {}} }},
        {$sort: {"total": -1, "_id.restaurant_id": -1}},
        {$limit: Number(req.body.num)}
    ])
    
    let listResID = await listGrade.map(item => {
        return item._id.restaurant_id
    })

    let listRestaurant = await Restaurant.find({"restaurant_id": {$in: listResID}})

    let listResAndTotal = await listGrade.map(item => {
        return {
            restaurantId: item._id.restaurant_id,
            total: item.total
        }
    })

    let listResult = await listRestaurant.map((item, index) => {
        return {
            "_id": {
                ...item._doc,
            },
            "total": (listResAndTotal.find(res => res.restaurantId == item._doc.restaurant_id)).total
        }
    })

    listResult = listResult.sort(function (a, b) {
        return b.total - a.total
    })

    res.send(listResult)
})



module.exports = router