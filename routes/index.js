const express = require("express");
const ctrl = require("../route-ctrl");

const router = express.Router();

router.get("/products", ctrl.getAllProducts);
router.get("/products/:id", ctrl.getProductById);


module.exports = router;