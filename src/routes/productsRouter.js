import { Router } from "express"
import { ProductManager } from "../dao/ProductManager.js"
export const router = Router()
ProductManager.setPath("../data/Products.json")

router.get("/", async (req, res) => {
    res.setHeader('content-type', 'application/json')
    try {
        let products = await ProductManager.getProducts();
        let {limit} =req.query
        if (limit) {
            limit = Number(limit);
            if (isNaN(limit) || limit <= 0) {
                return res.status(400).json({ error: "El valor de 'limit' debe ser un número positivo válido." });
            }
            products = products.slice(0, limit);
        }

        res.status(200).json({ products });
    } catch (error) {
        console.log(error)
        res.setHeader("Content-type", "Application/json")
        return res.status(500).json({ Error: `internal server Error` })

    }
})

router.get("/:id", async (req, res) => {
    let { id } = req.params
    console.log(id)

    id = Number(id)
    if (isNaN(id)) {
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `el id debe ser numerico` })
    }
    try {
        let product = await ProductManager.getProductsById(id)
        if (!product) {
            return res.status(404).send({ Error: `no existen productos con id ${id}` })
        }
        res.setHeader('content-type', 'application/json')
return res.status(200).json({ product })
    
    } catch (error) {
        res.setHeader("Content-type", "Application/json")
        return res.status(500).json({ Error: `internal server Error` })
    }

})


router.post("/", async(req, res) => {

    let {title="",description="",code="",price,stock,category="",thumbnails="",status=true}=req.body

    if (!title || !description || !code || !price || !stock || !category ) {
        return res.status(400).json({ error: "Todos los campos son requeridos, a excepción de thumbnails" });
    }

    if (typeof price !== 'number' || isNaN(price) || price <= 0) {
        return res.status(400).json({ error: "El campo 'price' debe ser un número." });
    }

    if (typeof stock !== 'number' || isNaN(stock) || stock < 0) {
        return res.status(400).json({ error: "El campo 'stock' debe ser un número entero no negativo." });
    }
    try {

        let existe =await ProductManager.getProductsByTittle(title)
        if(existe){
            res.setHeader('content-type', 'application/json')
            return res.status(400).json({ payload: `ya existe el producto ${title}` })
        }


        let newProduct= await ProductManager.addProduct(title,description,code,price,stock,category,thumbnails,status)

    res.setHeader('content-type', 'application/json')
    return res.status(201).json({ payload: `Producto agregado con exito ${newProduct}` })


    } catch (error) {
        console.error(error)
        return res.status(500).json({ Error: `internal server Error` })
    }


})

router.put("/:id", async (req, res) => {
    
        let products = await ProductManager.getProducts()
    
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
        try{

        let {change}=req.body
    
        if(!change|| typeof change!== "object"){
            res.setHeader("Content-type", "Application/json")
            return res.status(400).json({ Error: `La modificacion debe de ser de tipo objeto` })
        }


            if(change.title){
                let products= await ProductManager.getProducts()
                let existe=products.find(p=>p.title.toLowerCase()===change.title.trim().toLowerCase() && p.id!=id)
                if(existe){
                    return res.status(400).json({ error: `ya existe un producto con el title:${change.title} en base de datos.Tiene id:${existe.id}.` });
                }
                let changeProduct=await ProductManager.changeProducts(id,change)
                }

            return res.status(200).json({payload: `se modifico el producto con id ${id} , ${changeProduct}` });
    
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            return res.status(500).json({ error: "Error interno del servidor. Intente nuevamente más tarde." });
        }
})

router.delete("/:id",async(req, res) => {
    try{
        let products = await ProductManager.getProducts()
    
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
        let deletedProduct = await ProductManager.deleteProduct(id);
        return res.status(200).json({payload:`El producto con id:${id} fue eliminado con exito.`})
    
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            return res.status(500).json({error: "Error interno del servidor. Intente nuevamente más tarde." });
        }
})
