import _ from 'underscore';

/**
 * @return {Promise<object>}
 */
const fetchQuote = async() => {

	const idRamd = _.random(1, 100);
	const res = await fetch(`https://rickandmortyapi.com/api/character/${idRamd}`);		
	const data = await res.json();//promesa

	console.log(data);
	return data;//retorna una promesa
};

/**
 * 
 * @returns 
 */
const createSkeletonLoader = () => {

  const skeletonHTML = `<div class="wrapper skeleton">
	  <div class="left">
		<div class="skeleton-avatar skeleton"></div>
		<div class="skeleton-text skeleton"></div>
		<div class="skeleton-text skeleton" style="width: 60%"></div>
	  </div>
	  <div class="right skeleton-card">
		<div>
		  <h3 class="skeleton-text skeleton" style="width: 40%"></h3>
		  <div class="info_data">
			<div class="data">
			  <div class="skeleton-text skeleton"></div>
			  <div class="skeleton-text skeleton" style="width: 90%"></div>
			</div>
			<div class="data">
			  <div class="skeleton-text skeleton"></div>
			  <div class="skeleton-text skeleton" style="width: 90%"></div>
			</div>
		  </div>
		</div>
		<div>
		  <h3 class="skeleton-text skeleton" style="width: 40%"></h3>
		  <div class="projects_data">
			<div class="data">
			  <div class="skeleton-text skeleton"></div>
			  <div class="skeleton-text skeleton" style="width: 90%"></div>
			</div>
			<div class="data">
			  <div class="skeleton-text skeleton"></div>
			  <div class="skeleton-text skeleton" style="width: 90%"></div>
			</div>
		  </div>
		</div>
	  </div>
	</div>`;

  	const container = document.createElement('div');
  	container.innerHTML = skeletonHTML;
  	
	return container.firstChild;
}

/**
 * 
 * @param {*} element 
 * @returns 
 */
const createProfileCard = ( datauser ) => {

	//desestructuracion de datauser
	const {
		name, 
		species,
		image,
		status,
		origin,
		location,
		gender
	} = datauser;

	//html de la tarjeta de perfil
	const html = `<div class="wrapper">
			<div class="left">
				<img src="${image}" alt="user" width="100">
				<h4>${name}</h4>
				<p>${species}</p>
			</div>
			<div class="right">
				<div class="info">
				<h3>Information</h3>
				<div class="info_data">
					<div class="data">
					<h4>Statuss</h4>
					<p>${status}</p>
					</div>
					<div class="data">
					<h4>Gender</h4>
					<p>${gender}</p>
					</div>
				</div>
				</div>
				<div class="projects">
				<h3>Address</h3>
				<div class="projects_data">
					<div class="data">
					<h4>Location</h4>
					<p>${location}</p>
					</div>
					<div class="data">
					<h4>Origin</h4>
					<p>${origin}</p>
					</div>
				</div>
				</div> 
			</div>
			 <div class="card-add-button-container">
				<button id="btn-refresh" class="card-add-button" aria-label="Añadir">
				<i class="material-icons">refresh</i>
				</button>
			</div>
		</div>`;
  
	const container = document.createElement('div');
  	container.className = 'profile-container'; // ← Añade esta línea
  	container.innerHTML = html;
	
	// Obtenemos el botón ANTES de retornar
  	const refreshButton = container.querySelector('#btn-refresh');
  	
	return {
		card: container.firstChild,
		refreshButton // <- También devolvemos el botón
  	};
};

/**
 * 
 * @param {HTMLDivElement} element 
 */
export const BreakingBadApp = async( element ) => {

	//titulo
	document.querySelector('#app-title').innerHTML = 'Rick and Morty App';

	//loading
	//element.innerHTML = 'Loading...';
	// Mostrar skeleton loader
	const skeleton = createSkeletonLoader();
	element.innerHTML = '';
	element.appendChild(skeleton);

	try 
	{
		//al retornar una promesa se debe usar await
		const quote = await fetchQuote();

		//termina------------------
		if (quote.error) 
		{
			element.innerHTML = `<p class="error">${quote.error}</p>`;
			return;
		}
		//-------------------------

		//objeto para profile
		const userProfile = {
			gender:	quote.gender,
			image: quote.image,
			location: quote.location.name,
			name: quote.name,
			origin: quote.origin.name,
			species: quote.species,
			status: quote.status,
		};
		
 		//Crear el componente de perfil
		//const profileCard = createProfileCard(userProfile);		
		const { card, refreshButton } = createProfileCard(userProfile);

		refreshButton.addEventListener('click', async () => {
			
			await BreakingBadApp(element); // <- Recarga la app completa
		});
	
		//Limpiar el elemento y añadir el perfil
		element.innerHTML = '';
		element.replaceChildren(card);
	} 
	catch (error) 
	{
		console.error(error);	
	}	
};