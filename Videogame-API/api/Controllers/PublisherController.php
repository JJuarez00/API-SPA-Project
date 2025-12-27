<?php
/**
 * Author: Ethan Mull
 * Date: 9/24/2025
 * File: PublisherController.php
 * Description:
 */

namespace VideogamesAPI\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use VideogamesAPI\Models\Publisher;
use VideogamesAPI\Controllers\ControllerHelper as Helper;
use VideogamesAPI\Validation\Validator;

class PublisherController {

    // Retrieve all Publishers
    public function index(Request $request, Response $response, $args) : Response {
        //$results = Publisher::getPublishers($request);

        //Get querystring variables from url
        $params = $request->getQueryParams();
        $term = array_key_exists('q', $params) ? $params['q'] : "";
        //Call the model method to get students
        $results = ($term) ? Publisher::searchPublishers($term) : Publisher::getPublishers($request);

        return Helper::withJson($response, $results, 200);
    }

    // View Publisher by ID
    public function view(Request $request, Response $response, $args) : Response {
        $publisherId = $args['publisher_id'];
        $results = Publisher::getPublisherById($publisherId);
        return Helper::withJson($response, $results, 200);
    }

    // [One-to-Many]
    // View what Publisher has [One to Many] Video Games.
    public function viewPublisherVideogames(Request $request, Response $response, array $args) : Response {
        $id = $args['publisher_id'];
        $results = Publisher::getPublisherVideogames($id);
        return Helper::withJson($response, $results, 200);
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Create a Publisher.
    public function create(Request $request, Response $response, array $args) : Response {
        // Validate the request.
        $validation = Validator::validatePublisher($request);

        // If validation failed.
        if(!$validation) {
            $results = [
                'status' => "Validation failed :(",
                'errors' => Validator::getErrors()
            ];
            return Helper::withJson($response, $results, 500);
        }

        // Create a new Publisher.
        $publisher = Publisher::createPublisher($request);

        if (!$publisher) {
            $results['status']= "Publisher cannot be created :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = [
            'status' => "Publisher has been created :)",
            'data' => $publisher
        ];
        return Helper::withJson($response, $results, 200);

        /**
         *    Postman Instructions to creating new Publisher:
         *    Select "POST"
         *    Enter this next to it: {{base_url}}/publishers
         *    Go to Body, then select "raw", then make sure it's set to "JSON"
         *    Enter This:
         *
        {
        "publisher_name": "Test Corp.",
        "country": "Mexico",
        "founded_year": 1960,
        "website_url": null,
        "active_status": 0
        }
         *
         */
    }

    // Update a Publisher.
    public function update(Request $request, Response $response, array $args) : Response {
        // Validate the request.
        $validation = Validator::validatePublisher($request);

        // If validation failed.
        if(!$validation) {
            $results = [
                'status' => "Validation failed :(",
                'errors' => Validator::getErrors()
            ];
            return Helper::withJson($response, $results, 500);
        }

        // Update a Publisher.
        $publisher = Publisher::updatePublisher($request);

        if (!$publisher) {
            $results['status']= "Publisher cannot be updated :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = [
            'status' => "Publisher has been updated :)",
            'data' => $publisher
        ];
        return Helper::withJson($response, $results, 200);

        /**
         *    Postman Instructions to updating a Publisher:
         *    Select "PUT"
         *    Enter this next to it: {{base_url}}/publishers/100
         *    Go to Body, then select "raw", then make sure it's set to "JSON"
         *    Enter This:
         *
        {
        "publisher_name": "Test Corporation",
        "country": "USA",
        "founded_year": 2025,
        "website_url": "https://one.iu.edu/",
        "active_status": 1
        }
         *
         */
    }

    // Delete a Publisher.
    public function delete(Request $request, Response $response, array $args) : Response {
        $publisher = Publisher::deletePublisher($request);

        if (!$publisher) {
            $results['status'] = "Publisher cannot be deleted :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = ['result' => "Publisher has been deleted :)"];
        return Helper::withJson($response, $results, 200);
    }

}