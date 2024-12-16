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
app.use("/products",productsRouter)
app.use("/carts",cartsRouter)

app.get("/", (req, res) => {
    res.send(`Bienvenido al server`)
})
/*
app.get("/products", async (req, res) => {
    res.setHeader('content-type', 'application/json')
    try {
        let products = await productManager.getListProducts();
        res.status(200).json(products);
    } catch (error) {
        res.send(`${error} productos no encontrados`);
    }
});

app.get("/products/:pid", async (req, res) => {
    let { id } = req.params
    id = Number(id)
    if (isNaN(id)) {
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `el id debe ser numerico` })
    }
    let products = await productManager.getListProducts()
    if (id < 1 || id > products.length) {
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `el id debe estar entre 0 y ${products.length}` })
    }
    let product = products.find(p => p.id === id)


    if (!product) {
        return res.status(400).send({ Error: `no existen productos con id ${id}` })
    }
    product= product[id - 1]

    res.status(200).send(product)


})

app.post("/products", async (req, res) => {
    let {product}=req.body
    if(!product){

        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `la propiedad producto es requerido` })
    }

    let products = await productManager.getListProducts();

    products.push(product)

    res.setHeader('content-type','application/json')
    return res.status(201).json({payload:`se agrego el producto ${product}`})

});

app.put("/products/:pid", async (req, res) => {
    try{
    let products = await productManager.getListProducts()

    if(products.length===0){
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `no hay productos para modificar` })
    }

    let { id } = req.params
    id = Number(id)

    if (isNaN(id)) {
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `el id debe ser numerico` })
    }

    if (id < 1 || id > products.length) {
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `el id debe estar entre 0 y ${products.length}` })
    }
    let product = products.find(p => p.id === id)


    
    if (!product) {
        return res.status(400).send({ Error: `no existen productos con id ${id}` })
    }
    product= product[id - 1]


    let {newProduct}=req.body

    if(!newProduct|| typeof newProduct!== "object"){
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `la propiedad producto es requerida y debe ser del tipo objeto` })
    }

    
        products[id] = { ...products[id], ...newProduct };

        await productManager.updateProductList(products);

        return res.status(200).json({ message: `Producto con ID ${id} actualizado correctamente.`,product: products[id] });

    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return res.status(500).json({ 
            success: false, 
            error: "Error interno del servidor. Intente nuevamente más tarde." 
        });
    }

})

app.delete("/products/:pid", async (req, res) => {
    try{
    let products = await productManager.getListProducts()

    if(products.length===0){
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `no hay productos para eliminar` })
    }

    let { id } = req.params
    id = Number(id)

    if (isNaN(id)) {
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `el id debe ser numerico` })
    }

    if (id < 1 || id > products.length) {
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `el id debe estar entre 0 y ${products.length}` })
    }
    let product = products.find(p => p.id === id)


    
    if (!product) {
        return res.status(400).send({ Error: `no existen productos con id ${id}` })
    }

    products = products.filter(p => p.id !== id);
    await productManager.updateProductList(products);
    res.setHeader('content-type','application/json')
    return res.status(200).json({payload:`producto eliminado con exito  ,${product}`})

    } catch (error) {
        console.error("Error al eliminar producto:", error);
        return res.status(500).json({ 
            success: false, 
            error: "Error interno del servidor. Intente nuevamente más tarde." 
        });
    }

})
*/

app.get("*", (req, res) => {
    res.status(404).send(`Error 404 | page not found `)
})


app.listen(PORT, () => {
    console.log(`server online en puerto ${PORT}`)
})