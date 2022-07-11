import express from 'express';
import { tasksController } from './tasks.controller';

export const router = express.Router();

router
  .route('/')
  .get(tasksController.getAll)
  .post(tasksController.postOne)
  .delete(tasksController.deleteAll);
router.route('/:id').patch(tasksController.patchById).delete(tasksController.deleteById);
router.route('/status/:id').patch(tasksController.patchStatusById);
router.route('/comments/:id').patch(tasksController.patchComment);
