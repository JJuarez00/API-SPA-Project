<?php
/**
 * Author: Joseph Juarez
 * Date: 9/24/2025
 * File: Category.php
 * Description:
 */

namespace VideogamesAPI\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model {

    protected $table = 'categories';

    protected $primaryKey = 'category_id';

    public $incrementing = true;
    protected $keyType = 'int';

    public $timestamps = false;

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Defines Many-to-Many Relationship [Categories < - > Video Games]
    public function videogames()
    {
        return $this->belongsToMany(Videogame::class, 'Videogame_Categories', 'category_id', 'videogame_id');
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Get ALL the Categories.
    public static function getCategories($request) {
        // $categories = self::all();
        // return $categories;
        /*********** code for pagination and sorting *************************/
        // Get the total number of row count
        $count = self::count();

        // Get querystring variables from url
        $params = $request->getQueryParams();

        // Do limit and offset exist?
        $limit = array_key_exists('limit', $params) ? (int)$params['limit'] : 10;   //items per page
        $offset = array_key_exists('offset', $params) ? (int)$params['offset'] : 0;  //offset of the first item

        // Pagination
        $links = self::getLinks($request, $limit, $offset);

        // Build query
        $query = self::with('videogames');  // Build the query to get all courses
        $query = $query->skip($offset)->take($limit);  // Limit the rows

        // Code for sorting
        $sort_key_array = self::getSortKeys($request);

        // Soft the output by one or more columns
        foreach ($sort_key_array as $column => $direction) {
            $query->orderBy($column, $direction);
        }


        // Retrieve the courses
        $courses = $query->get();  // Finally, run the query and get the results

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

    // Get Category by ID.
    public static function getCategoryById(int $categoryId) {
        $categoryId = self::findOrFail($categoryId);
        return $categoryId;
    }

    // [Relationship M:N]
    // Returns all Video Games associated with a specific Category ID.
    public static function getCategoryVideogames(int $id)
    {
        return self::findOrFail($id)->videogames;
    }

    /** -------------------------------[ Break Point ]----------------------------------- **/

    // Insert a new Category.
    public static function createCategory($request) {
        // Retrieve parameters from request body.
        $params = $request->getParsedBody();

        // Create a new Category instance.
        $category = new Category();

        // Set the Categories attributes.
        foreach($params as $field => $value) {
            $category->$field = $value;
        }

        // Insert the Category into the database.
        $category->save();

        return $category;
    }

    // Update a Category.
    public static function updateCategory($request) {
        // Retrieve parameters from request body.
        $params = $request->getParsedBody();

        // Retrieve ID from request url.
        $id = $request->getAttribute('category_id');
        $category = self::findOrFail($id);

        if(!$category) {
            return false;
        }

        // Update attributes of the Category.
        foreach($params as $field => $value) {
            $category->$field = $value;
        }

        // Save the Category into the database
        $category->save();
        return $category;
    }

    // Delete a Category.
    public static function deleteCategory($request) {
        // Retrieve ID from the request url.
        $id = $request->getAttribute('category_id');
        $category = self::findOrFail($id);
        return ($category ? $category->delete() : $category);
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
            $sort = preg_replace('/^\[|]$|\s+/', '', $params['sort']);  // Remove white spaces, [, and ]
            $sort_keys = explode(',', $sort); // Get all the key:direction pairs
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

    // Search for categories
    // For the numeric: searching by exact category_id
    // Else: we are searching by name or description
    public static function searchCategories($term) {
        if(is_numeric($term)) {
            $query = self::where('category_id', '>=', $term);
        } else {
            $query = self::where('category_name', 'like', "%$term%")
                ->orWhere('description', 'like', "%$term%");
        }
        return $query->get();
    }
}