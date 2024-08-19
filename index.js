'use strict'

const fp = require('fastify-plugin')
const {
  Request,
  Response,
  UnauthorizedRequestError
} = require('@node-oauth/oauth2-server')
const OAuth2Server = require('@node-oauth/oauth2-server')

const defaultOptions = {
  useErrorHandler: false
}

function handleResponse (request, reply, oauthResponse) {
  if (oauthResponse.status === 302) {
    const location = oauthResponse.headers.location
    delete oauthResponse.headers.location
    reply.headers(oauthResponse.headers)
    reply.redirect(location)
  } else {
    reply.headers(oauthResponse.headers)
    reply.status(oauthResponse.status).send(oauthResponse.body)
  }
}

function handleError (useErrorHandler, e, request, reply, oauthResponse, next) {
  if (useErrorHandler === true) {
    next(e)
  } else {
    if (oauthResponse) {
      reply.headers(oauthResponse.headers)
    }
    reply.status(e.code || 500)

    if (e instanceof UnauthorizedRequestError) {
      return reply.send()
    }

    reply.send({ error: e.name, error_description: e.message })
  }
}

function authenticate (oauthServer, { useErrorHandler, ...options }) {
  return function (request, reply, next) {
    const oauthRequest = new Request(request)
    const oauthResponse = new Response(reply)
    oauthServer
      .authenticate(oauthRequest, oauthResponse, options)
      .then((token) => {
        reply.oauth = { token }
        next()
      })
      .catch((e) => {
        handleError(useErrorHandler, e, request, reply, oauthResponse, next)
      })
  }
}

function token (oauthServer, { useErrorHandler, ...options }) {
  return function (request, reply, next) {
    const oauthReq = new Request(request)
    const oauthRes = new Response(reply)
    oauthServer
      .token(oauthReq, oauthRes, options)
      .then((token) => {
        reply.oauth = { token }
        return handleResponse(request, reply, oauthRes)
      })
      .catch((e) => {
        return handleError(useErrorHandler, e, request, reply, oauthRes, next)
      })
  }
}

function authorize (oauthServer, { useErrorHandler, ...options }) {
  return function (request, reply, next) {
    const oauthReq = new Request(request)
    const oauthRes = new Response(reply)
    oauthServer
      .authorize(oauthReq, oauthRes, options)
      .then((code) => {
        reply.oauth = { code }
        return handleResponse(request, reply, oauthRes)
      })
      .catch((e) => {
        return handleError(useErrorHandler, e, request, reply, oauthRes, next)
      })
  }
}

/** @type {import("fastify").FastifyPluginAsync} */
async function fastifyOauth2Server (instance, options) {
  const _options = Object.assign(options, defaultOptions)
  const { useErrorHandler, ...oauthOptions } = _options

  const oauthServer = new OAuth2Server(oauthOptions)

  instance.decorateReply('oauth', {})
  instance.decorate('oauthServer', {
    server: oauthServer,
    authenticate: function (options = {}) {
      return authenticate(oauthServer, { useErrorHandler, ...options })
    },
    token: function (options = {}) {
      return token(oauthServer, { useErrorHandler, ...options })
    },
    authorize: function (options = {}) {
      return authorize(oauthServer, { useErrorHandler, ...options })
    }
  })
}

module.exports = fp(fastifyOauth2Server, {
  fastify: '^4.x',
  name: '@fastify/oauth2-server'
})
module.exports.default = fastifyOauth2Server
module.exports.fastifyOauth2Server = fastifyOauth2Server
