const fs = require('fs');
const path = require('path');

const TASKS_FILE = 'tasks.json';
function readTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(TASKS_FILE, 'utf8');
  return JSON.parse(data);
}
function writeTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function addTask(description) {
  const tasks = readTasks();
  const newTask = {
    id: generateId(),
    description,
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(newTask);
  writeTasks(tasks);
  console.log('Task added successfully.');
}

 
function updateTask(id, description) {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    console.log('Task not found.');
    return;
  }
  tasks[taskIndex].description = description;
  tasks[taskIndex].updatedAt = new Date().toISOString();
  writeTasks(tasks);
  console.log('Task updated successfully.');
}

 
function deleteTask(id) {
  let tasks = readTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  if (tasks.length === initialLength) {
    console.log('Task not found.');
    return;
  }
  writeTasks(tasks);
  console.log('Task deleted successfully.');
}

 
function markTask(id, status) {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    console.log('Task not found.');
    return;
  }
  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date().toISOString();
  writeTasks(tasks);
  console.log(`Task marked as ${status} successfully.`);
}

 
function listTasks(filter) {
  const tasks = readTasks();
  let filteredTasks = tasks;
  if (filter === 'done') {
    filteredTasks = tasks.filter(task => task.status === 'done');
  } else if (filter === 'not-done') {
    filteredTasks = tasks.filter(task => task.status !== 'done');
  } else if (filter === 'in-progress') {
    filteredTasks = tasks.filter(task => task.status === 'in-progress');
  }
  
  if (filteredTasks.length === 0) {
    console.log('No tasks found.');
    return;
  }
  
  filteredTasks.forEach(task => {
    console.log(`ID: ${task.id}`);
    console.log(`Description: ${task.description}`);
    console.log(`Status: ${task.status}`);
    console.log(`Created At: ${task.createdAt}`);
    console.log(`Updated At: ${task.updatedAt}`);
    console.log('------------------------');
  });
}

// Main function to handle command line arguments
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'add':
      if (args[1]) {
        addTask(args[1]);
      } else {
        console.log('Please provide a task description.');
      }
      break;
    case 'update':
      if (args[1] && args[2]) {
        updateTask(args[1], args[2]);
      } else {
        console.log('Please provide task ID and new description.');
      }
      break;
    case 'delete':
      if (args[1]) {
        deleteTask(args[1]);
      } else {
        console.log('Please provide a task ID.');
      }
      break;
    case 'mark':
      if (args[1] && (args[2] === 'in-progress' || args[2] === 'done')) {
        markTask(args[1], args[2]);
      } else {
        console.log('Please provide a task ID and status (in-progress or done).');
      }
      break;
    case 'list':
      listTasks(args[1]);
      break;
    default:
      console.log('Invalid command. Available commands: add, update, delete, mark, list');
  }
}

main();

console.log('Task Tracker CLI executed successfully.');