const res = require('express/lib/response');
const { all } = require('../routes');


const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const getAllProducts = async (req, res) => {
    const metaURL = `https://my-json-server.typicode.com/convictional/engineering-interview-api/products`
    const fetch_meta = await fetch(metaURL)
    const fetch_res = await fetch_meta.json()

    const ret = (p) => {
        const variants_data = (v) => {
            const av = v.inventory_quantity ? true : false;
            const ret_value = v.map(i => {
                return {
                    "id": i.id,
                    "title": i.title,
                    "sku": i.sku,
                    "available": av,
                    "inventory_quantity": i.nventory_quantity ? i.nventory_quantity : 0,
                    "weight": {
                      "value": i.weight,
                      "unit": i.weight_unit
                    }
                  }
            }) 

            return ret_value
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

        return {
            "code": "string",
            "title": p.title,
            "vendor": p.vendor,
            "bodyHtml": p.body_html,
            "variants": variants_data(p.variants),
            "images": images_data(p.variants)
          }
    }

    if ( Object.keys(fetch_res).length !== 0) {
        return res.status(200).json(fetch_res.map(f => ret(f)))
    }
    return res.status(404).json({
        "message": "could not fetch all products"
    })

}





const getProductById = (req, res) => {
    return null
}




module.exports = {
    getAllProducts,
    getProductById,
}