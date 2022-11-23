const express = require('express')
const router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://ninhnam:12341234@cluster0.bk54g.mongodb.net/reviews_db?retryWrites=true&w=majority";
// var url = "mongodb://localhost:27017/";


router.route('/page/:pagination').post(async (req, res) => {
    let skipNum = (req.params.pagination - 1) * 10 
    
    MongoClient.connect(url, function(err, db) {
        console.log(req.body.textSearch)
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


router.route('/1-1/best-rated').post(async (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("reviews_db");
        dbo.collection("restaurants").aggregate([
            {$unwind: "$grades"},
            {$match: {"grades.grade": {$in: req.body.listGrade}}},
            //date from
            {$match: {"grades.date": {$gte: new Date(req.body.dateFrom)}}},
            //date to
            {$match: {"grades.date": {$lte: new Date(req.body.dateTo)}}},
            {$group: {_id: {name: "$name", cuisine: "$cuisine", restaurant_id: "$restaurant_id", address: "$address", borough: "$borough"}, total: {$count: {}} }},
            {$sort: {"total": -1, "_id.name": -1}},
            {$limit: Number(req.body.num)}
        ]).toArray(function(err, result) {
            if (err) throw err;
            console.log(result)
            res.send(result)
            db.close();
        });
      });
})

router.route('/top3/best-rated-month').post(async (req, res) => {
    const month = req.body.month;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("reviews_db");
        dbo.collection("restaurants").aggregate([
            {$unwind: "$grades"},
            {$match: {"grades.grade": {$in: req.body.listGrade}}},
            {
               $project:
                 {
                   name: "$name", 
                   cuisine: "$cuisine", 
                   restaurant_id: "$restaurant_id", 
                   address: "$address", 
                   borough: "$borough", 
                   grades: "$grades",
                   month: { $month: "$grades.date" }
                 }
             },
             {$match: {"month": Number(month)}},
            {$group: {_id: {
                name: "$name", 
                cuisine: "$cuisine", 
                restaurant_id: "$restaurant_id", 
                address: "$address", 
                borough: "$borough",
                month: "$month",}, total: {$count: {}} }},
            {$sort: {"total": -1, "_id.restaurant_id":  1}},
            {$limit: Number(req.body.num)}
        ]).toArray(function(err, result) {
            if (err) throw err;
            res.send(result)
            db.close();
        });
      });
})





module.exports = router