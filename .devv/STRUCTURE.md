# This file is only for editing file nodes, do not break the structure

## Project Description
A fully functional VS Code clone built with React and TypeScript. This web-based IDE replicates the core features and interface of Visual Studio Code, providing a familiar environment for developers to write and execute code directly in the browser.

## Key Features
- File System with Explorer: Create, delete, rename, and manage files/folders stored in local storage
- Monaco Editor Integration: Full syntax highlighting and code editing capabilities
- Terminal Emulation: Interactive terminal with command history and simulated execution
- Theme Toggle: Switch between light and dark themes
- Extensions Panel: Manage and install dummy extensions
- Status Bar: Display file information, cursor position, and editor settings

/src
├── assets/          # Static resources directory, storing static files like images and fonts
│
├── components/      # Components directory
│   ├── ui/         # Pre-installed shadcn/ui components, avoid modifying or rewriting unless necessary
│
├── hooks/          # Custom Hooks directory
│   ├── use-mobile.ts # Pre-installed mobile detection Hook from shadcn (import { useIsMobile } from '@/hooks/use-mobile')
│   └── use-toast.ts  # Toast notification system hook for displaying toast messages (import { useToast } from '@/hooks/use-toast')
│
├── lib/            # Utility library directory
│   └── utils.ts    # Utility functions, including the cn function for merging Tailwind class names
│
├── pages/          # Page components directory, based on React Router structure
│   ├── HomePage.tsx # Home page component, serving as the main entry point of the application
│   └── NotFoundPage.tsx # 404 error page component, displays when users access non-existent routes
│
├── App.tsx         # Root component, with React Router routing system configured
│                   # Add new route configurations in this file
│                   # Includes catch-all route (*) for 404 page handling
│
├── main.tsx        # Entry file, rendering the root component and mounting to the DOM
│
├── index.css       # Global styles file, containing Tailwind configuration and custom styles
│                   # Modify theme colors and design system variables in this file 
│
└── tailwind.config.js  # Tailwind CSS v3 configuration file
                      # Contains theme customization, plugins, and content paths
                      # Includes shadcn/ui theme configuration 