const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { promiseImpl } = require('ejs');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
            .catch(err => {
                res.render('err')
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
        .then(allGenres => {
            res.render('moviesAdd', {allGenres})
        })
        .catch(err => {
            res.send(err)
        })
    },
    create: function (req,res) {
     db.Movie.create(req.body)
     .then(result => {
       res.redirect(`/movies/detail/${result.id}`)
     })
     .catch(err => {
         res.render(err)
     })
    },

    edit: function(req,res) {
        const Movie = db.Movie.findOne({
    where: {id: req.params.id},
    include: [{association: 'genre'}]
        })

        const allGenres = db.Genre.findAll()

        Promise.all([Movie, allGenres])
     /*    .then(Movie => {
            db.Genre.findAll()
            .then(genres => { 

                Movie.genre = genres.find(genre => genre.id === Movie.genre_id)
                res.render('moviesEdit', {Movie, allGenres: genres})
                    
            })
            .catch(err => {
                res.send(err)
            })          

        }) */
        .then((respuesta) => {
            
         res.render('moviesEdit', {Movie: respuesta[0], allGenres: respuesta[1]})
        })
        .catch(err => {
            res.send(err)
        })
        
    },
    update: function (req,res) {
        
    db.Movie.update(req.body,
    {
    where: {id: req.params.id}
      })

      .then(result => {
            if (result !== 0) {
                res.redirect(`/movies/detail/${req.params.id}`)
            } else {
                res.send('No se modifico nada')
            }
       })

       .catch(err => {
           res.send(err)
       })


    },
    delete: function (req,res) {
    db.Movie.findByPk(req.params.id)

    .then(Movie =>{
res.render('moviesDelete', {Movie})
    })

    .catch(err => {
        res.send(err)
    })
    },
    destroy: function (req,res) {
    db.Movie.destroy({
        where: {id: req.params.id}
    })

    .then(result =>{
        res.redirect('/movies')
            })
        
            .catch(err => {
                res.send(err)
            })

  }
}

module.exports = moviesController;