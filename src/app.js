import express from "express"
import { ProductManager} from "./dao/ProductManager.js"
const PORT=3000
const app=express()
let rutaArchivo="./data/Products.json"
const productManager = new ProductManager(rutaArchivo)

app.get("/",(req,res)=>{
    res.send(`Bienvenido al server`)
})

app.get("/Products", async (req, res) => {
    try {
        let productos = await productManager.getProducts();
        res.send( productos);
    } catch (error) {
        res.send(`${error} productos no encontrados`);
    }
});



app.get("*",(req,res)=>{
    res.send(`Error 404 | page not found `)
})


app.listen(PORT,()=>{
    console.log(`server online en puerto ${PORT}`)
})