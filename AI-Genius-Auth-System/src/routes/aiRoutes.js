const express = require("express");

const protect = require("../middleware/protect");
const restrictTo = require("../middleware/restrictTo");

const {
  freeModel,
  premiumModel,
  purgeCache,
} = require("../controllers/aiController");

const router = express.Router();

/*
  Accessible by all logged-in users:
  Admin, Premium_User, Free_User
*/
router.get(
  "/free-model",
  protect,
  freeModel
);

/*
  Accessible only by:
  Admin, Premium_User
*/
router.post(
  "/premium-model",
  protect,
  restrictTo("Admin", "Premium_User"),
  premiumModel
);

/*
  Accessible only by:
  Admin
*/
router.delete(
  "/purge-cache",
  protect,
  restrictTo("Admin"),
  purgeCache
);

module.exports = router;