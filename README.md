# Stylobate: Dockerized FastAPI-React Starter Project

A starting point for quick-to-implement, easy-to-deploy and lightweight web applications.

* [Design Philosophy](#Design%20Philosophy)
* [Design Antiphilosophy](#Design%20Antiphilosophy)
* [Infrastucture Stack](#Infrastucture%20Stack)
* [Features](#Features)
* [Requiremesnts](#Requirements)
* [Getting Started](#Getting%20Started)
    1. [Set up database](#Set%20up%20database)
    2. [Set up endpoints](#Set%20up%20endpoints)
    3. [Set up frontend](#Set%20up%20frontend)
    4. [Run in Production](#Run%20in%20Production)
* [File Structure](#File%20Structure)

## Design Philosophy

Generally in putting this together I was following the following principles:

### Ease of Development

Most important of all, I will be using this for a variety of random side projects. The majority of these I won't necessarily finish, or even bring to a usable state, but the building by itself is fun, and with that in mind, I wanted to make it as easy to develop on as possible. Specifically, I wanted the following:
* **Clean organization**: I want things to go in sensible places. Backend code goes in `backend`, frontend goes in `frontend`, etc.
* **Hot Reloading**: no compilation while in development
* **Flexible languages**: Python and JS are easy to quickly do stuff with, for a variety of reasons
* **Optional Type Checking**: Type checking sometimes makes code a lot clearer and easier to reason about, and sometimes it is a bit of an overhead. With Python Type Hints and optional Flow, I can make the choice whether I want to include it or not

### Ease of Deployment

While I won't necessarily finish projects that I start with Stylobate, I would like to at least be able to deploy them. I don't want to spend a bunch of effort to do that though, as it is pretty orthogonal to most things I would build. Hence: Dockerization.

### Performance/Lightness

Most of my deployments are going to be on my Raspberry Pi or a very cheap VM, so I want to reduce computation where possible and make it light where possible. Hence the SQLite

## Design Antiphilosophy

When putting this together, I specifically did **NOT** prioritize:
* Testing:
    * I believe quality automated integration- and unit-testing is necessary for good, maintainable code.
    * I also almost never write tests for personal projects, because most of the time I am not aiming for maintainable code as much as fun code
    * So I haven't built up the infrastructure for testing very much. It should be relatively easy to add on to FastAPI and Create React App
* Strict Correctness
    * Strict type checking and exhaustive error handling are also very nice to have for good, maintainable code
    * They are also more work, though, so: have not spent much effort on this

## Infrastucture Stack
I built this project as a quick jumping off point for whatever webapp I want to use. It integrates the following technologies, in rough order from back to front:

* Docker
* Sqlite
* Alembic
* SqlAlchemy
* ASGI
* Uvicorn
* Gunicorn
* Python 3.8
* FastAPI
* OpenAPI/Swagger
* Pydantic
* ES6/JSX
* create-react-app
* react-dom-router
* MaterialUI

## Features

Lots of fun features are built in!
* Management Script
    * Rather than learn all the syntax of the various programs used, you can just use the [stylobate-mgmt](https://github.com/digitaltembo/stylobate-mgmt) script to manage things
    * Inspired by Django and Flask's `manage.py`
* Production Ready
    * Just build the Dockerfile.prod image and deploy it: `stylo build --docker-prod && stylo run --docker-prod`
* Containers
    * Both development and production Dockerfiles are provided
* Non-Containers
    * Containers can be annoying and confusing and you don't have to use them
* Auto-generated migrations
    * Curtesy of Alembic/SqlAlchemy, simply define the your models in the `backend/db/models` directory, and let Alembic figure out what you made or how you changed things
    * Generate new migrations with `stylo db --gen-migrations "some message"`, run them with `stylo db --up`
* Hot Reloading
    * In development, using `uvicorn` and `create-react-app`, backend and frontend code is reloaded on the fly when you edit things, and mostly just works
* Type Verification
    * Build the inputs and outputs with Pydantic models and you have a bunch of cool verification built in!
    * Include `// @flow` at the top of JSX files to enforce type safety, and run `stylo build --flow` to verify
* Endpoint Authorization
    * Just include `auth = Depends(UserAuth))` in your endpoint argument list to require user authorization, and use `<MyQuery authRequired>` in the JSX to send the authorization from the backend
* API Documentation
    * Curtesy of FastAPI, Swagger API documentation is automatically produced and served at [url]/docs
    * **Additionally,** this documentation includes code for manually triggering api endpoints, which is convenient for manual testing
* Prettyness
    * Just use the MaterialUI library to get pretty and useful UX elements


## Requirements

* Python 3.8
    * Some lower versions may work, but this uses a lot of recent features
* Node 10
* Yarn
    * `npm install -g yarn`
* **Optional:** Docker
    * If you want to run the containerized server
* **Optional:** `stylobate-mgmt`
    * `pip install stylobate-mgmt`
    * Makes a lot of the management process a bit simpler
    * Optionally uses the GitHub CLI to fork this repo, [follow these instructions to install](https://github.com/cli/cli#installation)

## Getting Started

To get started, simply fork this repo!

If you installed the stylobate-mgmt tool and the GitHub CLI, simply run `stylo init <newproject>`

### Set up database

1. Define your models using SQLAlchemy structures in the `backend/db/models` directory, see `backend/db/models/user.py` and [SQLAlchemy Tutorials](https://docs.sqlalchemy.org/en/13/orm/tutorial.html) for reference
2. Use Alembic to generate your migration
    * `stylo db --gen-migrations "message"` if using `stylobate-mgmt`
    * `alembic revision --autogenerate -m "message"` from the `backend` directory if not
3. Use Alembic to run your migration
    * `stylo db --up` if using `stylobate-mgmt`
    * `alembic upgrade head` from the `backend` directory if not
4. Explore your DB!
    * `stylo db --shell` if using `stylobate-mgmt`
    * `sqlite3 the.db` from the `backend` directory if not

### Set up endpoints

1. Cluster endpoints in "services"
2. If a service is relatively straightforward, define it in `backend/services/<service>.py`
3. If it would make sense to spread helping functions across multiple files, define it in `backend/services/<service>/main.py`
4. Implement endpoints as decorated functions 
    * See `backend/services/user.py` for examples, and [FastAPI documentation](https://fastapi.tiangolo.com/tutorial/first-steps/) for reference
    * Define input/output models inheriting from Pydantic's BaseModel for nice autogenerated documentation served at [host]:[port]/docs
        * Output models should do this by inheriting from `utils.api.Okay` for consistency of return shape
        * Failures should be returned by raising exceptions of type `utils.api.Failure` for the same reason
    * add a dependency of `Depends(UserAuth)` for endpoints that require a user be logged in, and `Depends(SuperUserAuth)` for endpoints that require a superuser
5. From each service, export 1 `router` object (this object is used to decorate the endpoints)
6. Add the router to the main application in `backend/main.py`
    * Follow the pattern used by the auth service: `app.include_router(auth.router, prefix='api/auth', tags=['auth'])`
        * If it isn't included, it will not respond to requests
        * The prefix must include api if it is to work with the frontend
        * The prefix should also include the name of the service
        * The tags are used to organize the documentation; by adding this to the router as a whole, it ensures the documentation is organized around services
7. Run the backend server!
    * `stylo run --back-end` if using `stylobate-mgmt`
    * `uvicorn main:app --reload` from the `backend` directory if not (the reload parameter enables hot reloading)
    * It will be listening at localhost:8000 by default
    * Documentation of all endpoints will be visible at localhost:8000/docs
        * It is additionally possible to trigger endpoint calls from within that documentation, which is very convenient
8. Test out calls, either in localhost:8000/docs or from curl/Postman
    * If using Postman, you can export the api by downloading the OpenAPI specification at locatlhost:8000/openapi.json and then import it!

### Set up frontend

1. Define your routes within `frontend/src/routes.jsx`
    * Each page should either require authentication `<RequireAuth>`, change based on authentication `<OptionalAuth>`, or just ignore it alltogether
2. Add new pages within `frontend/src/pages`
    * Implement state changes responding to API requests with `<MyGet>` and `<MyPost>`, which handle the request state and authentication for you
3. Add new common components within `frontend/src/components`
4. Add package dependencies with `yarn add <x>`
5. Ensure Ergonomics
    * For cleanest implementation:
        * Use Functional components instead of Classy components
        * Instead of relying on Redux, use React.useContext and its Provider/Consumer model
6. Add utility functions within `frontend/src/utils`
7. Add tests wherever you want, I think??
8. Run the development server!
    * `stylo run --front-end` if using `stylobate-mgmt`
    * `yarn start` from `frontend` directory if not
    * Probably only want to do this while also running the backend server, so it has someone to talk to

### Run in Production
1. Build Docker image
    * `stylo build --docker-prod [--username <dockerhub username>]` or
    * `yarn --cwd frontend build && docker build -f Dockerfile.dev -t <image name> .` from the main directory
2. Run the Docker image
    * `stylo run --docker-prod [--username <dockerhub username>]` or
    * `docker run -itd --name <container name> -p 80:80 -e PORT="80" -e IS_PROD="TRUE" -e SECRET_KEY=$(uuidgen) <image name> "sh /docker-prod-start.sh"` 
3. TaDa!
    * Everything should be accessible at `http://localhost`
    * API calls should go through `http://localhost/api/<service>/<endpoint>`
    * Documentation should still be at `http://localhost/docs`
    * The `yarn build` static objects should be served from the base directory, with `frontend/build/index.html` as the response to `http://localhost`
        * In the development version, api calls are proxied through to `localhost:8000`; that shouldn't happen here

## File Structure

Detailed documentation about how everything is layed out.
I thought of this as a relatively simplistic web server before I wrote this out.
I guess it still is? It makes sense to me, at least

* `backend`: backend Python code, configuration, and DB stuff
    * `main.py`: main entry point, register all the "services" here
    * `sql.py`: Initializes the DB connection
    * `the.db`: The SQLite Database (TODO: move this elsewhere/maybe use PostgreSQL)
    * `alembic.ini`: Alembic (migrations) configuration, mostly for logging, [documentation here](https://alembic.sqlalchemy.org/en/latest/tutorial.html#editing-the-ini-file)
    * `requirements.txt`: the python requirements
        * it is recommended to install these within a virtualenv: `python -m venv venv; source venv/bin/activate; pip install -r requirements`

    * `db`
        * `migrations`: Alembic folder, not strictly necessary to touch unless to modify auto-generated migrations (or write your own)
            * `versions`: the actual migrations
            * `env.py`: sets up the Alembic environment
            * `script.py.mako`: File generated by Alembic, don't actually know what this does
        * `models`: Define all your Database models here
            * `__init__.py`: import from your models files for ease of use
            * `user.py`: Sample model file
                * Note there is both a `User` class inheriting from the SQLAlchemy [declarative_base](https://docs.sqlalchemy.org/en/13/orm/extensions/declarative/api.html), as well as `UserBaseType`, `UserCreateType`, and `UserType` classes extending the Pydantic `BaseModel`. The former defines the relations with SQL, the latter serve as data-classes for reading/selecting/writing from the database
    * `services`:  Yes, it is stretching the definition a bit, but basically I am using the term "service" to refer to an organization of endpoints, each of which would have the same prefix in the URL
        * Each service should serve to define a `fastapi.APIRouter`, which then needs to be added in `main.py`
        * Each endpoint should be defined as a decorated function in a service
        * Each endpoint should either return a `utils.api.Okay` or raise a `utils.api.Failed` to standardize return types
        * `auth.py`: Sample service that implements a simple login interface, with the following endpoints: `/api/auth/login`, `/api/auth/validate_token` and `/api/auth/info`
    * `utils`: Utility scripts whose functionality will be used across services or other parts of the server
        `api.py`: Helpers for endpoint definitions
        `config.py`: Defines configuration variables and defaults to be used across the system
* `frontend`: Front-end project, created with `create-react-app`
    * `README.md`: autogenerated but helpful commands for managing development instances of the front end application
    * `.flowconfig`: Configuration for flow, [documentation here](https://flow.org/en/docs/config/)
    * `package.json`: Node configuration, consisting mainly of dependencies, scripts, and compilation targets
    * `yarn.lock`: detailed list of dependencies
    * `build`: Compiled static files go here. In production mode, this directory is statically mounted and served at the base directory
    * `node_modules`: All of the files that
    * `public`: Static resources, which get moved to the build dir when compiled
    * `src`: Well the source code duh
        * `index.css`: general styling applied to the site
        * `index.js`: The entrypoint
        * `Rutes.jsx`: React-dom-router for managing different urls
        * `serviceWorker.js`: Auto-generated code for a serviceWorker to make the app work offline... if you want?
        * `setupTests.js`: Code called before running test codes
        * `utils`: utility code to be used across pages
            * `AuthContext.jsx`: Context provider for managing authentication state. Ideally minimal interaction with this is necessary
            * `Query.jsx`: Helper components for dealing with general requests (`<Query>`) and api calls (`<MyGet>`, `<MyPost>`, etc)
        * `components`: components used across multiple pages
        * `pages`: Individual pages 
            * `home` : Useless sample home page and required resources
                * `Home.js`: Code that will always be running
                * `Home.css`: stylizes `Home.js`
                * `Home.test.js`: Test code for `Home.js`
* `docker`: Files for managing docker containers
    * `Dockerfile.dev`: Development dockerfile, assumes the run command mounts the backend and frontend directories to take advantage of hot reloading
        * pip venv mounting doesn't work for some reason, something about execution order? So the pip dependencies stil need to be installed during the image creation process
    * `Dockerfile.dev.dockerignore`: Files ignored in development dockerfile 
    * `docker-dev-start.sh`: Startup script used by development docker image
    * `Dockerfile.prod`: Production dockerfile, assumes no mounts, installs all packages with yarn and pip and generates a secret to be used 
    * `Dockerfile.prod.dockerignore`: Files ignored in production dockerfile
    * `docker-prod-start.sh`: Startup script used by the production docker image. Unnecessary for now, but maybe something else is desired?