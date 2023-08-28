//Const declaration HTML element and URL query
const apiUrl = "https://striveschool-api.herokuapp.com/api/product/"

const main = document.getElementById('main-product');

const params = new URLSearchParams(location.search)
const id = params.get("id")

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGVhNGJlMTUxNWY0MTAwMTQ2OTdhMmYiLCJpYXQiOjE2OTMwNzY0NTAsImV4cCI6MTY5NDI4NjA1MH0.GLbruDI2UUxg85xnQxE0hVnzqR1iBCI3sEdbzhqNYuw"

//Fetch GET function to get only one product
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

//Function to print only one product in the DOM
const printFormProduct = (product) => {
    //String decoding to prevent error for special carachter
    const name = decodeURIComponent(product.name)
    const description = decodeURIComponent(product.description)
    const brand = decodeURIComponent(product.brand)
    const imageUrl = decodeURIComponent(product.imageUrl)
    const price = decodeURIComponent(product.price)
    const id = decodeURIComponent(product._id)
    main.innerHTML = `
                    <div class="row g-0">
                        <div class="col-md-4">
                        <img src="${imageUrl}" class="img-fluid rounded-start" alt="...">
                        </div>
                        <div class="col-md-8 bg-white">
                            <div class="card-body card-body-detail">
                                <h1 class="card-title">${brand} - ${name}</h1>
                                <p class="card-text price-text"><small class="text-body-secondary"><span class="price-text">Price:</span> ${price} €</small></p>
                                <p class="description-title">Description</p>
                                <p class="card-text">${description}</p>
                            </div>
                        </div>
                    </div>
                    `
};

//Function call to fetch and print
fetchOneProduct(id)
