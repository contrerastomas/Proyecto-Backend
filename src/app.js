import express from "express"
import { ProductManager} from "./dao/ProductManager.js"
const PORT=3000
const app=express()
let rutaArchivo="./data/Products.json"
const productManager = new ProductManager(rutaArchivo)

app.get("/",(req,res)=>{
    res.send(`Bienvenido al server`)
})

app.get("/products", async (req, res) => {
    try {
        let productos = await productManager.getListProducts();
        res.status(200).send( productos);
    } catch (error) {
        res.send(`${error} productos no encontrados`);
    }
});

app.get("/products/:pid",async (req,res)=>{
    let {id}=req.params
    id=Number(id)
    if(isNaN(id)){
        res.setHeader("Content-type","Application/json")
        return res.status(400).json({Error:`el id debe ser numerico`})
    }

    let productos=await productManager.getListProducts()

    let producto=productos.find(p=>p.id===id)

    if(!producto){
        return res.status(400).send({Error:`no existen productos con id ${id}`})
    }
    res.status(200).send(producto)


})




app.get("*",(req,res)=>{
    res.status(404).send(`Error 404 | page not found `)
})


app.listen(PORT,()=>{
    console.log(`server online en puerto ${PORT}`)
})