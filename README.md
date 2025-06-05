# Angular 20.0 Todo App

A  todo application built with Angular 20.0 featuring standalone components, signals, and Material Design.

## Todo Features

- **Add/Edit/Delete Todos**: Create new todos with a text input and plus button. Edit inline.
- **Toggle Completion**: Mark todos as completed/incomplete with checkboxes
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages with snackbar notifications

## Tech Stack

- **Modern Angular 20.0** with standalone components and zoneless architecture (no zone.js!)
- **RxJS** - Reactive programming
- **Reactive State Management** using Angular Signals
- **Angular Material** - UI component library
- **TypeScript, SCSS** - Type-safe development

## Environment Configurations

The app supports different API endpoints for development and production:

### Development Environment

- **API URL**: `http://localhost:3000/todos`
- **Purpose**: For local development to avoid CORS issues
- **Usage**: `npm run start:dev` or `npm start`

### Production Environment

- **API URL**: `https://todolist.pronevich.com/todos`
- **Purpose**: For production deployment, final production url of frontend app needs to be added to server cors policies
- **Usage**: `npm run start:prod` or `npm run build:prod`

### API (`localhost:3000/todos` or `https://todolist.pronevich.com/todos`)

- `GET /` - Get all todos
- `POST /` - Create a new todo
- `PATCH /:id` - Update a todo
- `DELETE /:id` - Delete a todo

## Project Structure

```bash
src/
├── app/
│   ├── components/
│   │   ├── add-todo/           # Add new todo component
│   │   ├── todo-item/          # Individual todo item component
│   │   └── todo-list/          # Main todo list container
│   ├── models/
│   │   └── todo.interface.ts   # Todo type definitions
│   ├── services/
│   │   └── todo.service.ts     # Todo API service with signals
│   ├── app.config.ts           # App configuration
│   ├── app.routes.ts           # Routing configuration
│   ├── app.ts                  # Root component
│   └── app.html                # Root template
├── environments/
│   ├── environment.ts          # Development environment
│   └── environment.prod.ts     # Production environment
├── styles.scss                 # Global styles
└── main.ts                     # Application bootstrap
```

## Architecture & Angular 20 Patterns

### Component Architecture

#### Smart Components

• Know about TodoService
• Handle API calls
• Manage loading/error states
• Contain business logic
• Coordinate data flow

#### Dumb Components

• Pure presentation
• No dependencies on services
• Highly reusable
• Easy to test
• Predictable behavior

```bash
┌──────────────────────────────────────────────────────────┐
│                     AppComponent                         │
│                    (Root/Smart)                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                TodoListComponent                    │ │
│  │                  (Smart/Container)                  │ │
│  │  ┌─────────────────┐ ┌────────────────────────────┐ │ │
│  │  │ AddTodoComponent│ │     TodoItemComponent      │ │ │
│  │  │     (Dumb)      │ │        (Dumb)              │ │ │
│  │  │                 │ │                            │ │ │
│  │  │ @Input: none    │ │ @Input: todo: Todo         │ │ │
│  │  │ @Output:        │ │ @Output: toggleComplete    │ │ │
│  │  │  todoAdded      │ │ @Output: updateTodo        │ │ │
│  │  │                 │ │ @Output: deleteTodo        │ │ │
│  │  └─────────────────┘ │ (Multiple instances via    │ │ │
│  │                      │  @for control flow)        │ │ │
│  │                      └────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 🔄 Data Flow Architecture

```bash
┌──────────────────────────────────────────────────────────────┐
│                        TodoService                           │
│                     (Reactive State)                         │
│                                                              │
│  Signals (State Management):                                 │
│  ├── todosSignal: WritableSignal<Todo[]>                     │
│  ├── loadingSignal: WritableSignal<boolean>                  │
│  ├── errorSignal: WritableSignal<string | null>              │
│                                                              │
│  Computed Signals (Derived State):                           │
│  ├── completedTodos = computed(() => todos().filter(...))    │
│  ├── activeTodos = computed(() => todos().filter(...))       │
│  └── todoCount = computed(() => todos().length)              │
│                                                              │
│  API Methods:                                                │
│  ├── loadTodos() → GET /todos                                │
│  ├── createTodo() → POST /todos                              │
│  ├── updateTodo() → PATCH /todos/:id                         │
│  └── deleteTodo() → DELETE /todos/:id                        │
└──────────────────────────────────────────────────────────────┘
                                    ↕️
                        HTTP Client (Environment-based API)
                                    ↕️
