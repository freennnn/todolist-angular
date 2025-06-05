import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Todo } from '../../models/todo.interface';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  template: `
    <div class="todo-item" [class.completed]="todo.completed">
      <!-- Checkbox for completion status -->
      <mat-checkbox
        [checked]="todo.completed"
        (change)="onToggleComplete()"
        class="todo-checkbox"
      >
      </mat-checkbox>

      <!-- Todo content - either display or edit mode -->
      <div class="todo-content" [class.editing]="isEditing()">
        @if (!isEditing()) {
        <span
          class="todo-message"
          (click)="startEditing()"
          (keyup.enter)="startEditing()"
          (keyup.space)="startEditing()"
          tabindex="0"
          role="button"
          attr.aria-label="Edit todo: {{ todo.message }}"
        >
          {{ todo.message }}
        </span>
        } @else {
        <mat-form-field appearance="outline" class="edit-field">
          <input
            matInput
            [(ngModel)]="editMessage"
            (keyup.enter)="saveEdit()"
            (keyup.escape)="cancelEdit()"
            (blur)="saveEdit()"
            #editInput
          />
        </mat-form-field>
        }
      </div>

      <!-- Action buttons -->
      <div class="todo-actions">
        @if (!isEditing()) {
        <button
          mat-icon-button
          (click)="startEditing()"
          matTooltip="Edit todo"
          class="edit-btn"
        >
          <mat-icon>edit</mat-icon>
        </button>
        } @else {
        <button
          mat-icon-button
          (click)="saveEdit()"
          matTooltip="Save changes"
          class="save-btn"
        >
          <mat-icon>check</mat-icon>
        </button>
        <button
          mat-icon-button
          (click)="cancelEdit()"
          matTooltip="Cancel edit"
          class="cancel-btn"
        >
          <mat-icon>close</mat-icon>
        </button>
        }

        <button
          mat-icon-button
          (click)="onDelete()"
          matTooltip="Delete todo"
          class="delete-btn"
          color="warn"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .todo-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #e0e0e0;
        transition: background-color 0.2s ease;
      }

      .todo-item:hover {
        background-color: #f5f5f5;
      }

      .todo-item.completed {
        opacity: 0.7;
      }

      .todo-checkbox {
        margin-right: 16px;
        flex-shrink: 0;
      }

      .todo-content {
        flex: 1;
        min-width: 0;
      }

      .todo-message {
        cursor: pointer;
        display: block;
        padding: 8px 0;
        word-wrap: break-word;
        transition: color 0.2s ease;
        border-radius: 4px;
      }

      .todo-item.completed .todo-message {
        text-decoration: line-through;
        color: #999;
      }

      .todo-message:hover,
      .todo-message:focus {
        color: #1976d2;
        outline: none;
      }

      .todo-message:focus {
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.3);
      }

      .edit-field {
        width: 100%;
        margin: 0;
      }

      .todo-actions {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
        margin-left: 16px;
      }

      .edit-btn,
      .save-btn,
      .cancel-btn {
        color: #666;
      }

      .edit-btn:hover,
      .save-btn:hover {
        color: #1976d2;
      }

      .cancel-btn:hover {
        color: #f44336;
      }

      .delete-btn:hover {
        color: #f44336;
      }
    `,
  ],
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() updateTodo = new EventEmitter<{ id: number; message: string }>();
  @Output() deleteTodo = new EventEmitter<number>();

  protected isEditing = signal(false);
  protected editMessage = '';

  onToggleComplete(): void {
    this.toggleComplete.emit(this.todo.id);
  }

  onDelete(): void {
    this.deleteTodo.emit(this.todo.id);
  }

  startEditing(): void {
    this.editMessage = this.todo.message;
    this.isEditing.set(true);

    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      const input = document.querySelector(
        '.edit-field input'
      ) as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  saveEdit(): void {
    if (
      this.editMessage.trim() &&
      this.editMessage.trim() !== this.todo.message
    ) {
      this.updateTodo.emit({
        id: this.todo.id,
        message: this.editMessage.trim(),
      });
    }
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.editMessage = '';
    this.isEditing.set(false);
  }
}
