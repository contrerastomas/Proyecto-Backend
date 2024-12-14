import { Router} from "express"

export const router=Router()


router.get("/",(req,res)=>{
    
    res.setHeader('content-type','application/json')
    return res.status(200).json({payload:`Get a productos`})
})

router.get("/:pid",(req,res)=>{
    
    res.setHeader('content-type','application/json')
    return res.status(200).json({payload:`Get a productos ${req.params.id}`})
})

router.post("/:id",(req,res)=>{
    
    res.setHeader('content-type','application/json')
    return res.status(200).json({payload:`post a productos`})
})

router.put("/:pid",(req,res)=>{
    
    res.setHeader('content-type','application/json')
    return res.status(200).json({payload:`put a producto ${req.params.id}`})
})

router.delete("/:pid",(req,res)=>{
    
    res.setHeader('content-type','application/json')
    return res.status(200).json({payload:`delete a producto ${req.params.id}`})
})
