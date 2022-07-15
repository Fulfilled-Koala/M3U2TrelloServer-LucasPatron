import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {TaskType} from '../type';

const dbPath = path.join(__dirname, '../', 'db.json');

function _getTasks(): TaskType[] {
  return JSON.parse(readFileSync(dbPath, 'utf8'));
}

function _writeTasks(tasks: TaskType[]): void {
  writeFileSync(path.join(dbPath), JSON.stringify(tasks));
}

function getAll(): TaskType[] {
  return _getTasks();
}

function postOne(tasks: Omit<TaskType, 'id' | 'comments'>): TaskType {
  const allTasks = _getTasks();
  const newTask: TaskType = {
    id: allTasks.length + 1,
    ...tasks,
    comments: [],
  };
  _writeTasks([...allTasks, newTask]);
  return newTask;
}

function patchById(id: number, tasks: Partial<TaskType>): [TaskType | null, string | null] {
  const allTasks = _getTasks();

  const exists: TaskType | undefined = allTasks.find((task: any) => task.id === Number(id));
  if (!exists) return [null, 'Task not found'];

  const updatedTask: TaskType = {
    ...exists,
    ...tasks,
  };

  allTasks.splice(allTasks.indexOf(exists), 1, updatedTask);
  _writeTasks(allTasks);

  return [updatedTask, null];
}

function deleteById(id: number): [string | null, string | null] {
  const allTasks = _getTasks();

  const exists: TaskType | undefined = allTasks.find((task: any) => task.id === Number(id));
  if (!exists) return [null, 'Task not found'];

  allTasks.splice(allTasks.indexOf(exists), 1);
  _writeTasks(allTasks);

  return ['Task was successfully deleted', null];
}

function deleteAll() {
  _writeTasks([]);
  return ['All tasks were successfully deleted', null];
}

function patchComment(
  id: number,
  comment: Partial<TaskType['comments'][0]>,
): [TaskType | null, string | null] {
  const allTasks = _getTasks();

  const exists: TaskType | undefined = allTasks.find((task: TaskType) => task.id === id);
  if (!exists) return [null, 'Task not found'];

  const updatedTask: TaskType = {
    ...exists,
    comments: [...exists.comments, comment as TaskType['comments'][0]],
  };

  allTasks.splice(allTasks.indexOf(exists), 1, updatedTask);
  _writeTasks(allTasks);

  return [updatedTask, null];
}

export const tasksService = {
  getAll,
  postOne,
  patchById,
  deleteById,
  deleteAll,
  patchComment,
};
