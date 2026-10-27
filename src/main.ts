

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

const getAnchorDate = (carts: typeCarts): Date => {
    let latest = new Date(carts[0].date)

    for (const cart of carts) {
        const current = new Date(cart.date)
        if (current > latest) {
            latest = current
        }
    }

    return latest
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
    const anchor = getAnchorDate(carts)
const start = getLastMonthStart(anchor)
const lastMonthCarts = getLastMonthCarts(carts, start, anchor)

console.log('Data di ancoraggio:', anchor.toISOString())
console.log('Inizio ultimo mese:', start.toISOString())
console.log('Carrelli all time:', carts.length, '- ultimo mese:', lastMonthCarts.length)
}

type typeRange = {
    start: Date
    end: Date
}

const DAYS_IN_LAST_MONTH = 30
const MS_PER_DAY = 24 * 60 * 60 * 1000

main().catch((error) => {
    console.error('Errore:', error instanceof Error ? error.message : error)
})

const getLastMonthStart = (anchor: Date): Date => {
    const start = new Date(anchor)
    start.setUTCDate(start.getUTCDate() - 30)
    return start
}

const getLastMonthCarts = (carts: typeCarts, start: Date, end: Date): typeCarts => {
    const result: typeCarts = []

    for (const cart of carts) {
        const date = new Date(cart.date)
        if (date >= start && date <= end) {
            result.push(cart)
        }
    }

    return result
}

