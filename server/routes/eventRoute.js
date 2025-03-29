import express from 'express'
import { createEvent, deleteEvent, getEventByID, getEvents, toggleEvent, updateEvent } from '../controller/Events/EventController.js'
import { authMiddleware } from '../middleware/auth.js'
import { deleteUnavailbleSlot, getUnavailableSlots, saveUnavailableSlots } from '../controller/UnavailableSlots/unavailableController.js'


const router = express.Router()

router.post("/create-event",authMiddleware,createEvent)
router.get("/get-all-events",authMiddleware,getEvents)
router.get("/get-event/:id",authMiddleware,getEventByID)
router.put("/update-event/:id",authMiddleware,updateEvent)
router.delete("/delete-event/:id",authMiddleware,deleteEvent)
router.put("/toggle-event/:id/toggle",authMiddleware,toggleEvent)


router.post("/unavailable-slots",authMiddleware,saveUnavailableSlots)
router.get("/unavailable-slots/:userId",authMiddleware,getUnavailableSlots)
router.delete("/unavailable-slots/:userId/:day/:slotId",authMiddleware,deleteUnavailbleSlot)






export default router