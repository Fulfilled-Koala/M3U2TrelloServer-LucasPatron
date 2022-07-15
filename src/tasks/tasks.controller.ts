import { Request, Response } from 'express';
import { tasksService } from './tasks.service';

function _validatePriority(priority: string): boolean {
  return priority === 'low' || priority === 'medium' || priority === 'high';
}

function _validateStatus(status: string): boolean {
  return (
    status === 'backlog' ||
    status === 'work-in-progress' ||
    status === 'in-review' ||
    status === 'finished'
  );
}

async function getAll(req: Request, res: Response): Promise<Response> {
  return res.status(200).json({
    tasks: tasksService.getAll(),
  });
}

async function postOne(req: Request, res: Response): Promise<Response> {
  const { tag, description, priority, status, date, dueDate } = req.body;

  if (!tag || !description || !priority || !status || !date || !dueDate) {
    return res.status(400).json({
      error: 'Missing required fields',
    });
  }

  if (
    typeof tag !== 'string' ||
    typeof description !== 'string' ||
    typeof priority !== 'string' ||
    typeof status !== 'string' ||
    typeof date !== 'string' ||
    typeof dueDate !== 'string'
  ) {
    return res.status(400).json({
      error: 'Invalid types',
    });
  }

  if (!_validatePriority(priority)) {
    return res.status(400).json({
      error: 'Invalid priority',
    });
  }

  if (!_validateStatus(status)) {
    return res.status(400).json({
      error: 'Invalid status',
    });
  }

  const dateObj = new Date(date);
  const dueDateObj = new Date(dueDate);
  if (isNaN(dateObj.getTime()) || isNaN(dueDateObj.getTime())) {
    return res.status(400).json({
      error: 'Invalid date',
    });
  }

  return res.status(200).json({
    task: tasksService.postOne({
      tag,
      description,
      priority: priority as 'low' | 'medium' | 'high',
      status: status as 'backlog' | 'work-in-progress' | 'in-review' | 'finished',
      date,
      dueDate,
    }),
  });
}

async function patchById(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Invalid id',
    });
  }

  const { tag, description, comments, priority, status, dueDate } = req.body;
  console.log(req.body);

  const [task, error] = tasksService.patchById(Number(id), {
    tag,
    description,
    comments,
    priority,
    status,
    dueDate,
  });

  if (error) {
    return res.status(400).json({
      error,
    });
  }

  return res.status(200).json({
    task,
  });
}

async function patchStatusById(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Invalid id',
    });
  }

  const { status } = req.body;
  if (!status || typeof status !== 'string' || !_validateStatus(status)) {
    return res.status(400).json({
      error: 'Invalid status',
    });
  }

  const [task, error] = tasksService.patchById(Number(id), {
    status: status as 'backlog' | 'work-in-progress' | 'in-review' | 'finished',
  });

  if (error) {
    return res.status(400).json({
      error,
    });
  }

  return res.status(200).json({
    task,
  });
}

async function deleteById(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Missing id: number',
    });
  }

  const [success, error] = tasksService.deleteById(Number(id));

  if (error) {
    return res.status(400).json({
      error,
    });
  }

  return res.status(200).json({
    message: success,
  });
}

async function deleteAll(req: Request, res: Response): Promise<Response> {
  const [success] = tasksService.deleteAll();
  return res.status(200).json({
    message: success,
  });
}

async function patchComment(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Invalid id',
    });
  }

  const { comment } = req.body;
  if (
    !comment ||
    !comment.username ||
    !comment.comment ||
    typeof comment.username !== 'string' ||
    typeof comment.comment !== 'string' ||
    comment.comment.length > 150 ||
    comment.comment.length < 1 ||
    comment.username.length < 1
  ) {
    return res.status(400).json({
      error: 'Invalid comment',
    });
  }

  const updatedComment = {
    username: comment.username,
    comment: comment.comment,
    publishedAt: new Date().toISOString(),
  };
  const [task, error] = tasksService.patchComment(Number(id), updatedComment);

  if (error) {
    return res.status(400).json({
      error,
    });
  }

  return res.status(200).json({
    task,
  });
}

export const tasksController = {
  getAll,
  postOne,
  patchById,
  patchStatusById,
  deleteById,
  deleteAll,
  patchComment,
};
