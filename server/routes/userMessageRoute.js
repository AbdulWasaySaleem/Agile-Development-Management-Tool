import express from 'express'
import { requireSignIn } from '../middleware/authmiddleware.js'
import { getCurrentChat, getUserBySearch, getUserForSideBar } from '../controller/userMessageController.js'

const router = express.Router()

//search
router.get('/search', requireSignIn, getUserBySearch)

//allUsers
router.get("/", requireSignIn, getUserForSideBar)

//currentChat
router.get('/currentchat', requireSignIn, getCurrentChat)


export default router