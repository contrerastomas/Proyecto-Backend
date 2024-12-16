import { error } from "console";
import fs from "fs"


export class ProductManager {

    static ganancia = 0.15
    static #path = ""

    static setPath(rutaArchivo = "") {
        this.#path = rutaArchivo
    }
    /*
        constructor(rutaArchivo) {
            this.#path = rutaArchivo
        }
    */

    static async getProducts() {
        try {
            if (fs.existsSync(this.#path)) {
                const data = await fs.promises.readFile(this.#path, { encoding: "utf-8" });
                return JSON.parse(data);
            } else {
                console.log(`Path configurado: ${this.#path}`);
                console.log(`Productos no encontrados, devolviendo array vacío.`);
                return [];
            }
        } catch (error) {
            console.error(`Error al leer los productos desde ${this.#path}:`, error);
            return [];
        }
    }


    static async getProductsById(id) {
        let products = await this.getProducts()
        let product = products.find(p => p.id === id)
        return product
    }

    static async addProduct(product = {}) {

        let products = await this.getProducts()
        let id = 1
        if (products.length > 0) {
            id = Math.max(...products.map(d => d.id)) + 1
        }


        let newProduct = {
            id,
            ...product
        }

        products.push(newProduct)
        console.log(` el producto ${newProduct} fue agregado con exito`)

        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 4))
        return newProduct
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

    static async getProductsByTittle(title) {
        let products = await this.getProducts();
        let productFound = products.find(el => el.id === title);

        if (!productFound) {
            return `No existe un producto con el ID: ${title}`;
        }

        return productFound;
    }

    static async changeProducts(id,changes={}){
        let products = await this.getProducts()
        let productIndex=products.findIndex(p=>p.id===id)
        if(productIndex===-1){
            throw new Error(`Producto con id:${id} no encontrado`)
        }
        products[productIndex]={
            ...products[productIndex],
            ...changes,
            id
        }


        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 4))
        return products[productIndex]


    }

    static async updateProductList(products) {

        try {
            await fs.writeFile(this.#path, JSON.stringify(products, null, 4), { encoding: "utf-8" });
        } catch (error) {
            console.error("Error al guardar el archivo:", error);
            throw new Error("Error al actualizar la lista de productos.");
        }
    }

    static async deleteProduct(id) {
        const products = await this.getProducts(); 
        const productIndex = products.findIndex(product => product.id === id);
        
        if (productIndex === -1) {
            throw new Error(`Producto con id: ${id} no encontrado.`);
        }
        products.splice(productIndex, 1);

        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 4));
        
        return products;
    }
}