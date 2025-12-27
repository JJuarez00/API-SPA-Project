<?php
/**
 * Author: Joseph Juarez
 * Date: 10/28/2025
 * File: MyAuthenticator.php
 * Description:
 */

namespace VideogamesAPI\Authentication;

use VideogamesAPI\Authentication\AuthenticationHelper;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use VideogamesAPI\Models\User;

/*
 * Use the __invoke method so the object can be used as a callable.
 * This method gets called automatically when the object is treated as a callable.
*/

class MyAuthenticator {
    public function __invoke(Request $request, RequestHandler $handler) : Response {

        // Username and password are stored in a header called "VideogamesAPI-Authorization".
        if(!$request->hasHeader('VideogamesAPI-Authorization')) {
            $results = ['Status' => 'VideogamesAPI-Authorization header not found.'];
            return AuthenticationHelper::withJson($results, 401);
        }

        // Retrieve the header.
        $auth = $request->getHeader('VideogamesAPI-Authorization');
        $apikey = $auth[0];
        list($username, $password) = explode(':', $auth[0]);

        // Retrieve the header and then the username and password.
        $auth = $request->getHeader('VideogamesAPI-Authorization');
        list($username, $password) = explode(':', $auth[0]);

        // Validate the username and password.
        if(!User::authenticateUser($username, $password)) {
            $results = ['Status' => 'Authentication failed.'];
            return AuthenticationHelper::withJson($results, 403);
        }

        // A user has been authenticated.
        return $handler->handle($request);
    }
}