var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient

const fetch = require("node-fetch");


router.get('/', function(req, res, next) {

	let nombre = req.query.nombre

	let puntaje = parseInt(req.query.puntaje)

	let connectionString = 'mongodb+srv://luna:messi@cluster0.hqnpi.mongodb.net/spaceinvadersdb?retryWrites=true&w=majority'

	MongoClient.connect(connectionString, { useUnifiedTopology: true })
	.then(client => {
		console.log('Connected to Database')
		const db = client.db('spaceinvadersdb')
		const coleccion = db.collection('jugadores')

		const cursor = coleccion.find({ nombre: nombre }).toArray()
		.then(results => {

			console.log(results)

			if(results.length == 0){

				coleccion.insertOne({ nombre: nombre, ultimoPuntaje: puntaje, mejorPuntaje: puntaje })
				.then(result => {

					coleccion.find().toArray()
					.then(results2 => {

						res.send(results2)

					})

				})
				.catch(error => console.error(error))

			}else{

				let mejorPuntaje

				if(puntaje>parseInt(results[0].mejorPuntaje)){
					mejorPuntaje=puntaje
				}else{
					mejorPuntaje=parseInt(results[0].mejorPuntaje)
				}

				coleccion.findOneAndUpdate(
					{ nombre: nombre },
					{
						$set: {
							ultimoPuntaje: puntaje,
							mejorPuntaje: mejorPuntaje
						}
					}
				)
				.then(result => {

					coleccion.find().toArray()
					.then(results2 => {

						res.send(results2)

					})

				})
				.catch(error => console.error(error))

			}

		})

	})
	.catch(error => console.error(error))



});

module.exports = router;
