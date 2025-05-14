const express = require("express");
const router = express.Router();
const auth    = require("../middleware/authMiddleware");
const solarInputController = require("../controllers/solarInputController.js");


router.use(auth); // Apply authentication middleware to all routes in this file
router.post("/add", solarInputController.addSolarInput);
router.get("/", solarInputController.getAllSolarInputs);
router.delete("/:id", solarInputController.deleteSolarInput);
router.put("/:id", solarInputController.updateSolarInput);


// admin endpoints
router.get("/all",         solarInputController.getAllSolarInputsAdmin);
router.put("/admin/:id",   solarInputController.updateSolarInputAdmin);
router.delete("/admin/:id",solarInputController.deleteSolarInputAdmin);

module.exports = router;
