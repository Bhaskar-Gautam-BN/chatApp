import express from 'express'
import accessChat from '../controllers/chatController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()

router.route('/').post(authMiddleware,accessChat)
// router.route('/').get( fetchChats)
// router.route('/group').put(createGroupChat)
// router.route('/rename').put(renameGroup)
// router.route('/remove').put(removeUser)
// router.route('/groupremove').put(removeGroup)




export default router