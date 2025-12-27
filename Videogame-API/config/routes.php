<?php
/**
 * Author: Joseph Juarez
 * Date: 9/24/25
 * File: routes.php
 * Description:
 */
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use VideogamesAPI\Authentication\{
    MyAuthenticator,
    BasicAuthenticator,
    BearerAuthenticator,
    JWTAuthenticator
};

return function (App $app) {
// Create app routes

    //Set up CORS (Cross-Origin Resource Sharing) https://www.slimframework.com/docs/v4/cookbook/enable-cors.html
    $app->options('/{routes:.+}', function ($request, $response, $args) {
        return $response;
    });

    $app->add(function ($request, $handler) {
        $response = $handler->handle($request);
        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    });

    // Add an app route
    $app->get('/', function (Request $request, Response $response, array $args) {
        $response->getBody()->write('Welcome to Our Videogame API Project!');
        return $response;
    });

    // Add another route
    $app->get('/api/hello/{name}', function (Request $request, Response $response, array $args) {
        $response->getBody()->write("Hello " . $args['name']);
        return $response;
    });

    // User route group
    $app->group('/api/v1/users', function (RouteCollectorProxy $group) {
        $group->get('', 'User:index');
        $group->get('/{id}', 'User:view');
        $group->post('', 'User:create');
        $group->put('/{id}', 'User:update');
        $group->delete('/{id}', 'User:delete');
        $group->post('/authBearer', 'User:authBearer');
        $group->post('/authJWT', 'User:authJWT');
    });

    // Route group api/v1 pattern (Postman Routing).
    $app->group('/api/v1', function (RouteCollectorProxy $group) {

        // Publisher Routing
        $group->group('/publishers', function (RouteCollectorProxy $group) {
            // Call the index method defined in the PublisherController class
            // Publisher is the container key defined in dependencies.php.
            $group->get('', 'Publisher:index');
            $group->get('/{publisher_id}', 'Publisher:view');

            // Relationship 1:M [for Video Games]
            $group->get('/{publisher_id}/videogames', 'Publisher:viewPublisherVideogames');

            // Create a Publisher
            $group->post('', 'Publisher:create');

            // Update a Publisher
            $group->put('/{publisher_id}', 'Publisher:update');

            // Delete a Publisher
            $group->delete('/{publisher_id}', 'Publisher:delete');
        });

        // Platform Routing
        $group->group('/platforms', function (RouteCollectorProxy $group) {
            // Call the index method defined in the PlatformController class
            // Platform is the container key defined in dependencies.php.
            $group->get('', 'Platform:index');
            $group->get('/{platform_id}', 'Platform:view');

            // Relationship M:N [for Video Games]
            $group->get('/{platform_id}/videogames', 'Platform:viewPlatformVideogames');

            // Create a Platform
            $group->post('', 'Platform:create');

            // Update a Platform
            $group->put('/{platform_id}', 'Platform:update');

            // Delete a Platform
            $group->delete('/{platform_id}', 'Platform:delete');
        });

        // Categories Routing
        $group->group('/categories', function (RouteCollectorProxy $group) {
            // Call the index method defined in the PlatformController class
            // Platform is the container key defined in dependencies.php.
            $group->get('', 'Category:index');
            $group->get('/{category_id}', 'Category:view');

            // Relationship M:N [for Video Games]
            $group->get('/{category_id}/videogames', 'Category:viewCategoryVideogames');

            // Create a Category
            $group->post('', 'Category:create');

            // Update a Category
            $group->put('/{category_id}', 'Category:update');

            // Delete a Category
            $group->delete('/{category_id}', 'Category:delete');
        });

        // Video Game Routing
        $group->group('/videogames', function (RouteCollectorProxy $group) {
            // Call the index method defined in the VideogameController class
            // Video Game is the container key defined in dependencies.php.
            $group->get('', 'Videogame:index');
            $group->get('/{videogame_id}', 'Videogame:view');

            // Relationship M:N [for Category]
            $group->get('/{videogame_id}/categories', 'Videogame:viewVideogameCategories');

            // Relationship M:N [for Platform]
            $group->get('/{videogame_id}/platforms', 'Videogame:viewVideogamePlatforms');

            // Create a Video Game
            $group->post('', 'Videogame:create');

            // Update a Video Game
            $group->put('/{videogame_id}', 'Videogame:update');

            // Delete a Video Game
            $group->delete('/{videogame_id}', 'Videogame:delete');
        });

    });  // Without Authentication
//    })->add(new MyAuthenticator()); //  MyAuthentication
//    })->add(new BasicAuthenticator()); // BasicAuthentication
//    })->add(new BearerAuthenticator()); // BearerAuthentication
//    })->add(new JWTAuthenticator()); // JWTAuthentication

    // Handle invalid routes
    $app->any('{route:.*}', function(Request $request, Response $response) {
        $response->getBody()->write("Page Not Found");
        return $response->withStatus(404);
    });

};