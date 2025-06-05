export interface Todo {
  id: number;
  message: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoRequest {
  message: string;
  completed?: boolean;
}

export interface UpdateTodoRequest {
  message?: string;
  completed?: boolean;
}
