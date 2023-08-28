//Const declaration
const apiUrl = "https://striveschool-api.herokuapp.com/api/product/"

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGVhNGJlMTUxNWY0MTAwMTQ2OTdhMmYiLCJpYXQiOjE2OTMwNzY0NTAsImV4cCI6MTY5NDI4NjA1MH0.GLbruDI2UUxg85xnQxE0hVnzqR1iBCI3sEdbzhqNYuw"

//Fetch GET function for all products
async function fetchProducts() {
    try {
      const response = await fetch(`${apiUrl}`, {
        headers: {
        "Authorization": token
        }
        })
        const productData = await response.json()
        console.log(productData)
        printProduct(productData)
    } catch (error) {
      console.log('Errore recupero dati prodotti: ', error);
    }
}


//Print function to DOM for Fetch GET all products
const printProduct = (allProducts) => {
  const productList = document.getElementById("productsList")
  productList.innerHTML = ''

  
  loader.classList.remove('d-none');
  productList.classList.add('d-none');
  

  allProducts.forEach(element => {
    //string decode for special charachter control
    const name = decodeURIComponent(element.name)
    const description = decodeURIComponent(element.description)
    const brand = decodeURIComponent(element.brand)
    const imageUrl = decodeURIComponent(element.imageUrl)
    const price = decodeURIComponent(element.price)
    const id = decodeURIComponent(element._id)

    const row = `
      <div class="card mb-3">
        <img src="${imageUrl}" class="card-img-top" alt="...">
        <div class="card-body">
          <h4 class="card-title">${name}</h4>
          <h5 class="card-title">${brand}</h5>
          <p class="card-text">${description}</p>
          <p class="card-text">${price} €</p>
          <a href="./product.html?id=${id}" class="btn btn-primary">Product page</a>
        </div>
      </div>
    `
    productList.innerHTML += row
  });
  setTimeout( () => {
    loader.classList.add('d-none');
    productList.classList.remove('d-none');
  }, 250)
}

//Call Fetch function and print to DOM
fetchProducts()
