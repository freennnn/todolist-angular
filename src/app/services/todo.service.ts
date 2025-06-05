import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
} from '../models/todo.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly baseUrl = environment.apiUrl;

  // Signals for reactive state management
  private todosSignal = signal<Todo[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly signals
  public readonly todos = this.todosSignal.asReadonly();
  public readonly loading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();

  // Computed signals
  public readonly completedTodos = computed(() =>
    this.todos().filter((todo) => todo.completed)
  );

  public readonly activeTodos = computed(() =>
    this.todos().filter((todo) => !todo.completed)
  );

  public readonly todoCount = computed(() => this.todos().length);

  constructor(private http: HttpClient) {
    console.log('TodoService initialized with API URL:', this.baseUrl);
    this.loadTodos();
  }

  // Load all todos
  async loadTodos(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      console.log('Loading todos from:', this.baseUrl);
      const todos = await firstValueFrom(this.http.get<Todo[]>(this.baseUrl));
      this.todosSignal.set(todos || []);
      console.log('Todos loaded successfully:', todos);
    } catch (error) {
      const errorMessage = `Failed to load todos from ${this.baseUrl}`;
      this.errorSignal.set(errorMessage);
      console.error('Error loading todos:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Create a new todo
  async createTodo(todoData: CreateTodoRequest): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      console.log('🚀 Creating todo with data:', todoData);
      console.log('🌐 POST URL:', this.baseUrl);
      console.log('🔧 Environment:', environment);

      const newTodo = await firstValueFrom(
        this.http.post<Todo>(this.baseUrl, todoData)
      );

      console.log('✅ Todo created successfully:', newTodo);

      if (newTodo) {
        this.todosSignal.update((todos) => [...todos, newTodo]);
        console.log('📝 Updated todos list, new count:', this.todoCount());
      }
    } catch (error) {
      console.error('❌ Error creating todo:');
      console.error('Error details:', error);
      console.error('Request URL:', this.baseUrl);
      console.error('Request data:', todoData);
      this.errorSignal.set('Failed to create todo');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Update a todo
  async updateTodo(id: number, updates: UpdateTodoRequest): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      console.log('Updating todo:', id, updates);
      const updatedTodo = await firstValueFrom(
        this.http.patch<Todo>(`${this.baseUrl}/${id}`, updates)
      );
      if (updatedTodo) {
        this.todosSignal.update((todos) =>
          todos.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
        console.log('Todo updated successfully:', updatedTodo);
      }
    } catch (error) {
      console.error('❌ Error updating todo:');
      console.error('Error details:', error);
      console.error('Request URL:', `${this.baseUrl}/${id}`);
      console.error('Request data:', updates);
      this.errorSignal.set('Failed to update todo');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Delete a todo
  async deleteTodo(id: number): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      console.log('Deleting todo:', id);
      await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
      this.todosSignal.update((todos) =>
        todos.filter((todo) => todo.id !== id)
      );
      console.log('Todo deleted successfully');
    } catch (error) {
      this.errorSignal.set('Failed to delete todo');
      console.error('Error deleting todo:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Toggle todo completion status
  async toggleTodo(id: number): Promise<void> {
    const todo = this.todos().find((t) => t.id === id);
    if (todo) {
      await this.updateTodo(id, { completed: !todo.completed });
    }
  }
}
