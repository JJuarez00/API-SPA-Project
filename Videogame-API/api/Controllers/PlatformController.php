<?php
/**
 * Author: Joseph Juarez
 * Date: 9/24/2025
 * File: PlatformController.php
 * Description:
 */

namespace VideogamesAPI\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use VideogamesAPI\Models\Platform;
use VideogamesAPI\Controllers\ControllerHelper as Helper;
use VideogamesAPI\Validation\Validator;

class PlatformController {

    // Retrieve all platforms
    public function index(Request $request, Response $response, $args) : Response {
        // $results = Platform::getPlatforms($request);

        // Get querystring variables from url
        $params = $request->getQueryParams();
        $term = array_key_exists('q', $params) ? $params['q'] : "";
        // Call the model method to get students
        $results = ($term) ? Platform::searchPlatforms($term) : Platform::getPlatforms($request);

        return Helper::withJson($response, $results, 200);
    }

    // View Platform by ID
    public function view(Request $request, Response $response, $args) : Response {
        $platformId = $args['platform_id'];
        $results = Platform::getPlatformById($platformId);
        return Helper::withJson($response, $results, 200);
    }

    // [Many-to-Many]
    // Platforms < - > Video Games
    public function viewPlatformVideogames(Request $request, Response $response, array $args) : Response {
        $id = $args['platform_id'];
        $results = Platform::getPlatformVideogames($id);
        return Helper::withJson($response, $results, 200);
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Create a Platform.
    public function create(Request $request, Response $response, array $args) : Response {
        // Validate the request.
        $validation = Validator::validatePlatform($request);

        // If validation failed.
        if (!$validation) {
            $results = [
                'status' => "Validation failed :(",
                'errors' => Validator::getErrors()
            ];
            return Helper::withJson($response, $results, 500);
        }

        // Create a new Platform.
        $platform = Platform::createPlatform($request);

        if (!$platform) {
            $results['status'] = "Platform cannot be created :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = [
            'status' => "Platform has been created :)",
            'data' => $platform
        ];
        return Helper::withJson($response, $results, 200);

        /**
         *    Postman Instructions to creating new Platform:
         *    Select "POST"
         *    Enter this next to it: {{base_url}}/platforms
         *    Go to Body, then select "raw", then make sure it's set to "JSON"
         *    Enter This:
         *
            {
              "platform_name": "Test Platform",
              "form_factor": "Hybrid",
              "generation": 0,
              "release_year": 2025,
              "is_backwards_compatible": 0
            }
         *
         */
    }

    // Update a Platform.
    public function update(Request $request, Response $response, array $args) : Response {
        // Validate the request.
        $validation = Validator::validatePlatform($request);

        // If validation failed.
        if(!$validation) {
            $results = [
                'status' => "Validation failed :(",
                'errors' => Validator::getErrors()
            ];
            return Helper::withJson($response, $results, 500);
        }

        // Update a Platform.
        $platform = Platform::updatePlatform($request);

        if (!$platform) {
            $results['status']= "Platform cannot be updated :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = [
            'status' => "Platform has been updated :)",
            'data' => $platform
        ];
        return Helper::withJson($response, $results, 200);

        /**
         *    Postman Instructions to creating new Platform:
         *    Select "PUT"
         *    Enter this next to it: {{base_url}}/platforms/100
         *    Go to Body, then select "raw", then make sure it's set to "JSON"
         *    Enter This:
         *
            {
              platform_name": "Updated Name",
              form_factor": "Console",
              generation": 1,
              release_year": 2000,
              is_backwards_compatible": 1
            }
         *
         */
    }

    // Delete a Platform.
    public function delete(Request $request, Response $response, array $args) : Response {
        $platform = Platform::deletePlatform($request);

        if (!$platform) {
            $results['status'] = "Platform cannot be deleted :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = ['result' => "Platform has been deleted :)"];
        return Helper::withJson($response, $results, 200);
    }

}