'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const axios = require('axios');

const foodArr = require('./foods.json');
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

mongoose.connect(`mongodb://localhost:27017/foods`, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/foods', getFoodHandler);
app.get('/foodSearch', searchFoodHandler);
app.post('/favFoods', favFoodsHandler);

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
    favArray:[FoodSchema],
    cheatArray:[FoodSchema]
});

const foodModel = mongoose.model('foodModel', FoodSchema);
const userModel = mongoose.model('userModel', favSchema);

// function foodCollection() {
//     const recipe1 = new foodModel({
//         name: 'Apple pie',
//         image: 'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBpZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//         ingredientLines: ["4 large eggs", "1 cup sugar (I did 3/4 cup)", "zest and juice of 1 lime", "2 tablespoons dark rum (I did 1.5 T)", "1/4 teaspoon salt", "1/4 cup unbleached all-purpose flour", "1/4 cup (55g) melted butter", "2 cups (362g) chopped fresh pineapple", "pie crust for a double-c…, or use your favorite)", "raw sugar, for garnish"],
//         calories: '2905',
//         totalTime: '45',
//     })
//     const recipe2 = new foodModel({
//         name: 'spaghetti',
//         image: 'https://images.unsplash.com/photo-1589227365533-cee630bd59bd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c3BhZ2hldHRpfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//         ingredientLines: ["200.0g trimmed green beans , cut in half", "olive oil , for drizzling", "120 g tub fresh pesto", "300.0g spaghetti", "300.0g new potatoes , sliced"],
//         calories: '1915',
//         totalTime: '30',
//     })
//     const recipe3 = new foodModel({
//         name: 'Chicken Vesuvio',
//         image: 'https://www.edamam.com/web-img/e42/e42f9119813e890af34c259785ae1cfb.jpg',
//         ingredientLines: ["1/2 cup olive oil", "5 cloves garlic, peeled", "2 large russet potatoes, peeled and cut into chunks", "1 3-4 pound chicken, cut into 8 pieces (or 3 pound chicken legs)", "3/4 cup white wine", "3/4 cup chicken stock", "3 tablespoons chopped parsley", "1 tablespoon dried oregano", "Salt and pepper", "1 cup frozen peas, thawed"],
//         calories: '4228',
//         totalTime: '60',
//     })
//     const recipe4 = new foodModel({
//         name: 'Chicken Paprikash',
//         image: 'https://www.edamam.com/web-img/e12/e12b8c5581226d7639168f41d126f2ff.jpg',
//         ingredientLines: ["640 grams chicken - drumsticks and thighs ( 3 whole chicken legs cut apart)", "1/2 teaspoon salt", "1/4 teaspoon black pepper", "1 tablespoon butter – cultured unsalted (or olive oil)", "240 grams onion sliced thin (1 large onion)", "70 grams Anaheim pepper chopped (1 large pepper)", "25 grams paprika (about 1/4 cup)", "1 cup chicken stock", "1/2 teaspoon salt", "1/2 cup sour cream", "1 tablespoon flour – all-purpose"]
//         ,
//         calories: '3033',
//         totalTime: '60',
//     })
//     const recipe5 = new foodModel({
//         name: 'Baked Chicken',
//         image: 'https://www.edamam.com/web-img/01c/01cacb70890274fb7b7cebb975a93231.jpg',
//         ingredientLines: ["6 bone-in chicken breast halves, or 6 chicken thighs and wings, skin-on", "1/2 teaspoon coarse salt", "1/2 teaspoon Mrs. Dash seasoning", "1/4 teaspoon freshly ground black pepper"],
//         calories: '901',
//         totalTime: '60',
//     })
//     const recipe6 = new foodModel({
//         name: 'Chicken Liver Pâté',
//         image: 'https://www.edamam.com/web-img/480/480000e79dbdd4648c4acd65630ff654.jpg',
//         ingredientLines: ["8 oz. chicken livers, cleaned", "4 cups chicken stock", "2 tbsp. rendered chicken fat or unsalted butter", "½ medium yellow onion, minced", "1½ tbsp. cognac or brandy", "2 hard-boiled eggs", "Kosher salt and freshly ground black pepper, to taste", "Toast points, for serving"]
//         ,
//         calories: '1149',
//         totalTime: '60',
//     })
//     const recipe7 = new foodModel({
//         name: 'Radicchio and Roasted Sweet Potatoes',
//         image: 'https://assets.bonappetit.com/photos/5c8ac6bb18e26d32b7735c99/1:1/w_2560%2Cc_limit/Dinner-Salad-with-Radicchio-and-Roasted-Sweet-Potatoes.jpg',
//         ingredientLines: ["1 whole chicken, about 3-4 pounds", "-- Salt and fresh-ground pepper, to taste", "3 to 4 sprigs thyme, or other herbs", "-- Olive oil, to taste", "-- Chicken stock (optional)"],
//         calories: '2638',
//         totalTime: '20',
//     })
//     const recipe8 = new foodModel({
//         name: 'Greek Salad Topped Hummus',
//         image: 'https://data.thefeedfeed.com/static/2020/01/27/15784286455e14e8e592b21.jpg',
//         ingredientLines: [["1½ teaspoons canola oil", "½ small shallot, finely chopped", "1 cup (about ½ pound) raw, boneless chicken meat (preferably from 3 boneless chicken thighs), roughly chopped", "⅔ cup (about ¼ pound) chicken skin and fat (reserved from the 3 chicken thighs)", "2 chicken livers (optional)", "2 garlic cloves, finely chopped", "¼ cup finely chopped chives, plus extra for serving", "1¼ teaspoons kosher salt", "¾ teaspoon freshly ground black pepper", "30 to 34 square wonton wrappers", "8 cups store-bought or homemade chicken broth"]],
//         calories: '4387',
//         totalTime: '10',
//     })
//     const recipe9 = new foodModel({
//         name: 'Green tortilla with smoked salmon',
//         image: 'https://images.immediate.co.uk/production/volatile/sites/2/2020/01/OLI-0220_Everyday-GreenTortilla_02021-a2fbdcd.jpg?webp=true&quality=90&resize=620%2C413',
//         ingredientLines: [
//             "8 oz. chicken livers, cleaned",
//             "4 cups chicken stock",
//             "2 tbsp. rendered chicken fat or unsalted butter",
//             "½ medium yellow onion, minced",
//             "1½ tbsp. cognac or brandy",
//             "2 hard-boiled eggs",
//             "Kosher salt and freshly ground black pepper, to taste",
//             "Toast points, for serving"
//         ],
//         calories: '4447',
//         totalTime: '60',
//     })
//     const recipe10 = new foodModel({
//         name: 'Breakfast Wraps',
//         image: 'https://www.tasteofhome.com/wp-content/uploads/2018/01/Breakfast-Wraps_EXPS_TOHPP19_35683_B08_23_6b-6.jpg?fit=700,1024',
//         ingredientLines: [
//             "1 pound chicken cut in pieces",
//             "4 carrots",
//             "1 onion",
//             "1 leek",
//             "1 green pepper",
//             "kosher salt",
//             "Freshly ground black pepper",
//             "Extra Virgin Olive Oil",
//             "1 cup white wine",
//             "Chicken broth"
//         ],
//         calories: '4387',
//         totalTime: '10',
//     })
//     recipe1.save();
//     recipe2.save();
//     recipe3.save();
//     recipe4.save();
//     recipe5.save();
//     recipe6.save();
//     recipe7.save();
//     recipe8.save();
//     recipe9.save();
//     recipe10.save();
// }
// foodCollection();

