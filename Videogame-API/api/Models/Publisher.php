<?php
/**
 * Author: Ethan Mull
 * Date: 9/24/2025
 * File: Publisher.php
 * Description:
 */

namespace VideogamesAPI\Models;

use Illuminate\Database\Eloquent\Model;

class Publisher extends Model{
    protected $table = 'publishers';
    protected $primaryKey = 'publisher_id';
    public $incrementing = false;
    protected $keyType = 'int';
    public $timestamps = false;

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Defines One-to-Many Relationship
    public function videogames()
    {
        return $this->hasMany(Videogame::class, 'publisher_id');
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Get ALL the Publishers.
    public static function getPublishers($request)
    {
        //$publishers = self::all();
        //$publishers = self::with('videogames')->get();
        //return $publishers;
        /*********** code for pagination and sorting *************************/
        //get the total number of row count
        $count = self::count();

        //Get querystring variables from url
        $params = $request->getQueryParams();

        //do limit and offset exist?
        $limit = array_key_exists('limit', $params) ? (int)$params['limit'] : 10;   //items per page
        $offset = array_key_exists('offset', $params) ? (int)$params['offset'] : 0;  //offset of the first item

        //pagination
        $links = self::getLinks($request, $limit, $offset);

        //build query
        $query = self::with('videogames');  //build the query to get all courses
        $query = $query->skip($offset)->take($limit);  //limit the rows

        //code for sorting
        //code for sorting
        $sort_key_array = self::getSortKeys($request);
//soft the output by one or more columns
        foreach ($sort_key_array as $column => $direction) {
            $query->orderBy($column, $direction);
        }


        //retrieve the courses
        $courses = $query->get();  //Finally, run the query and get the results

        //construct the data for response
        $results = [
            'totalCount' => $count,
            'limit' => $limit,
            'offset' => $offset,
            'links' => $links,
            'sort' => $sort_key_array,
            'data' => $courses
        ];

        return $results;
    }

    // Get Publisher via ID
    public static function getPublisherById(string $publisherId) {
        $publisherId = self::findOrFail($publisherId);
        return $publisherId;
    }

    // [Relationship 1:M]
    // Returns all Video Games associated with a specific Publisher ID.
    public static function getPublisherVideogames(int $publisherId) {
        $publisherId = self::findOrFail($publisherId);
        $publisherId->load('videogames');
        return $publisherId;
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Insert a new Publisher.
    public static function createPublisher($request) {
        // Retrieve parameters from request body.
        $params = $request->getParsedBody();

        // Create a new Publisher instance.
        $publisher = new Publisher();

        // Set the Publishers attributes.
        foreach($params as $field => $value) {
            $publisher->$field = $value;
        }

        // Insert the Publisher into the database.
        $publisher->save();

        return $publisher;
    }

    // Update a Publisher.
    public static function updatePublisher($request) {
        // Retrieve parameters from request body.
        $params = $request->getParsedBody();

        // Retrieve ID from request url.
        $id = $request->getAttribute('publisher_id');
        $publisher = self::findOrFail($id);

        if(!$publisher) {
            return false;
        }

        // Update attributes of the Publisher.
        foreach($params as $field => $value) {
            $publisher->$field = $value;
        }

        // Save the Publisher into the database
        $publisher->save();
        return $publisher;
    }

    // Delete a Publisher.
    public static function deletePublisher($request) {
        // Retrieve ID from the request url.
        $id = $request->getAttribute('publisher_id');
        $publisher = self::findOrFail($id);
        return ($publisher ? $publisher->delete() : $publisher);
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // For the pagination.
    // Return an array of links for pagination. The array includes links for the current, first, next, and last pages.
    private static function getLinks($request, $limit, $offset) {
        $count = self::count();

        // Get request uri and parts
        $uri = $request->getUri();
        if($port = $uri->getPort()) {
            $port = ':' . $port;
        }
        $base_url = $uri->getScheme() . "://" . $uri->getHost() . $port . $uri->getPath();

        // Construct links for pagination
        $links = [];
        $links[] = ['rel' => 'self', 'href' => "$base_url?limit=$limit&offset=$offset"];
        $links[] = ['rel' => 'first', 'href' => "$base_url?limit=$limit&offset=0"];
        if ($offset - $limit >= 0) {
            $links[] = ['rel' => 'prev', 'href' => "$base_url?limit=$limit&offset=" . $offset - $limit];
        }
        if ($offset + $limit < $count) {
            $links[] = ['rel' => 'next', 'href' => "$base_url?limit=$limit&offset=" . $offset + $limit];
        }
        $links[] = ['rel' => 'last', 'href' => "$base_url?limit=$limit&offset=" . $limit * (ceil($count / $limit) - 1)];

        return $links;
    }

    // For the sorting
    /*
         * Sort keys are optionally enclosed in [ ], separated with commas;
         * Sort directions can be optionally appended to each sort key, separated by :.
         * Sort directions can be 'asc' or 'desc' and defaults to 'asc'.
         * Examples: sort=[number:asc,title:desc], sort=[number, title:desc]
         * This function retrieves sorting keys from uri and returns an array.
        */
    private static function getSortKeys($request) {
        $sort_key_array = [];

        // Get querystring variables from url
        $params = $request->getQueryParams();

        if (array_key_exists('sort', $params)) {
            $sort = preg_replace('/^\[|]$|\s+/', '', $params['sort']);  // remove white spaces, [, and ]
            $sort_keys = explode(',', $sort); //get all the key:direction pairs
            foreach ($sort_keys as $sort_key) {
                $direction = 'asc';
                $column = $sort_key;
                if (strpos($sort_key, ':')) {
                    list($column, $direction) = explode(':', $sort_key);
                }
                $sort_key_array[$column] = $direction;
            }
        }

        return $sort_key_array;
    }

    // For the search feature
    // Search for publisher
    // For the numeric: searching by exact publisher_id
    // Else: we are searching by name, country, or website
    public static function searchPublishers($term) {
        if(is_numeric($term)) {
            $query = self::where('publisher_id', '>=', $term);
        } else {
            $query = self::where('publisher_name', 'like', "%$term%")
                ->orWhere('country', 'like', "%$term%")
                ->orWhere('website_url', 'like', "%$term%");
        }
        return $query->get();
    }

}