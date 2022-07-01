# UserAdministration

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# Choose a backend before running the frontend

## A) Using a json-server database 

To use a local database you need to install the following server

```bash
# Install a server to run your json file a server
npm i -g json-server 

# Run the backend
json-server --watch db.json --port 4000

# Launch frontend pointing to the json server
ng -s --port 8001
```

## B) Using the docker server

The steps to launch the docker server are omitted in this repo

```bash
ng s --port 8001 -c production
```
