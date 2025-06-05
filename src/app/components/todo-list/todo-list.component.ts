import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { TodoService } from '../../services/todo.service';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    AddTodoComponent,
    TodoItemComponent,
  ],
  template: `
    <div class="todo-app">
      <mat-toolbar color="primary">
        <mat-icon>check_circle</mat-icon>
        <span>Todo App</span>
        <span class="spacer"></span>
        <span class="todo-count">{{ todoService.todoCount() }} tasks</span>
      </mat-toolbar>

      <div class="todo-container">
        <!-- Loading indicator -->
        @if (todoService.loading()) {
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        }

        <!-- Add todo section -->
        <app-add-todo (todoAdded)="onAddTodo($event)"></app-add-todo>

        <!-- Todo list -->
        <mat-card class="todo-list-card">
          <mat-card-content>
            @if (todoService.todos().length === 0 && !todoService.loading()) {
            <div class="empty-state">
              <mat-icon class="empty-icon">assignment_turned_in</mat-icon>
              <h3>No todos yet</h3>
              <p>Add your first todo above to get started!</p>
            </div>
            } @else {
            <div class="todos-container">
              @for (todo of todoService.todos(); track todo.id) {
              <app-todo-item
                [todo]="todo"
                (toggleComplete)="onToggleComplete($event)"
                (updateTodo)="onUpdateTodo($event)"
                (deleteTodo)="onDeleteTodo($event)"
              >
              </app-todo-item>
              }
            </div>
            }
          </mat-card-content>
        </mat-card>

        <!-- Summary section -->
        @if (todoService.todos().length > 0) {
        <div class="summary">
          <mat-card class="summary-card">
            <mat-card-content>
              <div class="summary-stats">
                <div class="stat">
                  <span class="stat-number">{{
                    todoService.activeTodos().length
                  }}</span>
                  <span class="stat-label">Active</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{
                    todoService.completedTodos().length
                  }}</span>
                  <span class="stat-label">Completed</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ todoService.todoCount() }}</span>
                  <span class="stat-label">Total</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .todo-app {
        min-height: 100vh;
        background: #f5f5f5;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .todo-count {
        font-size: 14px;
        opacity: 0.8;
      }

      .todo-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 24px;
      }

      .todo-list-card {
        margin-bottom: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .todos-container {
        min-height: 200px;
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
        color: #666;
      }

      .empty-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .empty-state h3 {
        margin: 16px 0 8px 0;
        font-weight: 400;
      }

      .empty-state p {
        margin: 0;
        opacity: 0.7;
      }

      .summary {
        margin-top: 24px;
      }

      .summary-card {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .summary-stats {
        display: flex;
        justify-content: space-around;
        text-align: center;
      }

      .stat {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .stat-number {
        font-size: 24px;
        font-weight: 500;
        color: #1976d2;
      }

      .stat-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #666;
      }

      @media (max-width: 600px) {
        .todo-container {
          padding: 16px;
        }

        .summary-stats {
          gap: 16px;
        }

        .stat-number {
          font-size: 20px;
        }
      }
    `,
  ],
})
export class TodoListComponent {
  protected todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  async onAddTodo(title: string): Promise<void> {
    try {
      await this.todoService.createTodo({ message: title });
      this.snackBar.open('Todo added successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    } catch {
      this.snackBar.open('Failed to add todo. Please try again.', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }

  async onToggleComplete(todoId: number): Promise<void> {
    try {
      await this.todoService.toggleTodo(todoId);
    } catch {
      this.snackBar.open('Failed to update todo. Please try again.', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }

  async onUpdateTodo(update: { id: number; message: string }): Promise<void> {
    try {
      await this.todoService.updateTodo(update.id, { message: update.message });
      this.snackBar.open('Todo updated successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    } catch {
      this.snackBar.open('Failed to update todo. Please try again.', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }

  async onDeleteTodo(todoId: number): Promise<void> {
    try {
      await this.todoService.deleteTodo(todoId);
      this.snackBar.open('Todo deleted successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    } catch {
      this.snackBar.open('Failed to delete todo. Please try again.', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }
}
