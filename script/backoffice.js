//Dichiarazioni costanti elementi HTML  e query da URL
const apiUrl = "https://striveschool-api.herokuapp.com/api/product/"

const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const brandInput = document.getElementById('brand');
const imageUrlInput = document.getElementById('imageUrl');
const priceInput = document.getElementById('price');

const form = document.getElementById("product-form")
const button = document.getElementById("buttonSubmit")

const container = document.getElementById("main-container")

const spinner  = document.getElementById("loader")

const title = document.getElementById("titleAddModify")
const params = new URLSearchParams(location.search)
const id = params.get("id")
const stat = params.get("stat")

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGVhNGJlMTUxNWY0MTAwMTQ2OTdhMmYiLCJpYXQiOjE2OTMwNzY0NTAsImV4cCI6MTY5NDI4NjA1MH0.GLbruDI2UUxg85xnQxE0hVnzqR1iBCI3sEdbzhqNYuw"

//Controllo input se sono vuoti per gestione aggiunta prodotti senza campi
const checkInput = () => {
  if (nameInput.value == "" || descriptionInput.value == "" || brandInput.value == "" || imageUrlInput.value == "" || priceInput.value == "" || checkImage == false) {
    return false
  } else {
    return true
  }
}

//Evento che monitora il click del pulsante "Add/Modify"
form.addEventListener('submit', async (event) => {

  event.preventDefault();

  const product = {
    //encode stringhe per gestione caratteri speciali
    name: encodeURIComponent(nameInput.value),
    description: encodeURIComponent(descriptionInput.value),
    brand: encodeURIComponent(brandInput.value),
    imageUrl: encodeURIComponent(imageUrlInput.value),
    price: encodeURIComponent(priceInput.value)
  }

  let URL = ""
  let method = ""
 
  //Controllo se su query string per impostare il corretto metodo al fetch per modifica o aggiunta
  if(id !== null && id !== "add") {
    URL = `${apiUrl}${id}`
    method = "PUT"
  } else {
    URL = `${apiUrl}`
    method = "POST"
  }

  //Esecuzione della fetch PUT o POST (determinata dal controllo appena sopra) per modifica o aggiuinta di nuovi prodotti
  if(checkInput()) {
    try {
      const response = await fetch(URL, {
        method: method,
        body: JSON.stringify(product),
        headers: {
          "Authorization": token,
          "Content-type": "application/json; charset=UTF-8"
        }
      })
  
      if (response.ok) {
        method == "PUT" ? alert("Product modified success") : alert("Product added success")
        window.location.href = 'backoffice.html'
      }
    } catch (error) {
      console.log('Errore durante il salvataggio: ', error);
      alert('Si è verificato un errore durante il salvataggio.')
    }
  } else {
    alert("Controlla i campi, non vengono accettati campi vuoti")
  }
})

//Funzione per fare il fetch GET di uno specifico prodotto attraverso l'id
async function fetchOneProduct(id) {
  try {
    const response = await fetch(`${apiUrl}${id}`, {
      headers: {
      "Authorization": token
      }
      })
      const productData = await response.json()
      console.log(productData)
      printFormProduct(productData)
  } catch (error) {
    console.log('Errore recupero dati prodotti: ', error);
  }
}

const printFormProduct = (product) => {
  //decodifica stringhe per gestione caratteri speciali
  nameInput.value = decodeURIComponent(product.name)
  descriptionInput.value = decodeURIComponent(product.description)
  brandInput.value = decodeURIComponent(product.brand)
  imageUrlInput.value = decodeURIComponent(product.imageUrl)
  priceInput.value = decodeURIComponent(product.price)
  imageViewr.innerHTML = `<img src="${inputImage.value}" onerror="return imageError();" class="img-fluid rounded-start" alt="...">`
        
};

//Controllo della query string per modificare il titolo e il testo del pulsante a seconda se è per aggiungere o modificare un prodotto
if(id != null && id != "add") {
  title.innerHTML = "Modify Product"
  button.innerHTML = "Modify"
  fetchOneProduct(id)
}

//Se l'URL non ha nessuna query allora carica la tabella con tutti i prodotti nella pagina backoffice
if(id == null) {
  form.classList.add("d-none")
  fetchProducts()
}

//Funzione per il fetch GET di tutti i prodotti
async function fetchProducts() {
  try {
    const response = await fetch(`${apiUrl}`, {
      headers: {
      "Authorization": token
      }
      })
      const productData = await response.json()
      printProduct(productData)
  } catch (error) {
    console.log('Errore recupero dati prodotti: ', error);
  }
}

//Funzione per la stampa della tabella su pagina backoffice
const printProduct = (allProducts) => {
  let tableHtml = ``
  tableHtml = `
              <table class="table mt-3">
                <thead>
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price (€)</th>
                    <th scope="col">Options</th>
                  </tr>
                </thead>
              <tbody>
              `
  
  allProducts.forEach(element => {
    //decodifica stringhe per gestione caratteri speciali
    const name = decodeURIComponent(element.name)
    const description = decodeURIComponent(element.description)
    const brand = decodeURIComponent(element.brand)
    const imageUrl = decodeURIComponent(element.imageUrl)
    const price = decodeURIComponent(element.price)
    const id = decodeURIComponent(element._id)
    const row = `
                <tr>
                  <th scope="row"><img src="${imageUrl}" class="imgbackoffice"></th>
                  <td>${name}</td>
                  <td>${price}</td>
                  <td><a class="btn btn-primary" href="./backoffice.html?id=${id}" role="button"><ion-icon name="pencil-outline"></ion-icon></a> <button type="button" class="btn btn-danger" onClick="deleteProduct('${element._id}')"><ion-icon name="trash-outline"></ion-icon></button></td>
                </tr>
                `
    tableHtml += row
    
});
  tableHtml += `
      </tbody>
    </table>
  `
  container.innerHTML = tableHtml

}


//Funzione per fetch DELETE per eliminazione prodotti
async function deleteProduct(id) {
  if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
    try {
      const response = await fetch(`${apiUrl}${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token
        }
      })
  
      if (response.ok) {
        window.location.href = 'backoffice.html'
      }
    } catch (error) {
      console.log('Errore durante eliminazione prodotto: ', error);
      alert('Si è verificato un errore durante eliminazione.')
    }
  }
}

//Anteprima immagine caricata con gestione errore se immagine non trovata
let timeout;
let checkImage

const inputImage = document.getElementById("imageUrl")
const imageViewr = document.getElementById("imageViewer")

inputImage.addEventListener('input', () => {
  clearTimeout(timeout);
  
  timeout = setTimeout(() => {
    if(inputImage.value.length >= 1) {
        imageViewr.innerHTML = `<img src="${inputImage.value}" onerror="return imageError();" class="img-fluid rounded-start" alt="...">`
        checkImage = true
      } else {
      if (inputImage.value.length == 0) {
        imageViewr.innerHTML = ""
      }
    }
  }, 500);
});

const imageError = () => {
  imageViewr.innerHTML = "Errore nel caricamente dell'immagine. Controlla URL"
  checkImage = false
}