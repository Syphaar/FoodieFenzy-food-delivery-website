import express from 'express'
import multer from 'multer'
import { createItem,getItems, deleteItem } from '../controllers/itemController.js'

const itemRouter = express.Router()

// Store uploads in memory so item creation works on Vercel's serverless filesystem.
const storage = multer.memoryStorage();

const upload = multer({ storage });

itemRouter.post('/', upload.single('image'), createItem);
itemRouter.get('/', getItems);
itemRouter.delete('/:id', deleteItem)

export default itemRouter;
