# Home Dashboard Recipe Manager

A Node Express app for managing recipes and ingredients for my [home dashboard](github.com/iamtomhewitt/home-dashboard).

## Endpoints

### `/ingredients`
* Returns all the stored ingredients
* `200 success`
```json
{
	"ingredients": [
		"onion",
		"peppers",
		"tomato puree",
		"etc..."
	]
}
```

### `/ingredients/add`
* Adds a new ingredient using the name specified in the query parameter
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

### `/ingredients/delete`
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


### `/recipes`
* Returns all the stored recipe names we currently have.
* `200 success`
```json
{
	"recipes": [
		"Pasta Bake",
		"Burgers",
		"Thai Chicken",
		"etc..."
	]
}
```

### `/recipes/<recipe name>`
* Returns the recipe identified by the name along with the ingredients and amounts
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

### `/recipes/add`
* Adds a new recipe using the name specified in the query parameter.
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

### `/recipes/delete`
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