function favCollections() {
    const user1 = new userModel({
        email: 'balomari995@gmail.com',
        foods: [],
        favArray:[],
        cheatArray:[]
    })
    const user2 = new userModel({
        email: 'sokiyna.naser@gmail.com',
        foods: [],
        favArray:[],
        cheatArray:[]
    })
    const user3 = new userModel({
        email: 'saeedawwad450@gmail.com',
        foods: [],
        favArray:[],
        cheatArray:[]
    })
    const user4 = new userModel({
        email: 'batoolayyad1996@yahoo.com',
        foods: [],
        favArray:[],
        cheatArray:[]
    })
    const user5 = new userModel({
        email: 'amroalbarham@gmail.com',
        foods: [],
        favArray:[],
        cheatArray:[]
    })
    const user6 = new userModel({
        email: 'ha2205713@gmail.com',
        foods: [],
        favArray:[],
        cheatArray:[]
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

    const { mealName, maxCalories } = req.query;

    axios
        .get(`https://api.edamam.com/search?q=chicken&app_id=${process.env.FOOD_ID}&app_key=${process.env.FOOD_KEY}&from=0&to=30&calories=591-722&health=alcohol-free`)
        .then(item => {

            const firstFoodArr = item.data.hits.map(element => {
                return ({
                    name: element.recipe.label,
                    image: element.recipe.image,
                    ingredientLines: element.recipe.ingredientLines,
                    calories: element.recipe.calories,
                    totalTime: element.recipe.totalTime
                })
            }
            )

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
        } else  {
            let filterArray = userData.favArray.filter(item=>{
            if(item.name == name)
            return item;             
            })
            if (filterArray.length == 0){
           userData.favArray.push({
                name: name,
                image: image,
                ingredientLines: ingredientLines,
                calories: calories,
                totalTime: totalTime
            })
        }
            // userData.save();
            console.log(userData.favArray);
        }

    })

}


app.listen(PORT, () => {
    console.log(`Listen on PORT ${PORT}`)
})


