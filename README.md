# LetsGetChecked front end challenge

## API

### Prerequisites

- [Node.js](https://nodejs.org/en/) v12 or higher

### Available endpoints

**Base path:** http://localhost:9000

**GET** `/posts` _List all blog posts_<br>
**GET** `/posts/{id}` _View single blog post_<br>
**GET** `/posts/{id}/comments` _List all comments for single blog post_<br>
**POST** `/posts/{id}/comments` _Add comment to single blog post_<br>
**PUT** `/comments/{id}` _Update single comment_<br>

### Quick start

#### 1. Run`cd web-api`

This will navigate to the API folder.

#### 2. Run `npm install`

This will install all dependencies (listed in `package.json`)

#### 3. Run `npm run api`

This will make the REST API available at `http://localhost:9000`

## Blog

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

### Quick start

#### 1. Run`cd blog-challenge`

This will navigate to the Blog folder.

#### 2. Run `npm install`

This will install all dependencies (listed in `package.json`)

### Build

Run `npm run build`.

### Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`.

### Tests

Run `npm run test` to execute the unit tests via [Jest](https://jestjs.io/).