┌──────────────────────────────────────────────────────────────┐
│                    External REST API                         │
│  Development: http://localhost:3000/todos                    │
│  Production: https://todolist.pronevich.com/todos            │
└──────────────────────────────────────────────────────────────┘

                                    ↕️
                            🔄 Reactive Updates
                                    ↕️

┌──────────────────────────────────────────────────────────────┐
│                      TodoListComponent                       │
│                     (Smart Container)                        │
│                                                              │
│  Dependency Injection:                                       │
│  ├── todoService = inject(TodoService)                       │
│  └── snackBar = inject(MatSnackBar)                          │
│                                                              │
│  Template Bindings:                                          │
│  ├── todoService.todos() → @for loop                         │
│  ├── todoService.loading() → progress bar                    │
│  ├── todoService.todoCount() → header counter                │
│  ├── todoService.activeTodos().length → stats                │
│  └── todoService.completedTodos().length → stats             │
│                                                              │
│  Event Handlers:                                             │
│  ├── onAddTodo() → todoService.createTodo()                  │
│  ├── onToggleComplete() → todoService.toggleTodo()           │
│  ├── onUpdateTodo() → todoService.updateTodo()               │
│  └── onDeleteTodo() → todoService.deleteTodo()               │
└──────────────────────────────────────────────────────────────┘
                                    ↕️
                        📤 Props Down / Events Up
                                    ↕️
┌─────────────────────┐              ┌─────────────────────────────┐
│   AddTodoComponent  │              │      TodoItemComponent      │
│      (Dumb)         │              │          (Dumb)             │
│                     │              │                             │
│ 📥 Props: none      │              │ 📥 Props:                   │
│ 📤 Events:          │              │    └── todo: Todo           │
│    └── todoAdded    │              │ 📤 Events:                  │
│                     │              │    ├── toggleComplete       │
│                     │              │    ├── updateTodo           │
│                     │              │    └── deleteTodo           │
└─────────────────────┘              └─────────────────────────────┘
```

### Component Details

#### 1. **AppComponent** (Root)

```typescript
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoListComponent],  // ← Standalone imports
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
```

- **Role**: Bootstrap component and routing container
- **Children**: TodoListComponent

#### 2. **TodoListComponent** (Smart Container)

```typescript
@Component({
  selector: 'app-todo-list',
  standalone: true,  // ← Standalone component
  imports: [
    CommonModule, MatCardModule, MatProgressBarModule,
    AddTodoComponent, TodoItemComponent  // ← Direct component imports
  ]
})
```

- **Role**: State management and orchestration
- **Dependencies**: `inject(TodoService)`, `inject(MatSnackBar)`
- **Responsibilities**:
  - Subscribes to service signals for reactive updates
  - Handles all business logic and API calls
  - Manages loading states and error handling
  - Provides data to child components via inputs
  - Receives events from child components

#### 3. **AddTodoComponent** (Dumb/Presentational)

```typescript
@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule]
})
```

- **Role**: Todo creation UI
- **Pattern**: Pure presentation component
- **Inputs**: None
- **Outputs**: `@Output() todoAdded = new EventEmitter<string>()`
- **Responsibilities**:
  - Manages local form state
  - Validates input
  - Emits events to parent

#### 4. **TodoItemComponent** (Dumb/Presentational)

```typescript
@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, ...]
})
```

- **Role**: Individual todo item display and editing
- **Pattern**: Pure presentation component
- **Inputs**: `@Input() todo!: Todo`
- **Outputs**:
  - `@Output() toggleComplete = new EventEmitter<number>()`
  - `@Output() updateTodo = new EventEmitter<{id: number, message: string}>()`
  - `@Output() deleteTodo = new EventEmitter<number>()`
- **Responsibilities**:
  - Displays todo data
  - Manages inline editing state
  - Emits user actions to parent

### Angular 20 Modern Patterns

#### 1. **Standalone Components**

```typescript
// No NgModules required!
@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, ...],  // Direct imports
  // ...
})
```

- **Benefits**: Simpler architecture, better tree-shaking, faster builds
- **Usage**: All components are standalone
- **Migration**: Eliminates the need for NgModules

#### 2. **Signals for Reactive State**

```typescript
// Service signals
private todosSignal = signal<Todo[]>([]);
public readonly todos = this.todosSignal.asReadonly();

