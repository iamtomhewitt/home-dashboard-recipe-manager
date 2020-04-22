<h1 align="center">Home Dashboard Recipe Manager </h1>
<p align="center">
    A Node Express app for managing recipes and ingredients for my <a href="https://github.com/iamtomhewitt/home-dashboard">home dashboard</a>.
</p>
<p align="center">
    <img src="https://travis-ci.com/iamtomhewitt/home-dashboard-recipe-manager.svg"/>
    <img src="https://heroku-badge.herokuapp.com/?app=home-dashboard-recipe-manager&style=round&svg=1"/>
</p>

## Docker 🐳
```bash
> docker-compose up
```

## Pipeline
* `Travis` tests the repo using `npm test`, which runs `mocha 'tests/**/*.js' --exit`
* Once the tests pass, `Heroku` deploys the app.
* When the app is deployed, you can make requests to it.

## Endpoints

## `/ (GET)`
The root endpoint, returning information about the app.

### Responses
* `200` success
```json
{
    "status": "🍽📝 SERVER OK",
    "version": "1.1.0",
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
            "path": "/recipes/update",
            "methods": [
                "PUT"
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
            "path": "/planner/createPlanner",
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

## `/recipes (GET)`
Returns all the stored recipe names we currently have. An API key must be specified. Specifying a name parameter returns a single recipe: `/recipes?name=Pasta Bake&apiKey=<key>`
### Responses
* `200` success
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
            {
                "name": "and so on"
            }
		],
		"steps": [
			"1. Do something",
			"2. Do something else"
		]
    }
}
```

## `/recipes/add (POST)`
Adds a new recipe.
### Request Body
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
    ],
	"steps": [
		"1. Do something",
		"2. Do something else"
	],
    "apiKey": "<key>"
}
```
### Responses
* `200` success
```json
{
    "status": 200,
    "message": "<recipe name> successfully added"
}
```

* `400` error if JSON payload was incorrect
```json
{
    "status": 400,
    "message": "Recipe could not be added, missing data from JSON body. Expected: <JSON> Got: <JSON>"
}
```

* `401` if unauthorised
```json
{
    "status": 401,
    "message": "API key is incorrect"
}
```

* `500` error if the recipe could not be saved
```json
{
    "status": 500,
    "message": "<recipe> could not be added <error message>"
}
```

## `/recipes/update (PUT)`
Updates an existing recipe.
### Request Body
```json
{
    "originalName": "<recipe name>",
    "newName": "<recipe name>",
    "ingredients": [
        {
            "name": "<name>",
            "category": "<category>",
            "amount": "<amount>",
            "weight": "<weight>"
        }
    ],
	"steps": [
		"1. Do something",
		"2. Do something else"
	],
    "apiKey": "<key>"
}
```
### Responses
* `200` success
```json
{
    "status": 200,
    "message": "<recipe name> successfully updated"
}
```

* `201` created if an attempt was made to update a non existing recipe
```json
{
    "status": 201,
    "message": "<recipe name> could not be updated as it does not exist, so it was created instead"
}
```

* `400` error if JSON payload was incorrect
```json
{
    "status": 400,
    "message": "Recipe could not be updated, missing data from JSON body. Expected: <JSON> Got: <JSON>"
}
```

* `401` if unauthorised
```json
{
    "status": 401,
    "message": "API key is incorrect"
}
```

* `500` error if the recipe could not be saved
```json
{
    "status": 500,
    "message": "<recipe> could not be updated <error message>"
}
```

## `/recipes/delete (DELETE)`
Deletes a recipe.
### Request Body
```json
{
    "name": "<recipe name>",
    "apiKey": "<key>"
}
```
### Responses
* `200` success
```json
{
    "status": 200,
    "message": "<recipe> successfully deleted"
}
```

* `400` error if the JSON payload was incorrect
```json
{
    "status": 400,
    "message": "Recipe could not be deleted: Missing 'name' parameter from JSON body"
}
```

* `401` if unauthorised
```json
{
    "status": 401,
    "message": "API key is incorrect"
}
```

* `404` if the recipe is not found
```json
{
    "status": 404,
    "message": "<recipe> not found"
}
```

* `500` error if the recipe could not be saved
```json
{
    "status": 500,
    "message": "<recipe> could not be added <error message>"
}
```

## `/planner (GET)`
Returns the weekly meal plan. An API key is required. Specifying a day in the query parameter will return a specific day.

Query parameters:
* `apiKey`
* `plannerId`
* `day` (optional) 

### Responses
* `200` success
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

## `/planner/add (POST)`
Adds a recipe to a specific day of the planner. Specifying the same day will overwrite the existing entry.
### Request Body
```json
{
    "day": "<day>",
    "recipe": "<recipe name>",
    "apiKey": "<key>",
    "plannerId": "<id>"
}
```
### Responses
* `200` success
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

* `401` if unauthorised
```json
{
    "status": 401,
    "message": "API key is incorrect"
}
```

* `500` error if the recipe could not be saved
```json
{
    "status": 500,
    "message": "<recipe> could not be added <error message>"
}
```

## `/planner/createPlanner (POST)`
Creates a new planner.
### Request Body
```json
{
    "apiKey": "<key>",
    "plannerId": "<id>"
}
```
### Responses
* `200` success
```json
{
    "status": 200,
    "message": "Planner created"
}
```

* `400` if the JSON payload is incorrect
```json
{
    "status": 400,
    "message": "Planner could not be created, missing data from JSON body. Expected: <JSON> Got: <JSON>"
}
```

* `401` if unauthorised
```json
{
    "status": 401,
    "message": "API key is incorrect"
}
```

* `500` error if the recipe could not be saved
```json
{
    "status": 500,
    "message": "Planner could not be created: <error message>"
}
```
