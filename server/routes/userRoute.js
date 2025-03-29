import express from 'express'
import { signUpController } from '../controller/signUpController.js'
import { loginController } from '../controller/loginController.js'
import { forgotPasswordController } from '../controller/forgotPasswordController.js'
import { resetpassword } from '../controller/resetPassword.js'
import { authMiddleware } from '../middleware/auth.js'
import updateUserProfile from '../controller/updateUserProfile.js'
import getSingleUser from '../controller/getSingleUser.js'
import { updateUserPreferences } from '../controller/updatePrefrence.js'

const router = express.Router()

router.post("/signup",signUpController)
router.post("/login",loginController)
router.post("/forgotpassword",forgotPasswordController)
router.post("/resetpassword/:token",resetpassword)
router.put('/update-profile',authMiddleware,updateUserProfile)
router.get('/user-profile',authMiddleware,getSingleUser)

router.put("/users/:id/preferences", updateUserPreferences);


export default router