<?php
/**
 * Author: Joseph Juarez
 * Date: 9/24/25
 * File: Videogame.php
 * Description: Defines the Videogame model class.
 */

namespace VideogamesAPI\Models;
use Illuminate\Database\Eloquent\Model;
class Videogame extends Model{
    // The table associated with this model (our Video Games table)
    protected $table = 'Videogames';

    // The primary key of the table
    protected $primaryKey = 'videogame_id';

    // The PK is numeric
    public $incrementing = true;

    // The PK type
    protected $keyType = 'int';
    // If the created_at and updated_at columns are not used
    public $timestamps = false;

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Defines One-to-Many Relationship [ONE publisher can have MANY Video Games]
    public function publisher(){
        return $this->belongsTo(Publisher::class, 'publisher_id');
    }

    // Defines Many-to-Many Relationship [Video Games < - > Categories]
    public function categories() {
        return $this->belongsToMany(Category::class, 'Videogame_Categories', 'videogame_id', 'category_id');
    }
    // Defines Many-to-Many Relationship [Video Games < - > Platforms]
    public function platforms() {
        return $this->belongsToMany(Platform::class, 'Videogame_Platforms', 'videogame_id', 'platform_id');
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/


    // Get ALL the Video Games.
    public static function getVideogames($request) {
        $videogames = self::all();
        return $videogames;
    }

    // Get Video Game by ID.
    public static function getVideogameById(int $videogameId) {
        $videogameId = self::findOrFail($videogameId);
        return $videogameId;
    }

    // [Relationship M:N]
    // Returns all categories associated with a specific Video Game ID.
    public static function getVideogameCategories(int $id)
    {
        return self::findOrFail($id)->categories;
    }

    // [Relationship M:N]
    // Returns all platforms associated with a specific Video Game ID.
    public static function getVideogamePlatforms(int $id)
    {
        return self::findOrFail($id)->platforms;
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Insert a new Video Game.
    public static function createVideogame($request) {
        // Retrieve parameters from request body.
        $params = $request->getParsedBody();

        // Create a new Video Game instance.
        $videogame = new Videogame();

        // Set the Video Game attributes.
        foreach($params as $field => $value) {
            $videogame->$field = $value;
        }

        // Insert the Video Game into the database.
        $videogame->save();

        return $videogame;
    }

    // Update a Video Game.
    public static function updateVideogame($request) {
        // Retrieve parameters from request body.
        $params = $request->getParsedBody();

        // Retrieve ID from request url.
        $id = $request->getAttribute('videogame_id');
        $videogame = self::findOrFail($id);

        if(!$videogame) {
            return false;
        }

        // Update attributes of the Video Game.
        foreach($params as $field => $value) {
            $videogame->$field = $value;
        }

        // Save the Video Game into the database
        $videogame->save();
        return $videogame;

    }

    // Delete a Video Game.
    public static function deleteVideogame($request) {
        // Retrieve ID from the request url.
        $id = $request->getAttribute('videogame_id');
        $videogame = self::findOrFail($id);
        return ($videogame ? $videogame->delete() : $videogame);
    }
}