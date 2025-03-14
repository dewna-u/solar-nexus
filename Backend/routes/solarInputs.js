const express = require("express");
const router = express.Router();
const solarInputController = require("../controllers/solarInputController.js");

router.post("/add", solarInputController.addSolarInput);
router.get("/", solarInputController.getAllSolarInputs);
router.delete("/:id", solarInputController.deleteSolarInput);
router.put("/:id", solarInputController.updateSolarInput);

module.exports = router;
