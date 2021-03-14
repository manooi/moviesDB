
// https://docs.mongodb.com/manual/core/schema-validation/


db.createCollection("movie_records", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: [ "title", "year", "rating"],
         properties: {
            name: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            year: {
               bsonType: "int",
               minimum: 1000,
               maximum: 9999,
               description: "must be an integer in [ 1000, 9999 ] and is required"
            },
            rating: {
               bsonType: "string",
               description: "Rating (G, PG, M, MA, R)"
            }
         }
      }
   }
})
