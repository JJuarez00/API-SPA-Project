<?php
/**
 * Author: Ethan Mull
 * Date: 9/24/2025
 * File: ControllerHelper.php
 * Description:
 */

namespace VideogamesAPI\Controllers;

use Psr\Http\Message\ResponseInterface as Response;

class ControllerHelper {
    public static function withJson(Response $response, $data, int $code) : Response {
        $payload = json_encode($data);
        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($code);
    }
}