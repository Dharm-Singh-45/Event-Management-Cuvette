import express from 'express'
import { getBookingController, updateBookingStatus } from '../controller/Bookings/bookingController.js'
import { authMiddleware } from '../middleware/auth.js'



const router = express.Router()

router.get("/get-bookings",authMiddleware,getBookingController)
router.put("/update-booking-status",authMiddleware,updateBookingStatus)

export default router