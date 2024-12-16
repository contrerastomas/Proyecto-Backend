import { Router} from "express"
import { ProductManager } from "../dao/ProductManager.js"


export const router=Router()


router.get("/",(req,res)=>{
    
    res.setHeader('content-type','application/json')
    return res.status(200).json({payload:`Get a productos`})
})

router.get("/:cid/product/:pid",(req,res)=>{
    
    res.setHeader('content-type','application/json')
    return res.status(200).json({payload:`Get a productos ${req.params.id}`})
})

router.post("/:id",(req,res)=>{
    
    res.setHeader('content-type','application/json')
    return res.status(200).json({payload:`post a productos`})
})
