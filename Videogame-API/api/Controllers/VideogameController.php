<?php
/**
 * Author: Joseph Juarez
 * Date: 9/24/2025
 * File: VideogameController.php
 * Description:
 */

namespace VideogamesAPI\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use VideogamesAPI\Models\Videogame;
use VideogamesAPI\Controllers\ControllerHelper as Helper;
use VideogamesAPI\Validation\Validator;

class VideogameController {

    // Retrieve all Video Games
    public function index(Request $request, Response $response, $args) : Response {
        $results = Videogame::getVideogames($request);
        return Helper::withJson($response, $results, 200);
    }

    // View Video Game by ID
    public function view(Request $request, Response $response, $args) : Response {
        $videogameId = $args['videogame_id'];
        $results = Videogame::getVideogameById($videogameId);
        return Helper::withJson($response, $results, 200);
    }

    // [Many-to-Many]
    // View all Video Games < - > Categories
    public function viewVideogameCategories(Request $request, Response $response, array $args) :
    Response {
        $id = $args['videogame_id'];
        $results = Videogame::getVideogameCategories($id);
        return Helper::withJson($response, $results, 200);
    }

    // [Many-to-Many]
    // Video Games < - > Platforms
    public function viewVideogamePlatforms(Request $request, Response $response, array $args) :
    Response {
        $id = $args['videogame_id'];
        $results = Videogame::getVideogamePlatforms($id);
        return Helper::withJson($response, $results, 200);
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Create a Video Game.
    public function create(Request $request, Response $response, array $args) : Response {
        // Validate the request.
        $validation = Validator::validateVideogame($request);

        // If validation failed.
        if(!$validation) {
            $results = [
                'status' => "Validation failed :(",
                'errors' => Validator::getErrors()
            ];
            return Helper::withJson($response, $results, 500);
        }

        // Create a new Video Game.
        $videogame = Videogame::createVideogame($request);

        if (!$videogame) {
            $results['status']= "Video Game cannot be created :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = [
            'status' => "Video Game has been created :)",
            'data' => $videogame
        ];
        return Helper::withJson($response, $results, 200);

        /**
         *    Postman Instructions to creating new Video Game:
         *    Select "POST"
         *    Enter this next to it: {{base_url}}/videogames
         *    Go to Body, then select "raw", then make sure it's set to "JSON"
         *    Enter This:
         *
        {
          "publisher_id": 1,
          "title": "Placeholder Title",
          "release_year": 2000,
          "esrb_rating": "E",
          "game_description": "This is placeholder text, item just got created.",
          "is_multiplayer": 0
        }
         *
         */
    }

    // Update a Video Game.
    public function update(Request $request, Response $response, array $args) : Response {
        // Validate the request.
        $validation = Validator::validateVideogame($request);

        // If validation failed.
        if(!$validation) {
            $results = [
                'status' => "Validation failed :(",
                'errors' => Validator::getErrors()
            ];
            return Helper::withJson($response, $results, 500);
        }

        // Update a Video Game.
        $videogame = Videogame::updateVideogame($request);

        if (!$videogame) {
            $results['status']= "Video Game cannot be updated :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = [
            'status' => "Video Game has been updated :)",
            'data' => $videogame
        ];
        return Helper::withJson($response, $results, 200);

        /**
         *    Postman Instructions to updating a Video Game:
         *    Select "PUT"
         *    Enter this next to it: {{base_url}}/videogames/100
         *    Go to Body, then select "raw", then make sure it's set to "JSON"
         *    Enter This:
         *
             {
               "publisher_id": 2,
               "title": "College Student Simulator",
               "release_year": 2025,
               "esrb_rating": "AO",
               "game_description": "Play the life of a college student.",
               "is_multiplayer": 1
             }
         *
         *
         */
    }

    // Delete a Video Game.
    public function delete(Request $request, Response $response, array $args) : Response {
        $videogame = Videogame::deleteVideogame($request);

        if (!$videogame) {
            $results['status'] = "Video Game cannot be deleted :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = ['result' => "Video Game has been deleted :)"];
        return Helper::withJson($response, $results, 200);
    }

}