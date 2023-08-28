//const declaration HTML element and URL query
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

//Input control if one of them are blank to prevent add product empty
const checkInput = () => {
  if (nameInput.value == "" || descriptionInput.value == "" || brandInput.value == "" || imageUrlInput.value == "" || priceInput.value == "" || checkImage == false) {
    return false
  } else {
    return true
  }
}

//Event to control click button Add/Modify
form.addEventListener('submit', async (event) => {

  event.preventDefault();

  const product = {
    //String encode to prevent error on special carachter
    name: encodeURIComponent(nameInput.value),
    description: encodeURIComponent(descriptionInput.value),
    brand: encodeURIComponent(brandInput.value),
    imageUrl: encodeURIComponent(imageUrlInput.value),
    price: encodeURIComponent(priceInput.value)
  }

  let URL = ""
  let method = ""
 
  //URL query to assign correct method for add new product or modify
  if(id !== null && id !== "add") {
    URL = `${apiUrl}${id}`
    method = "PUT"
  } else {
    URL = `${apiUrl}`
    method = "POST"
  }

  //Fetch PUT or POST
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

//Fetch GET function for only one product from a ID
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
  //string decode to prevent error on special carachter
  nameInput.value = decodeURIComponent(product.name)
  descriptionInput.value = decodeURIComponent(product.description)
  brandInput.value = decodeURIComponent(product.brand)
  imageUrlInput.value = decodeURIComponent(product.imageUrl)
  priceInput.value = decodeURIComponent(product.price)
  imageViewr.innerHTML = `<img src="${inputImage.value}" onerror="return imageError();" class="img-fluid rounded-start" alt="...">`
        
};

//URL query control to modify title and button name
if(id != null && id != "add") {
  title.innerHTML = "Modify Product"
  button.innerHTML = "Modify"
  fetchOneProduct(id)
}

//If URL query are black load table with all product
if(id == null) {
  form.classList.add("d-none")
  fetchProducts()
}

//Fetch GET for all products
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

//Print function for all product table on backoffice page
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
    //string decoding to prevent error on spacial carachterde
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


//Fetch DELETE function to delete one product from ID
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

//Load image preview and control if there is a 404 error
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
