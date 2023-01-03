import express from "express"
import {
  getListings,
  addListing,
  getListing,
  updateListing,
  deleteListing,
} from "../controllers/listing.js"

const router = express.Router()

router.get("/listings", getListings)
router.get("/listing/:id", getListing)
router.post("/listing", addListing)

router.put("/listing/:id", updateListing)
router.delete("/listing/:id", deleteListing)

export default router
