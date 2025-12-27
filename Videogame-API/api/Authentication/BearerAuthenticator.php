<?php
/**
 * Author: Joseph Juarez
 * Date: 10/29/25
 * File: BearerAuthenticator.php
 * Description: This defines the BearerAuthenticator class.
 */

namespace VideogamesAPI\Authentication;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use VideogamesAPI\Models\Token;
class BearerAuthenticator {
    public function __invoke(Request $request, RequestHandler $handler) : Response {
        //If the header named "Authorization" does not exist, returns an error
        if(!$request->hasHeader('Authorization')) {
            $results = ['Status' => 'Authorization header not available'];
            return AuthenticationHelper::withJson($results, 401);
        }

        // If the Authorization header exists, retrieve its value. The value is an array with one single value.
        $auth = $request->getHeader('Authorization');

        // The value of the authorization header consists of "Bearer" and a token, separated
        // by a space.  Trim 'Bearer ' from the string. Notice there is a space after "Bearer".
        list(, $token) = explode(" ", $auth[0], 2);

        //Validate the token
        if(!Token::validateBearer($token)) {
            $results = ['Status' => 'Authentication failed.'];
            return AuthenticationHelper::withJson($results, 403);
        }

        // Authentication succeeded
        return $handler->handle($request);
    }
}