<?php
/**
 * Author: Ethan Mull
 * Date: 10/12/2025
 * File: Validator.php
 * Description:
 */

namespace VideogamesAPI\Validation;

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\NestedValidationException;

class Validator {
    private static array $errors = [];

    public static function getErrors() : array {
        return self::$errors;
    }

    public static function validate($request, array $rules) : bool {
        foreach ($rules as $field => $rule) {
            // Retrieve parameters from URL or the request body
            $param = $request->getAttribute($field) ?? $request->getParsedBody()[$field];
            try{
                $rule->setName($field)->assert($param);
            } catch (NestedValidationException $ex) {
                self::$errors[$field] = $ex->getFullMessage();
            }
        }
        // Return true or false; "false" means a failed validation.
        return empty(self::$errors);
    }

    public static function validateCategory($request) : bool {

        // Define all the validation rules
        $rules = [
            'category_name' => v::notEmpty()->StringType(), // Validates whether the type of input is string or not.
            'description' => v::notEmpty()->StringType(), // Validates whether the type of input is string or not.
        ];

        return self::validate($request, $rules);
    } // Fixed by Joe

    public static function validatePlatform($request) : bool {

        // Define all the validation rules
        $rules = [
            'platform_name' => v::notEmpty()->StringType(), // Validates whether the type of input is string or not.
            'form_factor' => v::notEmpty()->StringType(), // Validates whether the type of input is string or not.
            'generation' => v::intVal(), // Validates if the input is an integer.
            'release_year' => v::notEmpty()->intVal()->between(1900, 2030), // Validates if the input is an integer.
            'is_backwards_compatible' => v::BoolVal(), // Validates if the input results in a boolean value.
        ];

        return self::validate($request, $rules);
    }

    public static function validatePublisher($request) : bool {

        // Define all the validation rules
        $rules = [
            'publisher_name' => v::notEmpty()->StringType(), // Validates whether the type of input is string or not.
            'country' => v::notEmpty()->StringType(), // Validates whether the type of input is string or not.
            'founded_year' => v::notEmpty()->intVal()->between(1900, 2030), // Validates if the input is an integer.
            'website_url' => v::oneOf(
                v::nullType(), // Validates whether the input is null.
                v::url() // Validates whether the input is a URL.
            ),
            'active_status' => v::BoolVal() // Validates if the input results in a boolean value.
        ];

        return self::validate($request, $rules);
    }

    public static function validateVideogame($request) : bool {
        // Define all the validation rules
        $rules = [
            'title' => v::notEmpty()->StringType(), // Validates whether the type of input is string or not.
            'release_year' => v::notEmpty()->intVal()->between(1900, 2030), // Validates if the input is an integer.
            'esrb_rating' => v::notEmpty()->regex( // Validates whether the input matches a defined regular expression.
                '/^(E|E10\+|T|M|AO)$/'), // Accepts: E, E10+, T, M, and AO.
            'game_description' => v::notEmpty()->StringType(), // Validates whether the type of input is string or not.
            'is_multiplayer' => v::BoolVal() // Validates if the input results in a boolean value.
        ];

        return self::validate($request, $rules);
    }

    // Validate attributes of a User model. Do not validate fields having default values (id, created_at, and updated_at)
    public static function validateUser($request) : bool {
        $rules = [
            'name' => v::alnum(' '),
            'email' => v::email(),
            'username' => v::notEmpty(),
            'password' => v::notEmpty(),
            'role' => v::number()->between(1, 4)
        ];

        return self::validate($request, $rules);
    }
}