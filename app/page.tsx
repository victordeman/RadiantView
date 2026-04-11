"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  text: string;
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");

  const addTask = () => {
    if (newTaskText.trim() !== "") {
      const task: Task = {
        id: Math.random().toString(36).substring(2, 9),
        text: newTaskText.trim(),
      };
      setTasks([...tasks, task]);
      setNewTaskText("");
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>

      <div className="mb-8">
        <p className="mb-2 font-medium">Add a new task:</p>
        <div className="flex gap-2">
          <Input
            className="w-64 h-10 border-2"
            placeholder="Enter task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
          />
          <Button
            className="h-10 px-6 font-medium bg-blue-600 text-white hover:bg-blue-700"
            onClick={addTask}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex items-center gap-4">
            <span className="text-lg">
              {index + 1}. {task.text}
            </span>
            <Button
              variant="destructive"
              className="px-4 py-1 h-8 bg-red-500 text-white hover:bg-red-600"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
