[![Build Status](https://travis-ci.org/iamtomhewitt/home-dashboard-recipe-manager.svg?branch=master)](https://travis-ci.org/iamtomhewitt/home-dashboard-recipe-manager) ![Heroku](https://heroku-badge.herokuapp.com/?app=home-dashboard-recipe-manager&style=flat&svg=1)

# Home Dashboard Recipe Manager 
A Node Express app for managing recipes and ingredients for my [home dashboard](https://github.com/iamtomhewitt/home-dashboard).

## Pipeline
* `Travis` tests the repo using `npm test`, which runs `mocha 'tests/**/*.js' --exit`
* Once the tests pass, `Heroku` deploys the app
* When the app is deployed, you can make requests to it [here](https://home-dashboard-recipe-manager.herokuapp.com/)

## Endpoints

### `/ingredients (GET)`
* Returns all the stored ingredients
* `200 success`
```json
{
    "ingredients": [
        {
            "name": "pepper",
            "type": "vegetable"
        },
        {
            "name": "chicken",
            "type": "meat"
        },
        {
            "name": "etc",
            "type": "etc"
        }
    ]
}
```

### `/ingredients/add (GET)`
* Adds a new ingredient using the name and type specified in the query parameter
* `200 success`
```json
{
    "status": 200,
    "message": "<ingredient> successfully added"
}
```
* `502 error` if the ingredient could not be saved
```json
{
    "status": 502,
    "message": "<ingredient> could not be added <error message>"
}
```

### `/ingredients/delete (GET)`
* Deletes an ingredient using the name specified in the query parameter.
* `200 success`
```json
{
    "status": 200,
    "message": "<ingredient> successfully deleted"
}
```
* `502 error` if the ingredient could not be deleted
```json
{
    "status": 502,
    "message": "<ingredient> could not be deleted <error message>"
}
```
* `404 ingredient not found`
```json
{
    "status": 404,
    "message": "<ingredient> not found"
}
```


### `/recipes (GET)`
* Returns all the stored recipe names we currently have.
* `200 success`
```json
{
    "recipe": {
        "name": "Pasta Bake",
        "ingredients": [
            {
                "name": "pasta",
                "amount": "200",
                "weight": "grams"
            },
            {
                "name": "onions",
                "amount": "50",
                "weight": "grams"
            },
            {
                "name": "salt",
                "amount": "1",
                "weight": "teaspoon"
            },
            "and so on..."
        ]
    }
}
```

* Specifying a name parameter returns a single recipe `/recipes?name=Pasta Bake`

### `/recipes/add (POST)`
* Adds a new recipe using the name specified in the JSON payload.
* The ingredients, and their amounts should be sent in the JSON payload.
* `200 success`
```json
{
    "status": 200,
    "message": "<recipe name> successfully added"
}
```

* `502 error` if the recipe could not be added
```json
{
    "status": 502,
    "message": "<recipe> could not be added <error message>"
}
```

### `/recipes/delete (GET)`
* Deletes a recipe using the name specified in the query parameter.
* `200 success`
```json
{
    "status": 200,
    "message": "<recipe> successfully deleted"
}
```
* `502 error` if the recipe could not be deleted
```json
{
    "status": 502,
    "message": "<recipe> could not be deleted <error message>"
}
```
* `404 recipe not found`
```json
{
    "status": 404,
    "message": "<recipe> not found"
}
```





### `/planner (GET)`
* Returns the weekly meal plan
* `200 success`
```json
{
    "planner": [
        {
            "day": "Monday",
            "recipe": "Pasta Bake"
        },
        {
            "name": "Tuesday",
            "type": "Chicken Curry"
		},
        {
            "name": "and so on",
            "type": "and so on"
		}
    ]
}
```
* Specifying a day in the query parameter will return a specific day: `/planner?day=Monday`

### `/planner/add (POST)`
* Adds a recipe to a specific day of the planner
* The name of the recipe and the day of the week should be included in the JSON payload
* Specifying the same day will overwrite the existing entry
* `200 success`
```json
{
    "status": 200,
    "message": "<recipe> successfully added to the planner on <day>"
}
```
