
Hi !

thanks for taking the time to work with our challenge. 
This set of questions represents a small subset of the daily work that we are doing here at On with Nest.js.

During the demo of the project we will ask you to share your screen and talk through the code structure and
implement some modifications / additions. Please familiarise yourself with the Nest.js cli tool also.

the tasks are below, if you have any questions feel free to contact us.

## Tasks

note: please follow the recommended approaches for these tasks in the Nest.js documentation

1. Make the test in `app.e2e-spec` pass by updating the corresponding controller.
2. Create a Config service that can be used to provide values into the application
   1. Provide a value called `PROD_HOST` to the application
   2. Create a controller that returns the value set in `PROD_HOST` to an endpoint called 'getProductionHost'
   3. Verify with an e2e test
3. Create an injectable structure that inserts a header of `["on-running":"always"]` to all responses
   1. For testing this, it is ok to verify it on one endpoint.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```



