import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { TaskType } from './type';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 1337;

app.use(
  cors({
    origin: 'http://localhost:5500',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowCrossDomain = (_: Request, res: Response, next: Function) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};
app.use(allowCrossDomain);

// Get All Tasks
app.get('/', async (_: Request, res: Response): Promise<Response> => {
  const tasks: TaskType[] = JSON.parse(readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
  return res.status(200).json({
    tasks,
  });
});

// Post Task
app.post('/', async (req: Request, res: Response): Promise<Response> => {
  const tasks: TaskType[] = JSON.parse(readFileSync(path.join(__dirname, 'db.json'), 'utf8'));

  const { tags, description, comments, priority, status, date, dueDate } = req.body;

  if (!tags || !description || !comments || !priority || !status || !date || !dueDate) {
    return res.status(400).json({
      error: 'Missing required fields',
    });
  }

  const newTask: TaskType = {
    id: tasks.length + 1,
    tags,
    description,
    comments,
    priority,
    status,
    date,
    dueDate,
  };
  tasks.push(newTask);

  writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(tasks));

  return res.status(200).json({
    task: newTask,
  });
});

// Patch Task by Id
app.patch('/:id', async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Missing id: number',
    });
  }

  const tasks: TaskType[] = JSON.parse(readFileSync(path.join(__dirname, 'db.json'), 'utf8'));

  const exists: TaskType | undefined = tasks.find((task: any) => task.id === Number(id));
  if (!exists) {
    return res.status(404).json({
      error: 'Task not found',
    });
  }

  const { tags, description, comments, priority, status, date, dueDate } = req.body;
  const updatedTask: TaskType = {
    ...exists,
    tags,
    description,
    comments,
    priority,
    status,
    date,
    dueDate,
  };

  tasks.splice(tasks.indexOf(exists), 1, updatedTask);

  writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(tasks));
  return res.status(200).json({
    task: updatedTask,
  });
});

// Patch Status of Task by Id
app.patch('/status/:id', async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Missing id: number',
    });
  }

  const tasks: TaskType[] = JSON.parse(readFileSync(path.join(__dirname, 'db.json'), 'utf8'));

  const exists: TaskType | undefined = tasks.find((task: any) => task.id === Number(id));
  if (!exists) {
    return res.status(400).json({
      error: 'Task not found',
    });
  }

  const { status } = req.body;
  if (!status || typeof status !== 'string') {
    return res.status(400).json({
      error: 'Status must be a string',
    });
  }

  if (!['backlog', 'work-in-progress', 'in-review', 'finished'].includes(status)) {
    return res.status(400).json({
      error: 'Status must be one of the following: backlog, work-in-progress, in-review, finished',
    });
  }

  exists.status = status as 'backlog' | 'work-in-progress' | 'in-review' | 'finished';
  tasks.splice(tasks.indexOf(exists), 1, exists);

  writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(tasks));
  return res.status(200).json({
    task: exists,
  });
});

// Delete Task
app.delete('/:id', async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Missing id: number',
    });
  }

  const tasks = JSON.parse(readFileSync(path.join(__dirname, 'db.json'), 'utf8'));

  const exists: TaskType | undefined = tasks.find((task: any) => task.id === Number(id));
  if (!exists) {
    return res.status(404).json({
      error: 'Task not found',
    });
  }

  tasks.splice(tasks.indexOf(exists), 1);
  writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(tasks));
  return res.status(200).json({
    message: 'Task deleted',
  });
});

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: any) {
  console.error(`Error occurred: ${error.message}`);
}
