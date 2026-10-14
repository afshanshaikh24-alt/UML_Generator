# UML Class Diagram Generator & Java Code Generator

A complete, professional web application for visually designing UML class diagrams and automatically generating Java source code — no backend, no API keys, works completely offline.

---

## Features

### Visual UML Designer
- Drag & drop canvas — Position classes freely on an infinite canvas
- Pan & zoom — Navigate large diagrams with ease
- Minimap — Overview navigation for complex diagrams
- 7 relationship types — Association, Directed Association, Inheritance, Aggregation, Composition, Dependency, Realization
- Relationship labels & multiplicities (e.g., 1, 0..*, 1..*)

### Class Editor
- Full UML class notation — Visibility symbols (+/-/#/~), static underline, abstract italic
- Attributes editor — Name, type, visibility, static/final flags, default values
- Methods editor — Name, return type, visibility, parameters, static/abstract/final
- Package names, Interface & abstract class support
- Extends & implements — Specify inheritance hierarchy

### Java Code Generation
- Automatic constructor generation — Default + parameterized
- Getters & setters — Auto-generated for private/protected fields
- All modifiers preserved — public, private, protected, static, final, abstract
- Interface body — Correct Java interface syntax
- ZIP download — Download all Java files at once using JSZip

### Project Management
- LocalStorage persistence — Auto-saved every 30 seconds
- JSON export/import — Share and version control diagrams
- Multiple diagrams — Dashboard with recent diagrams list
- Undo/Redo — Full history with 50-step stack

### Examples Included
- Library Management System — User, Book, Author, Library, Loan (5 classes)
- Student Management System — Person, Student, Teacher, Course (4 classes)

---

## Technology Stack

- React 18 + TypeScript
- Vite (build tool)
- React Flow (diagram canvas)
- Zustand (state management)
- Tailwind CSS v4
- Lucide React (icons)
- JSZip (ZIP generation)
- React Hot Toast (notifications)
- React Router DOM (routing)
- LocalStorage (persistence)

---

## Installation

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## Project Structure

```
src/
├── components/
│   ├── Header/             # Top navigation bar
│   ├── Sidebar/            # Left tool panel
│   ├── DiagramCanvas/      # React Flow canvas
│   ├── UMLClassNode/       # UML class node renderer
│   ├── PropertiesPanel/    # Right properties editor
│   ├── JavaCodePanel/      # Bottom Java output panel
│   └── RelationshipDialog/ # Relationship configuration modal
├── pages/
│   ├── Home.tsx            # Dashboard
│   ├── Editor.tsx          # Diagram editor
│   └── About.tsx           # About page
├── models/index.ts         # TypeScript data models
├── store/diagramStore.ts   # Zustand state
└── utils/
    ├── javaGenerator.ts    # Java code generation
    ├── validation.ts       # Input validation
    ├── storage.ts          # LocalStorage CRUD
    ├── export.ts           # Export/import
    └── examples.ts         # Pre-built examples
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---------|--------|
| Ctrl + S | Save diagram |
| Ctrl + Z | Undo |
| Ctrl + Y | Redo |
| Ctrl + D | Duplicate selected class |
| Delete   | Delete selected |
| Escape   | Deselect |

---

## License

MIT License — free to use, modify, and distribute.
