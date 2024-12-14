import fs from "fs"
//let rutaArchivo = "../data/Products.json"

export  class ProductManager {

    static ganancia = 0.15
    #path = ""

    constructor(rutaArchivo) {
        this.#path = rutaArchivo
    }


    async addProduct(title, description, price = 0, thumbnail, code, stock = 0) {

        //validaciones 
        if (!title || !price || !stock || !description || !code) {
            console.log(`por favor complete todos los campos requeridos 
                title
                price
                stock  
                description
                code
                `)
            return
        }

        let products = await this.getProducts()
        //generar id

        let id = 1
        if (products.length > 0) {
            id=Math.max(...products.map(d=>d.id))+1
        }


        let nuevoProducto = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }

        let existe = products.filter(el => {
            return el.code === nuevoProducto.code

        })

        if (existe.length > 0) {
            console.log(`los productos no pueden tener el mismo valor para "code",
                el producto ${nuevoProducto.title} debe tener distinto "code"
                `)
                return
        }
        

            products.push(nuevoProducto)
            console.log(` el producto ${nuevoProducto.title} fue agregado con exito`)
            
            await fs.promises.writeFile(this.#path,JSON.stringify(products,null,4))
    }

    async getProducts() {

            if (fs.existsSync(this.#path)) {
                let data = await fs.promises.readFile(this.#path,{encoding:"utf-8"});
                return JSON.parse(data);
            } else {
                console.log("prodcutos no encontrados, devolviendo array vacío.");
                return [];
    }
}

    async getListProducts() {
        let products = await this.getProducts();
        if (products.length === 0) {
            return "No hay productos disponibles.";
        }
    
        let lista = `Lista de productos:\n`;
        products.forEach(p => {
            lista += `
    Producto: ${p.title} | Modelo: ${p.description} | Precio: $${p.price + (p.price * ProductManager.ganancia)} | Stock: ${p.stock}`;
        });
    
        return lista;
    }
    
    async getProductsById(num) {
        let products = await this.getProducts();
        let productFound = products.find(el => el.id === num);
    
        if (!productFound) {
            return `No existe un producto con el ID: ${num}`;
        }
    
        return productFound;
    }

    async updateProductList(products) {

        try {
            await fs.writeFile(this.#path, JSON.stringify(products, null, 4), {encoding:"utf-8"});
        } catch (error) {
            console.error("Error al guardar el archivo:", error);
            throw new Error("Error al actualizar la lista de productos.");
        }
    }
    

}

/*
const consultas = async () => {

    const productManager = new ProductManager(rutaArchivo)

    let products = await productManager.getListProducts()

//agregando productos
await productManager.addProduct("samsung", "s20 plus", 150, "", "a32r", 10)
await productManager.addProduct("iphone", "x", 160, "", "a41nr", 14)
await productManager.addProduct("xiaomi", "mia3", 190, "", "a35r", 11)
await productManager.addProduct("motorola", "m5", 120, "", "a37r", 18)
await productManager.addProduct("alcatel", "s", 100, "", "a39r", 19)

console.log(products);

}

consultas()
*/