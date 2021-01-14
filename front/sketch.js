
let n

let anchoNave = 30

let listaAliens = []

let anchoAlien = 40

let listaDisparos = []

let listaRayos = []

let anchoRayo = anchoAlien/3

let salud = 1

let nombre



function setup() {

	vex.dialog.alert({ unsafeMessage: 
		`<h1>Como es tu nombre?</h1><br/>
		<input id="nombre" type="text"/>`,
		callback: function (data) {

			loop()

			nombre = document.getElementById("nombre").value

			console.log(nombre)
			
    	}
	})

	noLoop()

	createCanvas(window.innerWidth, window.innerHeight)

	n = new Nave(window.innerWidth/2,window.innerHeight-anchoNave,anchoNave)

	let x = anchoAlien + (anchoAlien/3)

	let y = anchoAlien + (anchoAlien/3)

	for(let i = 0; i<50;i++){

		listaAliens.push(new Alien(x,y,anchoAlien))

		x+=anchoAlien + (anchoAlien/3)

		if(i==9||i==19||i==29||i==39){
			y+=anchoAlien + (anchoAlien/3)
			x=anchoAlien + (anchoAlien/3)
		}
		
	}

}

function draw(){

	background(0)


	for(let i=0;i<listaRayos.length;i++){

		if(n.colisiona(listaRayos[i])){
			listaRayos.splice(i, 1)
			salud--
		}

	}

	if(salud<=0){
		finDelJuego(false)
	}

	if(listaAliens.length==0){
		finDelJuego(true)
	}


	if (keyIsPressed){

		if(keyCode === RIGHT_ARROW){

			n.mover(1)

		}else if(keyCode === LEFT_ARROW){

			n.mover(-1)

		}

	}

	n.mostrar()




	if((Math.random() < 0.15) && listaAliens.length>1){

		let indexAlien = 55

		while(listaAliens[indexAlien] === undefined){

			indexAlien = Math.floor(Math.random() * 49) + 1

		}

		listaRayos.push(new Rayo(listaAliens[indexAlien].x,listaAliens[indexAlien].y,anchoRayo))

	}


	for(let i=0;i<listaAliens.length;i++){

		for(let j=0;j<listaDisparos.length;j++){

			if((listaAliens[i] != undefined)&&(listaDisparos[j] != undefined)){

				if(listaAliens[i].colisiona(listaDisparos[j])){
					listaAliens.splice(i, 1)
					listaDisparos.splice(j, 1)
				}
			}
		}

	}




	let limite = false

	for(let i = 0; i<listaAliens.length;i++){

		if(listaAliens[i].x >= window.innerWidth || listaAliens[i].x <= 0){
			limite = true
		}

	}


	for(let i = 0; i<listaAliens.length;i++){

		if(limite){
			listaAliens[i].direccion *= -1
		}

		listaAliens[i].mover()

		listaAliens[i].mostrar()

	}

	for(let i = 0; i<listaDisparos.length;i++){

		listaDisparos[i].mover()
		listaDisparos[i].mostrar()

	}

	for(let i = 0; i<listaRayos.length;i++){

		listaRayos[i].mover()
		listaRayos[i].mostrar()

	}

}

function empezar(){

	listaAliens = []

	listaDisparos = []

	listaRayos = []

	salud = 1

	n = new Nave(window.innerWidth/2,window.innerHeight-anchoNave,anchoNave)

	let x = anchoAlien + (anchoAlien/3)

	let y = anchoAlien + (anchoAlien/3)

	for(let i = 0; i<50;i++){

		listaAliens.push(new Alien(x,y,anchoAlien))

		x+=anchoAlien + (anchoAlien/3)

		if(i==9||i==19||i==29||i==39){
			y+=anchoAlien + (anchoAlien/3)
			x=anchoAlien + (anchoAlien/3)
		}
		
	}

}

function finDelJuego(gano){

	let puntaje = (50-listaAliens.length) * 1234

	let estadoFinal

	if(gano){
		estadoFinal="Ganaste "
	}else{
		estadoFinal="Game Over "
	}

	noLoop()

	vex.dialog.alert({ unsafeMessage: 
		`<h1>`+estadoFinal + nombre + `! Puntaje: ` + puntaje + `</h1>`,
		callback: function (data) {

			fetch('https://space-invaders01.herokuapp.com/?nombre=' + nombre + '&puntaje=' + puntaje)
				.then(response => response.json())
				.then(data => {

					console.log(data)

					tablaPuntajes = data

					tablaPuntajes.sort((a, b) => parseFloat(b.mejorPuntaje) - parseFloat(a.mejorPuntaje))

					let mensaje = `<h1>Tabla de Puntajes:</h1>
												</br>
												<table class="table table-striped table-dark">
												  <thead>
												    <tr>
												      <th scope="col">#</th>
												      <th scope="col">Nombre</th>
												      <th scope="col">Ultimo Puntaje</th>
												      <th scope="col">Mejor Puntaje</th>
												    </tr>
												  </thead>
												  <tbody>`;


					for (let i = 0; i < tablaPuntajes.length; i++) {

						mensaje = mensaje + `
												    <tr>
												      <th scope="row">` + (i + 1) + `</th>
												      <td>` + tablaPuntajes[i].nombre + `</td>
												      <td>` + tablaPuntajes[i].ultimoPuntaje + `</td>
												      <td>` + tablaPuntajes[i].mejorPuntaje + `</td>
												    </tr>`
					}

					mensaje = mensaje + `</tbody></table>`

					vex.dialog.alert({

						unsafeMessage: mensaje,

						callback: function(data) {

							empezar()

							loop()

						}
					})



				})
			
    	}
	})

}

function Rayo(x, y, ancho){

	this.x = x
	this.y = y
	this.ancho = ancho

	this.mover = function(){

		this.y += 5

	}

	this.mostrar = function(){

		fill(255)

		rect(this.x, this.y, this.ancho, this.ancho, 100)

	}


}

function Disparo(x, y, ancho){

	this.x = x
	this.y = y
	this.ancho = ancho

	this.mover = function(){

		this.y -= 5

	}

	this.mostrar = function(){

		fill(0, 255, 0)

		rect(this.x, this.y, this.ancho, this.ancho, 100)

	}


}

function keyPressed(){

	if(key==" "){

		listaDisparos.push(new Disparo(n.x,n.y,anchoNave/2))

	}

}


function Alien(x,y,ancho){

	this.x = x

	this.y = y

	this.ancho = ancho

	this.direccion = 1

	this.mover = function(){

		this.x += (2 * this.direccion)

	}

	this.mostrar = function(){

		fill(255)

		rect(this.x, this.y, this.ancho, this.ancho)

	}

	this.colisiona = function(tiro){

		return collideRectRect(this.x, this.y, this.ancho, this.ancho, tiro.x, tiro.y, tiro.ancho, tiro.ancho)

	}

}

function Nave(x, y, ancho){

	this.x = x
	this.y = y
	this.ancho = ancho

	this.mostrar = function(){

		fill(0, 255, 0)

		rect(this.x, this.y, this.ancho, this.ancho)

	}

	this.mover = function(direccion){

		this.x += (10*direccion)

	}

	this.colisiona = function(r){

		return collideRectRect(this.x, this.y, this.ancho, this.ancho, r.x, r.y, r.ancho, r.ancho)

	}


}