// Computed signals (automatically update)
public readonly completedTodos = computed(() => 
  this.todos().filter(todo => todo.completed)
);

// Template usage (automatically subscribes)
{{ todoService.todos().length }}
```

- **Benefits**: Better performance, simpler change detection, automatic cleanup
- **Pattern**: Signal-based state management instead of RxJS observables in templates
- **Auto-subscription**: Templates automatically subscribe to signals

#### 3. **Zoneless Change Detection**

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),  // ← No zone.js!
    // ...
  ]
};
```

- **Benefits**: Better performance, smaller bundle size, more predictable updates
- **Pattern**: Manual change detection with signals instead of zone.js monkey patching

#### 4. **Dependency Injection with inject()**

```typescript
export class TodoListComponent {
  // Modern injection pattern
  protected todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);
  
  // No constructor needed!
}
```

- **Benefits**: Cleaner code, better tree-shaking, more flexible
- **Pattern**: Function-based DI instead of constructor injection

#### 5. **Control Flow (@if, @for, @switch)**

```typescript
// New template syntax
@if (todoService.loading()) {
  <mat-progress-bar mode="indeterminate"></mat-progress-bar>
}

@for (todo of todoService.todos(); track todo.id) {
  <app-todo-item [todo]="todo" />
}
```

- **Benefits**: Better performance, cleaner templates, built-in tracking
- **Pattern**: Built-in control flow instead of structural directives

#### 6. **Environment-based Configuration**

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/todos'
};

// Service usage
constructor(private http: HttpClient) {
  this.baseUrl = environment.apiUrl;  // ← Automatic environment switching
}
```

### 🔄 Data Flow Patterns

#### 1. **Unidirectional Data Flow**

```bash
Service State → Component Props → Child Components
     ↑                                    ↓
API Updates ←── Event Handlers ←── Child Events
```

#### 2. **Signal-based Updates**

```typescript
// Service updates signal
this.todosSignal.update(todos => [...todos, newTodo]);

// Template automatically re-renders
{{ todoService.todos().length }}  // ← Automatically updates
```

#### 3. **Event-driven Communication**

```typescript
// Child emits event
@Output() todoAdded = new EventEmitter<string>();
onSubmit() { this.todoAdded.emit(this.newTodoText); }

// Parent handles event
<app-add-todo (todoAdded)="onAddTodo($event)"></app-add-todo>
async onAddTodo(title: string) { await this.todoService.createTodo({message: title}); }
```

### Service Integration Patterns

The `TodoService` acts as the central state manager using Angular's new signals system:

```typescript
// Reactive state pattern
export class TodoService {
  // Private writable signals
  private todosSignal = signal<Todo[]>([]);
  
  // Public readonly signals  
  public readonly todos = this.todosSignal.asReadonly();
  
  // Computed derived state
  public readonly activeTodos = computed(() => 
    this.todos().filter(todo => !todo.completed)
  );
  
  // API operations update signals
  async createTodo(data: CreateTodoRequest) {
    const newTodo = await this.http.post<Todo>(this.baseUrl, data);
    this.todosSignal.update(todos => [...todos, newTodo]);  // ← Immutable updates
  }
}
```

This architecture ensures:

- **Single Source of Truth**: All state in TodoService
- **Immutable Updates**: Using `update()` with spread operators
- **Automatic UI Updates**: Signals trigger re-renders automatically

### Available Scripts

- `npm start` - Start development server (development environment - localhost:3000)
- `npm run start:prod` - Start development server with production environment
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run build:prod` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Run linting

## CORS Handling

To avoid CORS issues during development:

1. **Development**: Use `localhost:3000` backend (no CORS issues)
2. **Production**: Use the production API with proper CORS configuration (with production frontend domain included to cors-origin on production backend)
3. **Alternative**: Use Angular proxy configuration for development
