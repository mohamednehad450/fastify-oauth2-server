import OAuth2Server from '@node-oauth/oauth2-server'
import { FastifyPluginCallback, RouteHandlerMethod } from 'fastify'

interface OAuth2ServerPluginOptions {
  useErrorHandler?: boolean
}

interface OAuth2ServerPlugin {
  server: OAuth2Server
  token: (
    options?: OAuth2Server.TokenOptions & OAuth2ServerPluginOptions
  ) => RouteHandlerMethod
  authenticate: (
    options?: OAuth2Server.AuthenticateOptions & OAuth2ServerPluginOptions
  ) => RouteHandlerMethod
  authorize: (
    options?: OAuth2Server.AuthorizeOptions & OAuth2ServerPluginOptions
  ) => RouteHandlerMethod
}

declare module 'fastify' {
  export interface FastifyInstance {
    oauthServer: OAuth2ServerPlugin
  }
  export interface FastifyReply {
    oauth: {
      token: OAuth2Server.Token
      code: OAuth2Server.AuthorizationCode
    }
  }
}

declare const fastifyOauth2Server: FastifyPluginCallback<
OAuth2Server.ServerOptions & OAuth2ServerPluginOptions
>

export { fastifyOauth2Server }
export default fastifyOauth2Server
