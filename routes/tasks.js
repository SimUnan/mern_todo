import express from 'express';

import {
	createTask,
	getAllTasks,
	getMyTask,
	updateTask,
	deleteTask,
} from '../controller/tasks.js';

const router = express.Router();

router.post('/', createTask);
router.get('/all', getAllTasks);
router.get('/myTask', getMyTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;
