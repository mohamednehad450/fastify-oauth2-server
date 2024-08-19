import OAuth2Server from "@node-oauth/oauth2-server";
import {
  FastifyPluginCallback,
  onRequestHookHandler,
  RouteHandlerMethod,
} from "fastify";

type OAuth2ServerPlugin = {
  server: OAuth2Server;
  token: (options?: OAuth2Server.TokenOptions) => RouteHandlerMethod;
  authenticate: (
    options?: OAuth2Server.AuthenticateOptions
  ) => RouteHandlerMethod;
  authorize: (options?: OAuth2Server.AuthorizeOptions) => RouteHandlerMethod;
};

declare module "fastify" {
  export interface FastifyInstance {
    oauthServer: OAuth2ServerPlugin;
  }
  export interface FastifyReply {
    oauth: {
      token: OAuth2Server.Token;
      code: OAuth2Server.AuthorizationCode;
    };
  }
}

declare const fastifyOauth2Server: FastifyPluginCallback<OAuth2Server.ServerOptions>;

export { fastifyOauth2Server };
export default fastifyOauth2Server;
