const res = require('express/lib/response');
const { all } = require('../routes');



/*
NOTES:

This API fetches data only from a single API endpoint. Therefore cannot pull product details form more than one API
- To fetch products from multiple API endpoints: *Abstarcting components*
    - create an object (or array) containing all the products APIs
    - map through every endpoint
        - All products must have a well defined Schema for consumers to access

- variants_data {
    - returns variant data for each products
}

- inventory {
    - maps every product and returns specific varaint data
}

- products {
    - pre defined schema for products
    - returns all products following this schema 
}

- 3 functions 
    - getAllProducts
    - getProductById
    - getInventory
*/


const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const variants_data = (v) => {
    const av = v.inventory_quantity ? true : false;
    const ret_value = v.map(i => {
        return {
            "id": i.id,
            "title": i.title,
            "sku": i.sku,
            "available": av,
            "inventory_quantity": i.inventory_quantity ? i.inventory_quantity : 0,
            "weight": {
              "value": i.weight,
              "unit": i.weight_unit
            }
          }
    }) 

    return ret_value
}


const inventory = (p, arr) => {
    const _id = p.id
    const v = p.variants


    v.map(i => {
        return {
            "productId": _id,
            "variantId": i.id,
            "stock": i.nventory_quantity ? i.nventory_quantity : 0,
        }
    }).forEach(i => arr.push(i))
} 


const images_data = (v) => {
    const all_images = v.map(vari => {
        const vari_id = vari.id
        const im = vari.images.map(im => {
            return {
                "src": im.src,
                "variantId": vari_id
            }
        })
        return im
    })

    return all_images
}


const products = (p) => {

    return {
        "code": "string",
        "title": p.title,
        "vendor": p.vendor,
        "bodyHtml": p.body_html,
        "variants": variants_data(p.variants),
        "images": images_data(p.variants)
      }
}




const getAllProducts = async (req, res) => {
    const metaURL = `https://my-json-server.typicode.com/convictional/engineering-interview-api/products`
    const fetch_meta = await fetch(metaURL)
    const fetch_res = await fetch_meta.json()

    if ( fetch_res.length !== 0) {
        return res.status(200).json(fetch_res.map(f => products(f)))
    }
    return res.status(404).json({
        "message": "could not fetch all products"
    })

}





const getProductById = async (req, res) => {
    const _id = req.params.id
    const metaURL = `https://my-json-server.typicode.com/convictional/engineering-interview-api/products/${_id}`
    const fetch_meta = await fetch(metaURL)
    const fetch_res = [await fetch_meta.json()]

    if (Object.keys(fetch_res[0]).length !== 0) {
        return res.status(200).json(fetch_res.map(f => products(f)))
    } 
    if (_id.length !== 10) {
        return res.status(400).json({
            "message": "Invalid Id supplied"
        })
    }
    return res.status(404).json({
        "message": "Product not found"
    })
}



const getInventory = async (req, res) => {
    const metaURL = `https://my-json-server.typicode.com/convictional/engineering-interview-api/products`
    const fetch_meta = await fetch(metaURL)
    const fetch_res = await fetch_meta.json()

    let retArr = []
    fetch_res.map(i => inventory(i, retArr))

    return res.status(200).json(retArr)
}



module.exports = {
    getAllProducts,
    getProductById,
    getInventory,
}