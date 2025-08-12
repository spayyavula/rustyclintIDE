import { Smartphone } from 'lucide-react';

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: 'Code' },
  { id: 'mobile', name: 'Mobile Apps', icon: 'Smartphone' },
  { id: 'web', name: 'Web Apps', icon: 'Globe' },
  { id: 'ai', name: 'AI/ML', icon: 'Cpu' },
  { id: 'hft', name: 'High-Frequency Trading', icon: 'Zap' },
  { id: 'security', name: 'Security', icon: 'Shield' },
  { id: 'data', name: 'Data Science', icon: 'BarChart' },
  { id: 'backend', name: 'Backend', icon: 'Server' }
];

export const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

export const TEMPLATES = [
  {
    id: 'android-hello-world',
    name: 'Android Hello World',
    description: 'A simple Android app that displays "Hello, World!" on the screen.',
    icon: 'Android',
    category: 'mobile',
    difficulty: 'Beginner',
    techStack: ['Java', 'Android SDK'],
    tags: ['android', 'hello world', 'mobile']
  },
  {
    id: 'react-native-starter',
    name: 'React Native Starter',
    description: 'A cross-platform React Native starter app with navigation and theming.',
    icon: 'Smartphone',
    category: 'mobile',
    difficulty: 'Beginner',
    techStack: ['React Native', 'Expo', 'React Navigation'],
    tags: ['react', 'native', 'starter', 'mobile']
  },
  {
    id: 'flutter-counter',
    name: 'Flutter Counter App',
    description: 'A simple Flutter app demonstrating state management.',
    icon: 'Smartphone',
    category: 'mobile',
    difficulty: 'Beginner',
    techStack: ['Flutter', 'Dart'],
    tags: ['flutter', 'counter', 'mobile']
  },
  {
    id: 'react-web-app',
    name: 'React Web App',
    description: 'A basic web application built with React.',
    icon: 'React',
    category: 'web',
    difficulty: 'Beginner',
    techStack: ['React', 'JavaScript', 'CSS'],
    tags: ['react', 'web', 'javascript', 'css']
  },
  {
    id: 'vue-ecommerce',
    name: 'Vue E-Commerce',
    description: 'A simple e-commerce application built with Vue.js.',
    icon: 'Vue',
    category: 'web',
    difficulty: 'Intermediate',
    techStack: ['Vue.js', 'JavaScript', 'CSS'],
    tags: ['vue', 'ecommerce', 'web', 'javascript', 'css']
  },
  {
    id: 'rust-tauri-chat',
    name: 'Tauri Chat App',
    description: 'A cross-platform chat app using React Native frontend and a Rust (Tauri) backend for secure, fast messaging.',
    icon: Smartphone,
    category: 'mobile',
    difficulty: 'Advanced',
    tags: ['rust', 'tauri', 'chat', 'mobile', 'react-native'],
    estimatedTime: '4 hours',
    files: {},
    features: [
      'End-to-end encrypted messaging',
      'Cross-platform (iOS, Android, Desktop)',
      'Push notifications',
      'Offline support'
    ],
    useCase: 'Secure team or personal messaging',
    techStack: ['React Native', 'Tauri', 'Rust', 'WebSockets']
  },
  {
    id: 'rust-actix-todo-mobile',
    name: 'Rust Actix Todo Mobile',
    description: 'A full-stack Todo app with a Flutter frontend and a Rust Actix-web backend, featuring JWT authentication.',
    icon: Smartphone,
    category: 'mobile',
    difficulty: 'Intermediate',
    tags: ['rust', 'actix', 'flutter', 'todo', 'mobile'],
    estimatedTime: '3 hours',
    files: {},
    features: [
      'JWT authentication',
      'REST API with Actix-web',
      'Flutter mobile UI',
      'SQLite database'
    ],
    useCase: 'Personal productivity and task management',
    techStack: ['Flutter', 'Rust', 'Actix-web', 'SQLite']
  },
  {
    id: 'rust-axum-social-mobile',
    name: 'Axum Social Feed',
    description: 'A social feed mobile app using Expo (React Native) and a Rust Axum backend, inspired by modern social platforms.',
    icon: Smartphone,
    category: 'mobile',
    difficulty: 'Advanced',
    tags: ['rust', 'axum', 'expo', 'social', 'mobile'],
    estimatedTime: '5 hours',
    files: {},
    features: [
      'User authentication',
      'Feed with posts and likes',
      'Image upload',
      'REST API with Axum'
    ],
    useCase: 'Building social or community mobile apps',
    techStack: ['Expo', 'React Native', 'Rust', 'Axum', 'PostgreSQL']
  }
  // ...add all other templates from your templates.jsx here...
];

export const TEMPLATES_BY_CATEGORY = TEMPLATES.reduce((acc, template) => {
  if (!acc[template.category]) {
    acc[template.category] = [];
  }
  acc[template.category].push(template);
  return acc;
}, {} as Record<string, typeof TEMPLATES>);

export const getTemplateById = (id: string) => {
  return TEMPLATES.find(template => template.id === id) || null;
};