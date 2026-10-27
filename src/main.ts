

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

type typeProductRanking = {
    rank: number
    product_id: number
    title: string
    category: string
    unit_price: number
    units_sold: number
    revenue: number
}

type typeProductRankings = typeProductRanking[]

type typeCustomerRanking = {
    rank: number
    user_id: number
    username: string | null
    full_name: string | null
    email: string | null
    orders_count: number
    total_items: number
    total_spent: number
}

type typeCustomerRankings = typeCustomerRanking[]

const getProducts = async (): Promise<typeProducts> => {
    const response = await fetch('https://fakestoreapi.com/products')
    if (!response.ok) {
        throw new Error(`Errore ${response.status} su /products`)
    }
    const data = await response.json()
    return data
}

const getTopCustomers = (
    carts: typeCarts,
    products: typeProducts,
    users: typeUsers
): typeCustomerRanking[] => {
    const list: typeCustomerRanking[] = []

    for (const cart of carts) {
        let customer: typeCustomerRanking | undefined = undefined
        for (const item of list) {
            if (item.user_id === cart.userId) {
                customer = item
            }
        }

        if (customer === undefined) {
            let username: string | null = null
            let fullName: string | null = null
            let email: string | null = null

            for (const user of users) {
                if (user.id === cart.userId) {
                    username = user.username
                    fullName = user.name.firstname + ' ' + user.name.lastname
                    email = user.email
                }
            }

            customer = {
                rank: 0,
                user_id: cart.userId,
                username: username,
                full_name: fullName,
                email: email,
                orders_count: 0,
                total_items: 0,
                total_spent: 0,
            }
            list.push(customer)
        }

        customer.orders_count = customer.orders_count + 1

        for (const line of cart.products) {
            for (const product of products) {
                if (product.id === line.productId) {
                    customer.total_items = customer.total_items + line.quantity
                    customer.total_spent = customer.total_spent + product.price * line.quantity
                }
            }
        }
    }

    for (const item of list) {
        item.total_spent = Math.round(item.total_spent * 100) / 100
    }

    list.sort((a, b) => {
        if (a.total_spent !== b.total_spent) {
            return b.total_spent - a.total_spent
        }
        if (a.orders_count !== b.orders_count) {
            return b.orders_count - a.orders_count
        }
        return a.user_id - b.user_id
    })

    const top3 = list.slice(0, 3)

    for (let i = 0; i < top3.length; i++) {
        top3[i].rank = i + 1
    }

    return top3
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
    const productsReport = {
        report: 'top_products',
        generated_at: new Date().toISOString(),
        anchor_date: anchor.toISOString(),
        periods: {
            all_time: {
                range: null,
                ranking: getTopProducts(carts, products),
            },
            last_month: {
                range: {
                    start: start.toISOString(),
                    end: anchor.toISOString(),
                },
                ranking: getTopProducts(lastMonthCarts, products),
            },
        },
    }

    console.log(JSON.stringify(productsReport, null, 2))

    const customersReport = {
    report: 'top_customers',
    generated_at: new Date().toISOString(),
    anchor_date: anchor.toISOString(),
    periods: {
        all_time: {
            range: null,
            ranking: getTopCustomers(carts, products, users),
        },
        last_month: {
            range: {
                start: start.toISOString(),
                end: anchor.toISOString(),
            },
            ranking: getTopCustomers(lastMonthCarts, products, users),
        },
    },
}

console.log(JSON.stringify(productsReport, null, 2))
console.log(JSON.stringify(customersReport, null, 2))
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


const getTopProducts = (carts: typeCarts, products: typeProducts): typeProductRanking[] => {
    const list: typeProductRanking[] = []

    for (const product of products) {
        let units = 0

        for (const cart of carts) {
            for (const line of cart.products) {
                if (line.productId === product.id) {
                    units = units + line.quantity
                }
            }
        }

        if (units > 0) {
            list.push({
                rank: 0,
                product_id: product.id,
                title: product.title,
                category: product.category,
                unit_price: product.price,
                units_sold: units,
                revenue: Math.round(product.price * units * 100) / 100,
            })
        }
    }

    list.sort((a, b) => {
        if (a.units_sold !== b.units_sold) {
            return b.units_sold - a.units_sold
        }
        if (a.revenue !== b.revenue) {
            return b.revenue - a.revenue
        }
        return a.product_id - b.product_id
    })

    const top3 = list.slice(0, 3)

    for (let i = 0; i < top3.length; i++) {
        top3[i].rank = i + 1
    }

    return top3
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


