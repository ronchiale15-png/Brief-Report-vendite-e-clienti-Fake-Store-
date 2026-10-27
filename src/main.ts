

type typeProduct = {
    id: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    rating: {
        rate: number,
        count: number
    }
}

type typeProducts = typeProduct[]


type typeCart = {
    id: number,
    userId: number,
    date: string,
    products: [
        {
            "productId": number,
            "quantity": number
        }
    ]
}

type typeCarts = typeCart[]


type typeUser = {
    "address": {
        "geolocation": {
            "lat": string,
            "long": string
        },
        "city": string,
        "street": string,
        "number": number,
        "zipcode": string
    },
    "id": number,
    "email": string,
    "username": string,
    "password": string,
    "name": {
        "firstname": string,
        "lastname": string
    },
    "phone": string,
}
type typeUsers = typeUser[]

const getProducts = async (): Promise<typeProducts> => {
    const response = await fetch('https://fakestoreapi.com/products')
    if (!response.ok) {
    throw new Error(`Errore ${response.status} su /products`)
}
    const data = await response.json()
    return data
}

const getCarts = async (): Promise<typeCarts> => {
    const response = await fetch('https://fakestoreapi.com/carts')
    if (!response.ok) {
    throw new Error(`Errore ${response.status} su /carts`)
}
    const data = await response.json()
    return data
}

const getUsers = async (): Promise<typeUsers> => {
    const response = await fetch('https://fakestoreapi.com/users')
    if (!response.ok) {
    throw new Error(`Errore ${response.status} su /users`)
}
    const data = await response.json()
    return data
}

const main = async (): Promise<void> => {
    const [products, carts, users] = await Promise.all([
        getProducts(),
        getCarts(),
        getUsers(),
    ])

    console.log(
        `Prodotti: ${products.length}, carrelli: ${carts.length}, utenti: ${users.length}`
    )
}

main().catch((error) => {
    console.error('Errore:', error instanceof Error ? error.message : error)
})

