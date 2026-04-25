import { StateCreator } from 'zustand';
import { TaskSlice, AppStore } from '../types';
import { genId } from '../../shared/lib/id';

import { format } from 'date-fns';
import type { Subtask } from '../types';

export const createTaskSlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  TaskSlice
> = (set) => ({
  tasks: [],
  taskView: 'kanban',
  selectedTaskId: null,
  taskFilters: { priority: '', status: '', tags: [], search: '' },
  tags: [],

  addTag: (tagData) => set(state => {
    state.tags.unshift({
      ...tagData,
      id: genId(),
    });
  }),

  updateTag: (id, updates) => set(state => {
    const tag = state.tags.find(item => item.id === id);
    if (tag) {
      Object.assign(tag, updates);
      state.tasks.forEach(task => {
        task.tags = task.tags.map(taskTag => taskTag.id === id ? { ...taskTag, ...updates } : taskTag);
      });
    }
  }),

  deleteTag: (id) => set(state => {
    state.tags = state.tags.filter(tag => tag.id !== id);
    state.tasks.forEach(task => {
      task.tags = task.tags.filter(tag => tag.id !== id);
    });
    state.taskFilters.tags = state.taskFilters.tags.filter(tagId => tagId !== id);
  }),

  addTask: (taskData) => set(state => {
    const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    state.tasks.unshift({
      ...taskData,
      id: genId(),
      createdAt: now,
      updatedAt: now,
    });
  }),

  updateTask: (id, updates) => set(state => {
    const idx = state.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      Object.assign(state.tasks[idx], updates);
      state.tasks[idx].updatedAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    }
  }),

  deleteTask: (id) => set(state => {
    state.tasks = state.tasks.filter(t => t.id !== id);
  }),

  completeTask: (id) => set(state => {
    const idx = state.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      state.tasks[idx].status = 'done';
      state.tasks[idx].progress = 100;
      state.tasks[idx].completedAt = now;
      state.tasks[idx].updatedAt = now;
    }
  }),

  setTaskView: (view) => set(state => { state.taskView = view; }),
  setSelectedTask: (id) => set(state => { state.selectedTaskId = id; }),
  setTaskFilters: (filters) => set(state => { Object.assign(state.taskFilters, filters); }),

  toggleSubtask: (taskId, subtaskId) => set(state => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      const subtask = task.subtasks.find((s: Subtask) => s.id === subtaskId);
      if (subtask) {
        subtask.completed = !subtask.completed;
        const completed = task.subtasks.filter((s: Subtask) => s.completed).length;
        task.progress = Math.round((completed / task.subtasks.length) * 100);
      }
    }
  }),

  moveTask: (taskId, newStatus) => set(state => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      if (newStatus === 'done') {
        task.completedAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
        task.progress = 100;
      }
      task.updatedAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
    }
  }),

  bulkUpdateTasks: (ids, updates) => set(state => {
    ids.forEach(id => {
      const task = state.tasks.find(t => t.id === id);
      if (task) Object.assign(task, updates);
    });
  }),
});
