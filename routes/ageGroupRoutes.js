const router = require("express").Router();

const controller = require("../controllers/ageGroupController");

router.get("/", controller.getAll);

router.post("/", controller.insert);

router.put("/:id", controller.update);

router.delete("/:id", controller.delete);

module.exports = router;
