import express from "express"
import { ProductManager } from "./dao/ProductManager.js"
const PORT = 8080
const app = express()
let rutaArchivo = "./data/Products.json"
const productManager = new ProductManager(rutaArchivo)
import {router as productsRouter } from "./routes/productsRouter.js"
import { router as cartsRouter} from "./routes/cartsRouter.js"

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/products",productsRouter)
app.use("/api/carts",cartsRouter)

app.get("/", (req, res) => {
    res.send(`Bienvenido al server`)
})

app.get("*", (req, res) => {
    res.status(404).send(`Error 404 | page not found `)
})

app.listen(PORT, () => {
    console.log(`server online en puerto ${PORT}`)
})