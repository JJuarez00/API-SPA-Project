<?php
/**
 * Author: Ashley Rodriguez Vega
 * Date: 9/24/25
 * File: dependencies.php
 * Description: this defines dependencies. They are the instances
 * of controller classes. They are passed to routing functions
 * as the callback routines
 */

use DI\Container;
use VideogamesAPI\Controllers\VideogameController;
use VideogamesAPI\Controllers\PublisherController;
use VideogamesAPI\Controllers\PlatformController;
use VideogamesAPI\Controllers\CategoryController;
use VideogamesAPI\Controllers\UserController;

return function (Container $container) {

    $container->set('Publisher', function() {
        return new PublisherController();
    });

    $container->set('Videogame', function() {
        return new videogameController();
    });

    $container->set('Platform', function() {
        return new platformController();
    });

    $container->set('Category', function() {
        return new categoryController();
    });

    $container->set('User', function() {
        return new UserController();
    });
};