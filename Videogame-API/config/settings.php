<?php
/**
 * Author: Joseph Juarez
 * Date: 9/24/25
 * File: settings.php
 * Description: This stores the settings of the application.
 */

// Should be set to 0 in production
error_reporting(E_ALL);

// Should be set to '0' in production
ini_set('display_errors', '1');

// Timezone
date_default_timezone_set('America/New_York');

// Create an anonymous function that sets settings in the container
// The parameter of the function is a Container object
return function (DI\Container $container) {
    $container->set('settings', function () {
        return [
            'basePath' => '/I425/Course-project',

            // Database settings
            'db' => [
                'driver' => "mysql",
                'host' => 'localhost',
                'database' => 'videogames_db',
                'username' => 'root',
                'password' => '',
                'charset' => 'utf8',
                'collation' => 'utf8_unicode_ci',
                'prefix' => ''
            ]
        ];
    });
};