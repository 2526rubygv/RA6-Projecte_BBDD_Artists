const form = document.getElementById("artist-form");
const loadButton = document.getElementById("load-btn");
const artistOutput = document.getElementById("artist-output");


const artistNameInput = document.getElementById("artist-name");

const deleteSelect = document.getElementById("delete-id");
const deleteOutput = document.getElementById("delete-output");
const deleteButton = document.getElementById("delete-btn");

const deleteCancionSelect = document.getElementById("delete-cancion-id");
const deleteCancionOutput = document.getElementById("delete-cancion-output");
const deleteCancionButton = document.getElementById("delete-cancion-btn");

const deleteAlbumSelect = document.getElementById("delete-album-id");
const deleteAlbumOutput = document.getElementById("delete-album-output");
const deleteAlbumButton = document.getElementById("delete-album-btn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();//per defecte recarregaria la pagina així que evitem això.

  const name = artistNameInput.value.trim();
  if (!name) return;

  const res = await fetch("/api/AddArtist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: name })
  });

  const message = await res.text();
  artistOutput.textContent = message;
  if (res.ok) form.reset();
});

loadButton.addEventListener("click", async () => {

  let  text = "text a enviar en aquest cas la taula";
  text = "artists";
  // Fem una petició HTTP al servidor (Express)
  // fetch() envia una request al backend
  const res = await fetch("/api/artists", {
    // Tipus de petició
    // POST = enviem dades al servidor
    method: "POST",
    // Capçaleres HTTP
    // Indiquem que estem enviant dades en format JSON
    headers: {
      "Content-Type": "application/json"
    },

    // Cos de la petició (les dades que enviem)
    // Convertim l’objecte JS a text JSON
    body: JSON.stringify({ data: text })
  });

  // El servidor respon amb JSON
  const json = await res.json();
  // Mostrem el resultat a la textarea de sortida
  artistOutput.textContent = JSON.stringify(json.result, null, 2);

});

async function loadArtistsForDelete() {
  const res = await fetch("/api/artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "artists" })
  });

  const json = await res.json();
  const select = document.getElementById("delete-id");
  select.innerHTML = "";

  json.result.forEach(artist => {
    const option = document.createElement("option");
    option.value = artist.id;
    option.textContent = artist.name;
    select.appendChild(option);
  });
}

document.getElementById("delete-btn").addEventListener("click", async () => {
  const id = document.getElementById("delete-id").value;

  const res = await fetch("/api/DeleteArtist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  document.getElementById("delete-output").textContent = await res.text();
  loadArtistsForDelete(); 
});
loadArtistsForDelete();

async function loadArtistsForUpdate() {
  const res = await fetch("/api/artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "artists" })
  });

  const json = await res.json();
  const select = document.getElementById("update-artist-id");
  select.innerHTML = "";

  json.result.forEach(artist => {
    const option = document.createElement("option");
    option.value = artist.id;
    option.textContent = artist.name;
    select.appendChild(option);
  });
}
loadArtistsForUpdate();

document.getElementById("update-artist-btn").addEventListener("click", async () => {
  const id = document.getElementById("update-artist-id").value;
  const newName = document.getElementById("update-artist-name").value;

  const res = await fetch("/api/UpdateArtist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, newName: newName })
  });

  document.getElementById("update-artist-output").textContent = await res.text();

  loadArtistsForUpdate();
  loadArtistsForDelete();
});

document.getElementById("add-cancion-btn").addEventListener("click", async () => {
  const album_id = document.getElementById("cancion-album-id").value;
  const title = document.getElementById("cancion-name").value;

  const res = await fetch("/api/AddCancion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ album_id: album_id, title: title })
  });

  document.getElementById("add-cancion-output").textContent = await res.text();
  loadCancionesForDelete();
});

async function loadCancionesForDelete() {
  const res = await fetch("/api/canciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  const json = await res.json();
  deleteCancionSelect.innerHTML = "";

  json.result.forEach(cancion => {
    const option = document.createElement("option");
    option.value = cancion.id;
    option.textContent = `${cancion.title} (${cancion.album_title})`;
    deleteCancionSelect.appendChild(option);
  });
}

deleteCancionButton.addEventListener("click", async () => {
  const id = deleteCancionSelect.value;

  const res = await fetch("/api/DeleteCancion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  deleteCancionOutput.textContent = await res.text();
  loadCancionesForDelete();
});
loadCancionesForDelete();

document.getElementById("add-album-btn").addEventListener("click", async () => {
  const artist_id = document.getElementById("album-artist-id").value;
  const title = document.getElementById("album-name").value;

  const res = await fetch("/api/AddAlbum", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ artist_id: artist_id, title: title })
  });

  document.getElementById("add-album-output").textContent = await res.text();
  loadAlbumsForDelete();
});

async function loadAlbumsForDelete() {
  const res = await fetch("/api/albums", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  const json = await res.json();
  deleteAlbumSelect.innerHTML = "";

  json.result.forEach(album => {
    const option = document.createElement("option");
    option.value = album.id;
    option.textContent = `${album.title} (${album.artist_name})`;
    deleteAlbumSelect.appendChild(option);
  });
}

deleteAlbumButton.addEventListener("click", async () => {
  const id = deleteAlbumSelect.value;

  const res = await fetch("/api/DeleteAlbum", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  deleteAlbumOutput.textContent = await res.text();
  loadAlbumsForDelete();
});
loadAlbumsForDelete();

async function loadArtistsForAlbum() {
  const res = await fetch("/api/artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "artists" })
  });
  const json = await res.json();
  const sel = document.getElementById("album-artist-id");
  sel.innerHTML = "";
  json.result.forEach(a => sel.innerHTML += `<option value="${a.id}">${a.name}</option>`);
}

async function loadArtistsForCancion() {
  const res = await fetch("/api/artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "artists" })
  });
  const json = await res.json();
  const sel = document.getElementById("cancion-artist-id");
  sel.innerHTML = "";
  json.result.forEach(a => sel.innerHTML += `<option value="${a.id}">${a.name}</option>`);
}

document.getElementById("cancion-artist-id").addEventListener("change", async () => {
  const artist_id = document.getElementById("cancion-artist-id").value;
  const res = await fetch("/api/albumsByArtist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ artist_id })
  });
  const json = await res.json();
  const sel = document.getElementById("cancion-album-id");
  sel.innerHTML = "";
  json.result.forEach(al => sel.innerHTML += `<option value="${al.id}">${al.title}</option>`);
});
loadArtistsForCancion();
loadArtistsForAlbum();
