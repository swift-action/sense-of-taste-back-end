'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const axios = require('axios');

const foodArr = require('./foods.json');
const fitnessArray = require('./fitness.json');


const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

mongoose.connect(`mongodb://localhost:27017/foods`, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/foods', getFoodHandler);
app.get('/foodSearch', searchFoodHandler);
app.get('/cheatsmeal', profileCheatHandler);
app.get('/favmeals', profileFavHandler);
app.get('/schedualmeals', profileSchedualHandler);
app.get('/fitness',getFetnessHandler);
app.post('/favFoods', favFoodsHandler);
app.post('/schedual', schedualHandler);
app.post('/cheat', cheatHandler);
app.delete('/cheatsmeal/:index', cheatDeleteHandeler);
app.delete('/schedualdelete/:index', schedualDeleteHandeler);
app.delete('/favdelete/:index', favDeleteHandeler);


const FoodSchema = new mongoose.Schema({
    name: String,
    image: String,
    ingredientLines: Object,
    calories: String,
    totalTime: String,
});

const favSchema = new mongoose.Schema({
    email: String,
    foods: [FoodSchema],
    favArray: [FoodSchema],
    cheatArray: [FoodSchema]
});

const foodModel = mongoose.model('foodModel', FoodSchema);
const userModel = mongoose.model('userModel', favSchema);




function favCollections() {
    const user1 = new userModel({
        email: 'balomari995@gmail.com',
        foods: [],
        favArray: [],
        cheatArray: []
    })
    const user2 = new userModel({
        email: 'sokiyna.naser@gmail.com',
        foods: [],
        favArray: [],
        cheatArray: []
    })
    const user3 = new userModel({
        email: 'saeedawwad450@gmail.com',
        foods: [],
        favArray: [],
        cheatArray: []
    })
    const user4 = new userModel({
        email: 'batoolayyad1996@yahoo.com',
        foods: [],
        favArray: [],
        cheatArray: []
    })
    const user5 = new userModel({
        email: 'amroalbarham@gmail.com',
        foods: [],
        favArray: [],
        cheatArray: []
    })
    const user6 = new userModel({
        email: 'ha2205713@gmail.com',
        foods: [],
        favArray: [],
        cheatArray: []
    })
    user1.save();
    user2.save();
    user3.save();
    user4.save();
    user5.save();
    user6.save();
}

//  favCollections();

function getFoodHandler(req, res) {
    let { email } = req.query;
    res.send(foodArr);
}


function searchFoodHandler(req, res) {
    console.log(req.query);
    const { mealName, maxCalories } = req.query;
      
    axios
        .get(`https://api.edamam.com/search?q=${mealName}&app_id=${process.env.FOOD_ID}&app_key=${process.env.FOOD_KEY}&from=0&to=30&calories=0-${maxCalories}&health=alcohol-free`)
        .then(item => {

            const firstFoodArr=[];
             item.data.hits.map(element => {
                if(element.recipe.calories<maxCalories){
                firstFoodArr.push({
                    name: element.recipe.label,
                    image: element.recipe.image,
                    ingredientLines: element.recipe.ingredientLines,
                    calories: Math.floor(element.recipe.calories),
                    totalTime: element.recipe.totalTime
                })
            }
            })

            res.send(firstFoodArr)

        }).catch(error => {
            res.status(500).send(`NOT FOUND ${error}`);
        })
}

function favFoodsHandler(req, res) {

    const { email, name, image, ingredientLines, calories, totalTime } = req.body;

    userModel.findOne({ email: email }, (error, userData) => {
        if (error) {
            res.send(`DATA NOT FOUND`)
        } else {
            let filterArray = userData.favArray.filter(item => {
                if (item.name == name)
                    return item;
            })
            if (filterArray.length == 0 && userData.favArray.length<3) {
                userData.favArray.push({
                    name: name,
                    image: image,
                    ingredientLines: ingredientLines,
                    calories: calories,
                    totalTime: totalTime
                })
            }
            userData.save();
            // console.log(userData.favArray);
        }

    })

}
function schedualHandler(req, res) {
    const { email, name, image, ingredientLines, calories, totalTime } = req.body;
    userModel.findOne({ email: email }, (error, userData) => {
        if (error) {
            console.log('WTF');
        } else {
            let filterArray = userData.foods.filter(item => {
                if (item.name == name)
                    return item;
            })
            if (userData.foods.length < 3 && filterArray.length == 0) {
                userData.foods.push({
                    name: name,
                    image: image,
                    ingredientLines: ingredientLines,
                    calories: calories,
                    totalTime: totalTime,
                })
            }
            userData.save();
        }
    })
}
function cheatHandler(req, res) {
    const { email, name, image, ingredientLines, calories, totalTime } = req.body;
    userModel.findOne({ email: email }, (error, userData) => {
        if (error) {
            console.log('error from cheatHandler');
        } else {
            if (userData.cheatArray.length < 1) {
                userData.cheatArray.push({
                    name: name,
                    image: image,
                    ingredientLines: ingredientLines,
                    calories: calories,
                    totalTime: totalTime,
                });
            }
            userData.save();
        }

    })

}

function profileCheatHandler(req, res) {
    // console.log(req.query);
    const { email } = req.query;
    userModel.findOne({ email: email }, (error, userData) => {
        if (error) {
            console.log('what ever i want bas jakar b batool')
        } else {
            userData.save();
            res.send(userData.cheatArray);
        }
    })
}

function cheatDeleteHandeler(req, res) {
    const { email } = req.query;
    const { index } = Number(req.params);
    userModel.findOne({ email: email }, (error, userData) => {
        if (error) {
            console.log('safsadf jakar b batool');
        } else {
            userData.cheatArray = [];
            userData.save();
            res.send([{
                name: 'go pick a cheat meal',
                image: 'https://geo-static.traxsource.com/files/images/36bf18cd2e6e946b0eb7b3ab2790e6ec.jpg',
                ingredientLines: 'why havent you picked a cheat meal yet',
                calories: 'dude...DUUUUDE',
                totalTime: 'WHY ARE YOU STILL READING THIS',
            }])
        }
    })
}

function profileSchedualHandler(req, res) {
    // console.log(req.query);
    const { email } = req.query;
    userModel.findOne({ email: email }, (error, userData) => {
        if (error) {
            console.log('jaker b saeed ');
        } else {
            // console.log(userData.foods);
            res.send(userData.foods);
        }

    })

}

function schedualDeleteHandeler(req, res) {
    // console.log(req.query);
    // console.log(req.params);
    const { email,idex } = req.query;
    const { index } = Number(req.params);
    console.log(index);

    userModel.findOne({ email: email }, (error, userData) => {
        if (error) {
            console.log('jaker b amrro');
        } else {
            // console.log(userData.foods);
            // const filteredData = userData[0].foods.((item, idx) => {
                // if (idx !== index)
                    // return idx !== index ;

            // })
            
            // userData[0].foods = filteredData;
            // console.log(filteredData);

            userData.foods.splice(idex,1)
            console.log(userData.foods);
            userData.save();
            res.send(userData.foods);
        }
    })
}
function profileFavHandler(req,res){
    let {email}=req.query;
    userModel.findOne({ email: email }, (error, userData) => {
        if (error) {
            console.log('jaker b saeed o heba ');
        } else {
            // console.log(userData.foods);
            res.send(userData.favArray);
        }
    })
}

function favDeleteHandeler(req,res){
 console.log(req.query);
 let {email,idex}=req.query;
 let {index}=Number(req.params);
userModel.findOne({email:email}, (error, userData)=>{
    if (error){
        console.log('ya rab batol t5ales');
    }else{
        userData.favArray.splice(idex,1);
        console.log(userData.favArray);
        userData.save();
        res.send(userData.favArray);
    }
  }) 
}


function getFetnessHandler (req,res){
    let { email } = req.query;
    res.send(fitnessArray);
}

app.listen(PORT, () => {
    console.log(`Listen on PORT ${PORT}`)
})


