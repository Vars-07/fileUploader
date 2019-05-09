# mindtickle-assignment

A Fully Functional File Uploader, that supports uploading files of desired extension, multiple files can also be uploaded at the same time.

## Introduction

This is a simple file uploader built using react [React](https://reactjs.org/) application with a [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/) backend. Client side code is written in React and the backend API is written using Express. In the starting all the extensions are allowed, but we can reduce the number of formats allowed by selecting them from the list.

### Development mode

In the development mode, 2 servers will be running. The front end code will be served by the [webpack dev server](https://webpack.js.org/configuration/dev-server/) which helps with hot and live reloading. The server side Express code will be served by a node server using [nodemon](https://nodemon.io/) which helps in automatically restarting the server whenever server side code changes.

### Production mode

In the production mode, we will have only 1 server running. All the client side code will be bundled into static files using webpack and it will be served by the Node.js/Express application.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Vars-07/fileUploader.git

# Go inside the directory
cd mindtickle-assign

# Install dependencies
yarn

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```