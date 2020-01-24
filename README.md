

<h1 align="center">Home Dashboard Recipe Manager </h1>
<p align="center">
	A Node Express app for managing recipes and ingredients for my <a href="https://github.com/iamtomhewitt/home-dashboard">home dashboard</a>.
</p>
<p align="center">
	<img src="https://travis-ci.org/iamtomhewitt/home-dashboard-recipe-manager.svg"/>
	<img src="https://heroku-badge.herokuapp.com/?app=home-dashboard-recipe-manager&style=round&svg=1"/>
</p>

## Pipeline
* `Travis` tests the repo using `npm test`, which runs `mocha 'tests/**/*.js' --exit`
* Once the tests pass, `Heroku` deploys the app.
* When the app is deployed, you can make requests to it.

## Endpoints

### `/ (GET)`
The root endpoint, returning information about the app.

#### Responses
* `200 success`
```json
{
    "status": "🍽📝 SERVER OK",
    "version": "1.0.1",
    "endpoints": [
        {
            "path": "/recipes",
            "methods": [
                "GET"
            ]
        },
        {
            "path": "/recipes/add",
            "methods": [
                "POST"
            ]
        },
        {
            "path": "/recipes/delete",
            "methods": [
                "DELETE"
            ]
        },
        {
            "path": "/planner",
            "methods": [
                "GET"
            ]
        },
        {
            "path": "/planner/add",
            "methods": [
                "POST"
            ]
        },
        {
            "path": "/",
            "methods": [
                "GET"
            ]
        }
    ]
}
```

### `/recipes (GET)`
Returns all the stored recipe names we currently have. Specifying a name parameter returns a single recipe: `/recipes?name=Pasta Bake`
#### Responses
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

### `/recipes/add (POST)`
Adds a new recipe.
#### Request Body
```json
{
    "name": "<recipe name>",
    "ingredients": [
        {
            "name": "<name>",
            "category": "<category>",
            "amount": "<amount>",
            "weight": "<weight>"
        }
    ]
}
```
#### Responses
* `200 success`
```json
{
    "status": 200,
    "message": "<recipe name> successfully added"
}
```

* `400 error` if JSON payload was incorrect
```json
{
    "status": 400,
    "message": "Recipe could not be added, missing data from JSON body. Expected: <JSON> Got: <JSON>"
}
```

* `502 error` if the recipe could not be saved
```json
{
    "status": 502,
    "message": "<recipe> could not be added <error message>"
}
```

### `/recipes/delete (DELETE)`
Deletes a recipe.
#### Request Body
```json
{
    "name": "<recipe name>"
}
```
#### Responses
* `200 success`
```json
{
    "status": 200,
    "message": "<recipe> successfully deleted"
}
```

* `400 error` if the JSON payload was incorrect
```json
{
    "status": 400,
    "message": "Recipe could not be deleted: Missing 'name' parameter from JSON body"
}
```

* `404` if the recipe is not found
```json
{
    "status": 404,
    "message": "<recipe> not found"
}
```

* `502 error` if the recipe could not be saved
```json
{
    "status": 502,
    "message": "<recipe> could not be added <error message>"
}
```

### `/planner (GET)`
Returns the weekly meal plan. Specifying a day in the query parameter will return a specific day: `/planner?day=Monday`

#### Responses
* `200 success`
```json
{
	"status": 200,
    "planner": [
        {
            "day": "Monday",
            "recipe": "Pasta Bake"
        },
        {
            "name": "Tuesday",
            "recipe": "Chicken Curry"
        },
        {
            "name": "and so on",
            "recipe": "and so on"
        }
    ]
}
```

### `/planner/add (POST)`
Adds a recipe to a specific day of the planner. Specifying the same day will overwrite the existing entry.
#### Request Body
```json
{
    "day": "<day>",
    "recipe": "<recipe name>"
}
```
#### Responses
* `200 success`
```json
{
    "status": 200,
    "message": "<recipe> successfully added to the planner on <day>"
}
```
* `400` if the JSON payload is incorrect
```json
{
    "status": 400,
    "message": "Recipe could not be added, missing data from JSON body. Expected: <JSON> Got: <JSON>"
}
```

* `502 error` if the recipe could not be saved
```json
{
    "status": 502,
    "message": "<recipe> could not be added <error message>"
}
```
