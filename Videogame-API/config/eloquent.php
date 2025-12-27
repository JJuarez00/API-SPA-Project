<?php
/**
 * Author: Joseph Juarez
 * Date: 9/24/25
 * File: eloquent.php
 * Description:
 */
use DI\Container;
use Illuminate\Database\Capsule\Manager;

return static function (Container $container) {
    // boot eloquent
    $capsule = new Manager;
    $capsule->addConnection($container->get('settings')['db']);
    $capsule->setAsGlobal();
    $capsule->bootEloquent();
};