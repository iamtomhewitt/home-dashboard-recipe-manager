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

## Documentation
Swagger:
`http://localhost:8080/swagger-ui.html`