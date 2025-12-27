<?php
/**
 * Author: Joseph Juarez
 * Date: 9/24/2025
 * File: CategoryController.php
 * Description:
 */

namespace VideogamesAPI\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use VideogamesAPI\Models\Category;
use VideogamesAPI\Controllers\ControllerHelper as Helper;
use VideogamesAPI\Validation\Validator;

class CategoryController {

    // Retrieve all Categories
    public function index(Request $request, Response $response, $args) : Response {
        // $results = Category::getCategories($request);

        // Get querystring variables from url
        $params = $request->getQueryParams();
        $term = array_key_exists('q', $params) ? $params['q'] : "";
        // Call the model method to get categories
        $results = ($term) ? Category::searchCategories($term) : Category::getCategories($request);
        return Helper::withJson($response, $results, 200);
    }

    // View Category by ID
    public function view(Request $request, Response $response, $args) : Response {
        $id = $args['category_id'];
        $results = Category::getCategoryById($id);
        return Helper::withJson($response, $results, 200);
    }

    // [Many-to-Many]
    // View all Categories < - > Video Games
    public function viewCategoryVideogames(Request $request, Response $response, array $args) : Response {
        $id = $args['category_id'];
        $results = Category::getCategoryVideogames($id);
        return Helper::withJson($response, $results, 200);
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Create a Category.
    public function create(Request $request, Response $response, array $args) : Response {
        // Validate the request.
        $validation = Validator::validateCategory($request);

        // If validation failed.
        if(!$validation) {
            $results = [
                'status' => "Validation failed :(",
                'errors' => Validator::getErrors()
            ];
            return Helper::withJson($response, $results, 500);
        }

        // Create a new Category.
        $category = Category::createCategory($request);

        if (!$category) {
            $results['status']= "Category cannot be created :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = [
            'status' => "Category has been created :)",
            'data' => $category
        ];
        return Helper::withJson($response, $results, 200);

        /**
         *    Postman Instructions to creating new Category:
         *    Select "POST"
         *    Enter this next to it: {{base_url}}/categories
         *    Go to Body, then select "raw", then make sure it's set to "JSON"
         *    Enter This:
         *
            {
             "category_name": "Test",
             "description": "Temp Txt, you just created a new category!"
            }
         *
         */
    }

    // Update a Category.
    public function update(Request $request, Response $response, array $args) : Response {
        // Validate the request.
        $validation = Validator::validateCategory($request);

        // If validation failed.
        if(!$validation) {
            $results = [
                'status' => "Validation failed :(",
                'errors' => Validator::getErrors()
            ];
            return Helper::withJson($response, $results, 500);
        }

        // Update a Category.
        $category = Category::updateCategory($request);

        if (!$category) {
            $results['status']= "Category cannot be updated :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = [
            'status' => "Category has been updated :)",
            'data' => $category
        ];
        return Helper::withJson($response, $results, 200);

        /**
         *    Postman Instructions to updating a Category:
         *    Select "PUT"
         *    Enter this next to it: {{base_url}}/categories/100
         *    Go to Body, then select "raw", then make sure it's set to "JSON"
         *    Enter This:
         *
             {
               "category_name": "Updated Name",
               "description": "If you see this, the category description has been updated!"
             }
         *
         */
    }

    // Delete a Category.
    public function delete(Request $request, Response $response, array $args) : Response {
        $category = Category::deleteCategory($request);

        if (!$category) {
            $results['status'] = "Category cannot be deleted :(";
            return Helper::withJson($response, $results, 500);
        }

        $results = ['result' => "Category has been deleted :)"];
        return Helper::withJson($response, $results, 200);
    }
    
    /** -------------------------------[ Break Point ]----------------------------------- **/
}