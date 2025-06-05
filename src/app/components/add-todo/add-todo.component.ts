import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="add-todo-container">
      <mat-form-field appearance="outline" class="todo-input">
        <mat-label>Add a new todo</mat-label>
        <input
          matInput
          [(ngModel)]="newTodoTitle"
          (keyup.enter)="addTodo()"
          placeholder="What needs to be done?"
          maxlength="200"
        />
        <mat-hint>Press Enter or click + to add</mat-hint>
      </mat-form-field>

      <button
        mat-fab
        color="primary"
        (click)="addTodo()"
        [disabled]="!newTodoTitle.trim()"
        matTooltip="Add todo"
        class="add-button"
      >
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .add-todo-container {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 24px;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 24px;
      }

      .todo-input {
        flex: 1;
        min-width: 0;
      }

      .add-button {
        margin-top: 8px;
        flex-shrink: 0;
      }

      .add-button:disabled {
        opacity: 0.5;
      }

      @media (max-width: 600px) {
        .add-todo-container {
          padding: 16px;
          gap: 12px;
        }

        .add-button {
          transform: scale(0.9);
        }
      }
    `,
  ],
})
export class AddTodoComponent {
  @Output() todoAdded = new EventEmitter<string>();

  protected newTodoTitle = '';

  addTodo(): void {
    const title = this.newTodoTitle.trim();
    if (title) {
      this.todoAdded.emit(title);
      this.newTodoTitle = '';
    }
  }
}
