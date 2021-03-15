const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
const methodOverride = require('method-override')


app.set('view engine', 'ejs')


app.use(methodOverride('_method'))
app.use(bodyParser.json())
// app.use(express.static('public'))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
  extended: true
}))

// local
const url = 'mongodb://localhost:27017/movieDB'
mongoose.connect(url, {
  useNewUrlParser: true
});

const movieSchema = {
  title: String,
  year: Number,
  rating: String
};

const Movie = mongoose.model("Movie", movieSchema);




///////////////////// Request Targetting All  Movies
// https://mongoosejs.com/docs/models.html

app.route('/')
.get(function(req, res) {
  res.redirect('/movies')
});



app.route('/movies')
.get(function(req, res) {
  Movie.find(function(err, foundMovies) {
    // console.log(foundMovies);
    if (!err) {
      res.render('sitron.ejs', {data:foundMovies})
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res) {
  // console.log(req.body.title);
  // console.log(req.body.content);
  const newMovie = new Movie({
    title: req.body.title,
    year: req.body.year,
    rating: req.body.rating,
  });
  newMovie.save(function(err) {
    if (!err) {
      // res.send('Successfully added a new movies.');
      res.redirect('/movies')
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res) {
  Movie.deleteMany(function(err) {
    if (!err) {
      // res.send('Successfully deleted all movies.');
      res.redirect('/movies')
    } else {
      res.send(err);
    }
  });
});


///////////////////// Request Targetting Specific Movies


app.route('/movies/:moviesID')

  .get(function(req, res) {

    Movie.findOne({
      _id: req.params.moviesID
    }, function(err, foundMovie) {
      if (!err) {
        res.send(foundMovie);
      } else {
        res.send("No movie matching that title was found.");
      }
    });
  })

  .put(function(req, res) {

    Movie.update(
    // Condition
    {_id:req.params.moviesID},
    // Update
    {title: req.body.title, year: req.body.year, rating: req.body.rating},
    // Overwrite
    {overwrite:true},
    // Callback
    function(err) {
      if(!err) {
        // res.send('Successfully updated movie.')
        res.redirect('/movies')
      } else {
        res.send(err)
      }
    }
  )}
)

  .patch(function(req, res) {

    Movie.update(
      // Condition
      {_id:req.params.moviesID},
      // Set
      {$set: req.body},
      // Callback
      function(err) {
        if(!err) {
          // res.send('Successfully updated movie.')
          res.redirect('/movies')
        } else {
          res.send(err)
        }
      }
    );
  })

  .delete(function(req, res) {
    Movie.deleteOne(
      // Condition
      {_id:req.params.moviesID},
      // Callback
      function(err) {
        if(!err) {
          // res.send('Successfully deleted movie.')
          res.redirect('/movies')
        } else {
          res.send(err)
        }
      }
  )
});


// Exposed API

app.route('/api/movies')
.get(function(req, res) {
  Movie.find(function(err, foundMovies) {
    // console.log(foundMovies);
    if (!err) {
      res.send(foundMovies)
    } else {
      res.send(err);
    }
  });
});

app.route('/api/movies/:moviesID')
  .get(function(req, res) {
    Movie.findOne({
      _id: req.params.moviesID
    }, function(err, foundMovie) {
      if (!err) {
        res.send(foundMovie);
      } else {
        res.send("No movie matching that title was found.");
      }
    });
  });






app.listen(3000, function() {
  console.log('listening on port 3000')
})



