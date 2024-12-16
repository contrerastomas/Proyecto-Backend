import { Router } from "express"
import { ProductManager } from "../dao/ProductManager.js"
import fs from "fs"
let cartsPath = "../data/Carts.json"
export const router = Router()


let readFile = async (path) => {
    try {
        await fs.promises.access(path, fs.constants.F_OK);

        const data = await fs.promises.readFile(path, { encoding: 'utf-8' });
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`El archivo ${path} no existe. Devolviendo un array vacío.`);
            return [];
        }
    }
}

router.post("/", async (req, res) => {


    try {
        let carts = await readFile(cartsPath)
        let newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
        let newCart = {
            id: newId,
            products: []
        }
        carts.push(newCart)
        await fs.promises.writeFile(cartsPath, JSON.stringify(carts, null, 4));

        res.setHeader('content-type', 'application/json')
        return res.status(201).json({ payload: `Carrito crado con exito ${newCart} ` })
    } catch (error) {
        console.error(`Error al crear un carrito en ${cartsPath}:`, error);
        return res.status(500).json({
            error: "Error interno del servidor. Intente nuevamente más tarde."
        });
    }

})

router.get("/:id", async (req, res) => {
    
    let {id}=req.params
    id = Number(id)
    if (isNaN(id)) {
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `el id debe ser numerico` })
    }
    try {
        let carts = await readFile(cartsPath)
        let existe= carts.find(c=>c.id===id)
        if (!existe) {
            return res.status(404).json({ Error: `No existe un carrito con el id ${id}` });
        }
        return res.status(200).json(existe);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return res.status(500).json({ Error: "Error interno del servidor." });
    }

})

router.post("/:cid/product/:pid", async (req, res) => {
    let {cid,product,pid}=req.params
    cid = Number(cid)
    if (isNaN(cid)) {
        res.setHeader("Content-type", "Application/json")
        return res.status(400).json({ Error: `el id debe ser numerico` })
    }
    try {
        let carts = await readFile(cartsPath)
        
        let existe= carts.find(c=>c.id===cid)

        if (!existe) {
            return res.status(404).json({ Error: `No existe un carrito con el id ${id}` });
        }

        let products=await ProductManager.getProducts()

        let dataProduct=products.findIndex(p=>p.id===pid)
        if(dataProduct===-1){
            return res.status(404).json({ Error: `No existe un producto con el id ${pid}` });
        }
        existe.product.push({
            product:dataProduct,
            quantity:1
        })

        return res.status(200).json(existe);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return res.status(500).json({ Error: "Error interno del servidor." });
    }

})
