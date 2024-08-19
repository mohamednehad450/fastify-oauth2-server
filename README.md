# fastify-oauth2-server

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

<!-- ![CI workflow](**MY_PLUGIN_URL**
/workflows/CI%20workflow/badge.svg) -->

Supports Fastify versions `4.x`

## Install

```
npm i fastify-oauth2-server
```

## Usage

Require `fastify-oauth2-server` and register.

```js
const fastify = require("fastify")();

fastify.register(require("fastify-oauth2-server"), {
  model: {}, // See https://github.com/node-oauth/node-oauth2-server for specification,
  // ...oauth2-server options
});

// Token route
fastify.post("/", fastify.oauthServer.token());

// Authorize route
fastify.post(
  "/",
  fastify.oauthServer.authorize({
    authenticateHandler: {
      handle: async (request) => {
        // authorization logic here
        return user;
      },
    },
  })
);

// Protected route
fastify.get(
  "/",
  { preValidation: fastify.oauthServer.authenticate() },
  (request, reply) => reply.send("Protected route")
);

fastify.listen({ port: 3000 });
```

## TODOS

1.Add tests

## Acknowledgements

## License

Licensed under [MIT](./LICENSE).<br/>
