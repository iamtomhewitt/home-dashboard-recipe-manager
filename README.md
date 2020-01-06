# Home Dashboard Recipe Manager [![Build Status](https://travis-ci.org/iamtomhewitt/home-dashboard-recipe-manager.svg?branch=master)](https://travis-ci.org/iamtomhewitt/home-dashboard-recipe-manager)

A Node Express app for managing recipes and ingredients for my [home dashboard](https://github.com/iamtomhewitt/home-dashboard).

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

URL: https://home-dashboard-recipe-manager.herokuapp.com/ingredients