// Project Templates Data
// This file contains template definitions for various project types

import React from 'react';
import {
  Smartphone, 
  Cpu, 
  Zap, 
  Shield, 
  Globe, 
  Code,
  BarChart,
  Database,
  Server,
  Monitor
} from 'lucide-react';

// Template categories
export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: Code },
  { id: 'mobile', name: 'Mobile Apps', icon: Smartphone },
  { id: 'web', name: 'Web Apps', icon: Globe },
  { id: 'ai', name: 'AI/ML', icon: Cpu },
  { id: 'hft', name: 'High-Frequency Trading', icon: Zap },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'data', name: 'Data Science', icon: BarChart },
  { id: 'backend', name: 'Backend', icon: Server }
];

// Template difficulty levels
export const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

// Template definitions
export const templates = [
  {
    id: 'android-hello-world',
    name: 'Android Hello World',
    description: 'A simple Android Hello World app with complete deployment pipeline to Google Play Store',
    category: 'mobile',
    subcategory: 'android',
    difficulty: 'Beginner',
    tags: ['Android', 'Kotlin', 'Deployment', 'Google Play'],
    icon: Smartphone,
    estimatedTime: '30 minutes',
    files: {
      'MainActivity.kt': {
        content: `package com.rustyclint.helloworld

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Find the TextView and set a dynamic message
        val messageTextView = findViewById<TextView>(R.id.messageTextView)
        messageTextView.text = "Hello World from rustyclint!"
    }
}`,
        language: 'kotlin'
      },
      'activity_main.xml': {
        content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#1F2937"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/titleTextView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        android:textColor="#FFFFFF"
        android:textSize="32sp"
        android:textStyle="bold"
        app:layout_constraintBottom_toTopOf="@+id/messageTextView"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_chainStyle="packed" />

    <TextView
        android:id="@+id/messageTextView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="Welcome to your first Android app!"
        android:textColor="#E5E7EB"
        android:textSize="18sp"
        app:layout_constraintBottom_toTopOf="@+id/versionTextView"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/titleTextView" />

    <TextView
        android:id="@+id/versionTextView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="32dp"
        android:text="Version 1.0.0"
        android:textColor="#9CA3AF"
        android:textSize="14sp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/messageTextView" />

</androidx.constraintlayout.widget.ConstraintLayout>`,
        language: 'xml'
      },
      'build.gradle': {
        content: `plugins {
    id 'com.android.application'
    id 'kotlin-android'
}

// Load keystore properties
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    namespace 'com.rustyclint.helloworld'
    compileSdk 34

    defaultConfig {
        applicationId "com.rustyclint.helloworld"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias'] ?: System.getenv("KEY_ALIAS") ?: "release-key"
            keyPassword keystoreProperties['keyPassword'] ?: System.getenv("KEY_PASSWORD")
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword'] ?: System.getenv("KEYSTORE_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    buildFeatures {
        viewBinding true
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}`,
        language: 'gradle'
      }
    },
    features: [
      'Complete Android app with Kotlin',
      'Automated keystore generation',
      'Secure signing configuration',
      'Google Play Store deployment pipeline',
      'CI/CD integration with GitHub Actions',
      'Step-by-step deployment guide'
    ],
    useCase: 'Perfect for developers who want to learn the complete Android deployment process to Google Play Store.',
    techStack: ['Android', 'Kotlin', 'Gradle', 'GitHub Actions', 'Fastlane']
  },
  {
    id: 'react-dashboard',
    name: 'React Dashboard',
    description: 'Modern React dashboard with TypeScript, Tailwind CSS, and data visualization',
    category: 'web',
    subcategory: 'dashboard',
    difficulty: 'Intermediate',
    tags: ['React', 'TypeScript', 'Dashboard', 'Charts'],
    icon: Monitor,
    estimatedTime: '45 minutes',
    files: {
      'Dashboard.tsx': {
        content: `import React from 'react';
import { BarChart, Users, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$12,345</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Growth</p>
                <p className="text-2xl font-bold text-gray-900">+23%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <BarChart className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion</p>
                <p className="text-2xl font-bold text-gray-900">3.2%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-600">User action {item} completed</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Memory</span>
                  <span>67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Storage</span>
                  <span>23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;`,
        language: 'typescript'
      },
      'App.tsx': {
        content: `import React from 'react';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;`,
        language: 'typescript'
      },
      'index.css': {
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
        language: 'css'
      }
    },
    features: [
      'Modern React with TypeScript',
      'Responsive design with Tailwind CSS',
      'Interactive data visualization',
      'Performance metrics',
      'Real-time updates',
      'Mobile-friendly interface'
    ],
    useCase: 'Perfect for building admin dashboards, analytics platforms, or business intelligence tools.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons']
  },
  {
    id: 'flutter-mobile-app',
    name: 'Flutter Mobile App',
    description: 'Cross-platform mobile app with Flutter and Rust native integration',
    category: 'mobile',
    subcategory: 'flutter',
    difficulty: 'Intermediate',
    tags: ['Flutter', 'Dart', 'Rust', 'Cross-platform'],
    icon: Smartphone,
    estimatedTime: '60 minutes',
    files: {
      'main.dart': {
        content: `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Rust Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light,
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.orange,
        useMaterial3: true,
      ),
      themeMode: ThemeMode.system,
      home: const MyHomePage(title: 'Flutter Rust Integration'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;
  String _rustResult = "Tap the button to call Rust code";

  void _incrementCounter() {
    setState(() {
      _counter++;
      // In a real app, this would call the Rust function
      _rustResult = "Called Rust function with param: $_counter";
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        elevation: 2,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Rust integration example:',
              style: TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _rustResult,
                style: TextStyle(
                  fontSize: 16,
                  color: Theme.of(context).colorScheme.onPrimaryContainer,
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Button pressed $_counter times',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Call Rust Function',
        child: const Icon(Icons.bolt),
      ),
    );
  }
}`,
        language: 'dart'
      },
      'pubspec.yaml': {
        content: `name: flutter_rust_app
description: A Flutter application with Rust native integration.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ">=2.17.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.5
  ffi: ^2.0.1
  flutter_rust_bridge: ^1.60.0
  
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.1
  ffigen: ^7.2.0
  build_runner: ^2.3.3

flutter:
  uses-material-design: true`,
        language: 'yaml'
      },
      'api.rs': {
        content: `use std::sync::Mutex;

// Example of a Rust function to be called from Flutter
pub fn process_data(input: i32) -> String {
    format!("Processed in Rust: {}", input * 2)
}

// Example of a more complex function with state
lazy_static::lazy_static! {
    static ref COUNTER: Mutex<i32> = Mutex::new(0);
}

pub fn increment_counter(amount: i32) -> i32 {
    let mut counter = COUNTER.lock().unwrap();
    *counter += amount;
    *counter
}

// Example of a function that returns a Result
pub fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}`,
        language: 'rust'
      }
    },
    features: [
      'Cross-platform mobile app (iOS & Android)',
      'Rust native integration for performance-critical code',
      'Material Design 3 with light/dark theme support',
      'FFI bridge for seamless Rust-Dart communication',
      'Example of error handling across language boundary',
      'Ready for CI/CD deployment'
    ],
    useCase: 'Ideal for mobile apps that need native performance with cross-platform UI.',
    techStack: ['Flutter', 'Dart', 'Rust', 'FFI', 'Material Design']
  },
  {
    id: 'ml-image-classifier',
    name: 'ML Image Classifier',
    description: 'Machine learning image classification model with Python and TensorFlow',
    category: 'ai',
    subcategory: 'computer-vision',
    difficulty: 'Advanced',
    tags: ['Machine Learning', 'TensorFlow', 'Computer Vision', 'Python'],
    icon: Cpu,
    estimatedTime: '90 minutes',
    files: {
      'model.py': {
        content: `import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import matplotlib.pyplot as plt
import numpy as np
import os

# Configuration
BATCH_SIZE = 32
IMG_HEIGHT = 224
IMG_WIDTH = 224
EPOCHS = 10
NUM_CLASSES = 10  # Adjust based on your dataset

def create_model():
    """Create a CNN model for image classification"""
    model = models.Sequential([
        # Base
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)),
        layers.MaxPooling2D((2, 2)),
        
        # Middle layers
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        
        # Classification head
        layers.Flatten(),
        layers.Dropout(0.5),  # Reduce overfitting
        layers.Dense(512, activation='relu'),
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def prepare_data(data_dir):
    """Prepare training and validation data generators"""
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )
    
    # Only rescaling for validation
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )
    
    # Flow from directory
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(IMG_HEIGHT, IMG_WIDTH),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )
    
    val_generator = val_datagen.flow_from_directory(
        data_dir,
        target_size=(IMG_HEIGHT, IMG_WIDTH),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
    
    return train_generator, val_generator

def train_model(model, train_generator, val_generator):
    """Train the model and return history"""
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=val_generator,
        validation_steps=val_generator.samples // BATCH_SIZE
    )
    
    return history

def plot_results(history):
    """Plot training & validation accuracy and loss"""
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
    loss = history.history['loss']
    val_loss = history.history['val_loss']
    
    epochs_range = range(EPOCHS)
    
    plt.figure(figsize=(12, 4))
    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, acc, label='Training Accuracy')
    plt.plot(epochs_range, val_acc, label='Validation Accuracy')
    plt.legend(loc='lower right')
    plt.title('Training and Validation Accuracy')
    
    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, loss, label='Training Loss')
    plt.plot(epochs_range, val_loss, label='Validation Loss')
    plt.legend(loc='upper right')
    plt.title('Training and Validation Loss')
    plt.savefig('training_results.png')
    plt.show()

def save_model(model, model_path='image_classifier_model'):
    """Save the model"""
    model.save(model_path)
    print(f"Model saved to {model_path}")

def main():
    # Check for GPU
    physical_devices = tf.config.list_physical_devices('GPU')
    if len(physical_devices) > 0:
        print(f"Found {len(physical_devices)} GPU(s)")
        tf.config.experimental.set_memory_growth(physical_devices[0], True)
    else:
        print("No GPU found, using CPU")
    
    # Create model
    model = create_model()
    model.summary()
    
    # Prepare data - replace with your data directory
    data_dir = 'dataset'
    if not os.path.exists(data_dir):
        print(f"Error: Data directory {data_dir} not found")
        return
    
    train_generator, val_generator = prepare_data(data_dir)
    
    # Train model
    history = train_model(model, train_generator, val_generator)
    
    # Plot results
    plot_results(history)
    
    # Save model
    save_model(model)

if __name__ == "__main__":
    main()`,
        language: 'python'
      },
      'predict.py': {
        content: `import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import matplotlib.pyplot as plt
import sys
import os

# Configuration
IMG_HEIGHT = 224
IMG_WIDTH = 224
MODEL_PATH = 'image_classifier_model'

def load_model(model_path):
    """Load the trained model"""
    try:
        model = tf.keras.models.load_model(model_path)
        print(f"Model loaded from {model_path}")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def preprocess_image(img_path):
    """Preprocess an image for prediction"""
    try:
        img = image.load_img(img_path, target_size=(IMG_HEIGHT, IMG_WIDTH))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # Normalize
        return img_array, img
    except Exception as e:
        print(f"Error processing image: {e}")
        return None, None

def predict(model, img_array, class_names):
    """Make a prediction"""
    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    predicted_class = class_names[np.argmax(score)]
    confidence = 100 * np.max(score);
    
    return predicted_class, confidence, predictions[0]

def display_prediction(img, class_names, predictions):
    """Display the image with prediction results"""
    predicted_class = class_names[np.argmax(predictions)];
    confidence = 100 * np.max(predictions);
    
    plt.figure(figsize=(8, 6));
    plt.imshow(img);
    plt.title(f"Prediction: {predicted_class} ({confidence:.2f}%)");
    
    // Show top 3 predictions
    top_3_idx = predictions.argsort()[-3:][::-1];
    plt.xlabel("\\n".join([f"{class_names[i]}: {predictions[i]*100:.2f}%" for i in top_3_idx]));
    plt.grid(False);
    plt.savefig('prediction_result.png');
    plt.show();
}

def main():
    # Check command line arguments
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
        return
    
    img_path = sys.argv[1]
    if not os.path.exists(img_path):
        print(f"Error: Image file {img_path} not found")
        return
    
    # Load model
    model = load_model(MODEL_PATH)
    if model is None:
        return
    
    # Get class names - replace with your actual class names
    # This should match the subdirectories in your training data
    class_names = ['class1', 'class2', 'class3', 'class4', 'class5', 
                   'class6', 'class7', 'class8', 'class9', 'class10']
    
    # Preprocess image
    img_array, img = preprocess_image(img_path)
    if img_array is None:
        return
    
    # Make prediction
    predicted_class, confidence, predictions = predict(model, img_array, class_names)
    print(f"Prediction: {predicted_class} with confidence {confidence:.2f}%")
    
    # Display results
    display_prediction(img, class_names, predictions)

if __name__ == "__main__":
    main()`,
        language: 'python'
      },
      'requirements.txt': {
        content: `tensorflow>=2.8.0
numpy>=1.22.0
matplotlib>=3.5.0
pillow>=9.0.0
scikit-learn>=1.0.0`,
        language: 'text'
      }
    },
    features: [
      'TensorFlow-based image classification model',
      'Data augmentation for improved training',
      'Model training with validation',
      'Performance visualization',
      'Prediction script for new images',
      'GPU acceleration support'
    ],
    useCase: 'Suitable for custom image classification tasks like product recognition, quality control, or content moderation.',
    techStack: ['Python', 'TensorFlow', 'Keras', 'NumPy', 'Matplotlib']
  },
  {
    id: 'rust-trading-bot',
    name: 'Rust Trading Bot',
    description: 'High-frequency trading bot with Rust for ultra-low latency',
    category: 'hft',
    subcategory: 'trading',
    difficulty: 'Expert',
    tags: ['Rust', 'Trading', 'HFT', 'Finance'],
    icon: Zap,
    estimatedTime: '120 minutes',
    files: {
      'main.rs': {
        content: `use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};

mod market_data;
mod strategy;
mod order;
mod execution;
mod risk;

use market_data::{MarketDataProvider, SimulatedMarketDataProvider};
use strategy::{Strategy, SimpleMovingAverageStrategy};
use order::{Order, OrderType, Side};
use execution::ExecutionEngine;
use risk::RiskManager;

fn main() {
    println!("Starting high-frequency trading bot...");
    
    // Configuration
    let config = Arc::new(Mutex::new(Config {
        symbol: "BTC/USD".to_string(),
        strategy_interval_ms: 100,
        risk_limit_usd: 10000.0,
        max_position_size: 1.0,
    }));
    
    // Initialize components
    let market_data = Arc::new(SimulatedMarketDataProvider::new("BTC/USD"));
    let strategy = Arc::new(Mutex::new(SimpleMovingAverageStrategy::new(
        20, // short period
        50, // long period
    )));
    let risk_manager = Arc::new(Mutex::new(RiskManager::new(
        config.lock().unwrap().risk_limit_usd,
        config.lock().unwrap().max_position_size,
    )));
    let execution_engine = Arc::new(Mutex::new(ExecutionEngine::new()));
    
    // Order book to track our orders
    let order_book = Arc::new(Mutex::new(Vec::<Order>::new()));
    
    // Clone references for threads
    let market_data_clone = Arc::clone(&market_data);
    let strategy_clone = Arc::clone(&strategy);
    let risk_manager_clone = Arc::clone(&risk_manager);
    let execution_engine_clone = Arc::clone(&execution_engine);
    let order_book_clone = Arc::clone(&order_book);
    let config_clone = Arc::clone(&config);
    
    // Strategy thread
    let strategy_thread = thread::spawn(move || {
        let mut last_run = Instant::now();
        
        loop {
            // Run at specified interval
            let now = Instant::now();
            let elapsed = now.duration_since(last_run);
            let interval = Duration::from_millis(config_clone.lock().unwrap().strategy_interval_ms);
            
            if elapsed < interval {
                thread::sleep(interval - elapsed);
                continue;
            }
            
            last_run = Instant::now();
            
            // Get latest market data
            let market_data = market_data_clone.get_latest_data();
            
            // Run strategy
            let signal = strategy_clone.lock().unwrap().generate_signal(&market_data);
            
            // Check risk limits
            let current_position = calculate_current_position(&order_book_clone);
            let risk_check = risk_manager_clone.lock().unwrap().check_risk(
                signal.side, 
                signal.size, 
                market_data.last_price, 
                current_position
            );
            
            if !risk_check.approved {
                println!("Risk check failed: {}", risk_check.reason);
                continue;
            }
            
            // Create order
            let order = Order {
                id: generate_order_id(),
                symbol: config_clone.lock().unwrap().symbol.clone(),
                side: signal.side,
                order_type: OrderType::Market,
                price: market_data.last_price,
                size: signal.size,
                status: order::OrderStatus::New,
                timestamp: chrono::Utc::now(),
            };
            
            // Submit order
            let execution_result = execution_engine_clone.lock().unwrap().submit_order(&order);
            
            if execution_result.success {
                // Add to order book
                order_book_clone.lock().unwrap().push(order);
                println!("Order executed: {:?}", execution_result);
            } else {
                println!("Order execution failed: {:?}", execution_result);
            }
            
            // Performance metrics
            let latency = last_run.elapsed();
            println!("Strategy cycle latency: {:?}", latency);
        }
    });
    
    // Market data thread
    let market_thread = thread::spawn(move || {
        loop {
            // Simulate market data updates
            market_data.update();
            thread::sleep(Duration::from_millis(50));
        }
    });
    
    // Join threads (they run forever in this example)
    strategy_thread.join().unwrap();
    market_thread.join().unwrap();
}

// Helper functions
fn calculate_current_position(order_book: &Arc<Mutex<Vec<Order>>>) -> f64 {
    let orders = order_book.lock().unwrap();
    let mut position = 0.0;
    
    for order in orders.iter() {
        if order.status == order::OrderStatus::Filled {
            match order.side {
                Side::Buy => position += order.size,
                Side::Sell => position -= order.size,
            }
        }
    }
    
    position
}

fn generate_order_id() -> String {
    format!("order-{}", chrono::Utc::now().timestamp_nanos())
}

// Configuration struct
struct Config {
    symbol: String,
    strategy_interval_ms: u64,
    risk_limit_usd: f64,
    max_position_size: f64,
}`,
        language: 'rust'
      },
      'market_data.rs': {
        content: `use std::sync::Mutex;
use chrono::{DateTime, Utc};
use rand::Rng;

#[derive(Debug, Clone)]
pub struct MarketData {
    pub symbol: String,
    pub bid: f64,
    pub ask: f64,
    pub last_price: f64,
    pub volume: f64,
    pub timestamp: DateTime<Utc>,
}

pub trait MarketDataProvider {
    fn get_latest_data(&self) -> MarketData;
    fn update(&self);
}

pub struct SimulatedMarketDataProvider {
    symbol: String,
    data: Mutex<MarketData>,
    volatility: f64,
}

impl SimulatedMarketDataProvider {
    pub fn new(symbol: &str) -> Self {
        let initial_price = 50000.0; // Starting price
        
        SimulatedMarketDataProvider {
            symbol: symbol.to_string(),
            data: Mutex::new(MarketData {
                symbol: symbol.to_string(),
                bid: initial_price - 0.5,
                ask: initial_price + 0.5,
                last_price: initial_price,
                volume: 0.0,
                timestamp: Utc::now(),
            }),
            volatility: 0.001, // 0.1% volatility
        }
    }
}

impl MarketDataProvider for SimulatedMarketDataProvider {
    fn get_latest_data(&self) -> MarketData {
        self.data.lock().unwrap().clone()
    }
    
    fn update(&self) {
        let mut data = self.data.lock().unwrap();
        let mut rng = rand::thread_rng();
        
        // Simulate price movement
        let price_change = data.last_price * self.volatility * (rng.gen::<f64>() * 2.0 - 1.0);
        let new_price = data.last_price + price_change;
        
        // Update market data
        data.last_price = new_price;
        data.bid = new_price - rng.gen::<f64>() * 2.0; // Random spread
        data.ask = new_price + rng.gen::<f64>() * 2.0;
        data.volume += rng.gen::<f64>() * 10.0;
        data.timestamp = Utc::now();
    }
}`,
        language: 'rust'
      },
      'strategy.rs': {
        content: `use crate::market_data::MarketData;
use crate::order::Side;
use std::collections::VecDeque;

#[derive(Debug)]
pub struct Signal {
    pub side: Side,
    pub size: f64,
    pub confidence: f64,
}

pub trait Strategy {
    fn generate_signal(&mut self, market_data: &MarketData) -> Signal;
}

pub struct SimpleMovingAverageStrategy {
    short_period: usize,
    long_period: usize,
    price_history: VecDeque<f64>,
}

impl SimpleMovingAverageStrategy {
    pub fn new(short_period: usize, long_period: usize) -> Self {
        SimpleMovingAverageStrategy {
            short_period,
            long_period,
            price_history: VecDeque::with_capacity(long_period + 1),
        }
    }
    
    fn calculate_sma(&self, period: usize) -> Option<f64> {
        if self.price_history.len() < period {
            return None;
        }
        
        let sum: f64 = self.price_history
            .iter()
            .rev()
            .take(period)
            .sum();
            
        Some(sum / period as f64)
    }
}

impl Strategy for SimpleMovingAverageStrategy {
    fn generate_signal(&mut self, market_data: &MarketData) -> Signal {
        // Add latest price to history
        self.price_history.push_back(market_data.last_price);
        
        // Maintain history size
        if self.price_history.len() > self.long_period {
            self.price_history.pop_front();
        }
        
        // Default signal (no trade)
        let mut signal = Signal {
            side: Side::Buy,
            size: 0.0,
            confidence: 0.0,
        };
        
        // Calculate moving averages
        if let (Some(short_sma), Some(long_sma)) = (
            self.calculate_sma(self.short_period),
            self.calculate_sma(self.long_period)
        ) {
            // Simple crossover strategy
            if short_sma > long_sma {
                // Bullish signal
                signal.side = Side::Buy;
                signal.size = 0.1; // Fixed size for simplicity
                signal.confidence = (short_sma - long_sma) / long_sma;
            } else if short_sma < long_sma {
                // Bearish signal
                signal.side = Side::Sell;
                signal.size = 0.1; // Fixed size for simplicity
                signal.confidence = (long_sma - short_sma) / long_sma;
            }
            
            println!("SMA Signal: Short={:.2}, Long={:.2}, Side={:?}, Confidence={:.4}", 
                     short_sma, long_sma, signal.side, signal.confidence);
        } else {
            println!("Not enough data for SMA calculation");
        }
        
        signal
    }
}`,
        language: 'rust'
      }
    },
    features: [
      'Ultra-low latency trading architecture',
      'Moving average crossover strategy implementation',
      'Risk management system with position limits',
      'Simulated market data provider for testing',
      'Execution engine with performance metrics',
      'Thread-safe design with proper synchronization'
    ],
    useCase: 'For financial firms and traders who need high-performance automated trading systems with microsecond latency.',
    techStack: ['Rust', 'Chrono', 'Rand', 'Multithreading', 'Lock-free algorithms']
  },
  {
    id: 'rust-webassembly',
    name: 'Rust WebAssembly App',
    description: 'Web application with Rust compiled to WebAssembly for high performance',
    category: 'web',
    subcategory: 'wasm',
    difficulty: 'Advanced',
    tags: ['Rust', 'WebAssembly', 'Web', 'Performance'],
    icon: Globe,
    estimatedTime: '75 minutes',
    files: {
      'lib.rs': {
        content: `use wasm_bindgen::prelude::*;
use web_sys::{console, CanvasRenderingContext2d};
use js_sys::Math;

// When the wasm module is instantiated
#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    // Use console.log to display a message
    console::log_1(&"WebAssembly module initialized".into());
    Ok(())
}

// Exported function that can be called from JavaScript
#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

// A more complex example: Mandelbrot set renderer
#[wasm_bindgen]
pub fn render_mandelbrot(
    ctx: &CanvasRenderingContext2d,
    width: u32,
    height: u32,
    x_min: f64,
    x_max: f64,
    y_min: f64,
    y_max: f64,
    max_iterations: u32,
) {
    // Performance measurement
    let start = web_sys::window()
        .unwrap()
        .performance()
        .unwrap()
        .now();
    
    // Clear the canvas
    ctx.clear_rect(0.0, 0.0, width as f64, height as f64);
    
    for px in 0..width {
        for py in 0..height {
            // Map pixel coordinates to complex plane
            let x = x_min + (x_max - x_min) * (px as f64) / (width as f64);
            let y = y_min + (y_max - y_min) * (py as f64) / (height as f64);
            
            // Compute the Mandelbrot value for this point
            let value = mandelbrot(x, y, max_iterations);
            
            // Map the value to a color
            let color = if value == max_iterations {
                "#000000" // Black for points in the set
            } else {
                // Colorful gradient for points outside the set
                let hue = (value as f64 * 360.0 / max_iterations as f64) % 360.0;
                &format!("hsl({}, 100%, 50%)", hue)
            };
            
            // Draw the pixel
            ctx.set_fill_style(&JsValue::from_str(color));
            ctx.fill_rect(px as f64, py as f64, 1.0, 1.0);
        }
    }
    
    // Log performance
    let end = web_sys::window()
        .unwrap()
        .performance()
        .unwrap()
        .now();
    console::log_1(&format!("Mandelbrot rendered in {}ms", end - start).into());
}

// Helper function to compute the Mandelbrot value for a point
fn mandelbrot(cx: f64, cy: f64, max_iterations: u32) -> u32 {
    let mut x = 0.0;
    let mut y = 0.0;
    let mut iteration = 0;
    
    while x*x + y*y <= 4.0 && iteration < max_iterations {
        let x_new = x*x - y*y + cx;
        y = 2.0*x*y + cy;
        x = x_new;
        iteration += 1;
    }
    
    iteration
}

// A struct to demonstrate more complex data handling
#[wasm_bindgen]
pub struct Particle {
    x: f64,
    y: f64,
    vx: f64,
    vy: f64,
    radius: f64,
    color: String,
}

#[wasm_bindgen]
impl Particle {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64, radius: f64) -> Particle {
        let vx = (Math::random() * 2.0 - 1.0) * 2.0;
        let vy = (Math::random() * 2.0 - 1.0) * 2.0;
        
        Particle {
            x,
            y,
            vx,
            vy,
            radius,
            color: format!("hsl({}, 70%, 50%)", Math::random() * 360.0),
        }
    }
    
    pub fn update(&mut self, width: f64, height: f64) {
        // Update position
        self.x += self.vx;
        self.y += self.vy;
        
        // Bounce off walls
        if self.x - self.radius < 0.0 || self.x + self.radius > width {
            self.vx = -self.vx;
        }
        
        if self.y - self.radius < 0.0 || self.y + self.radius > height {
            self.vy = -self.vy;
        }
    }
    
    pub fn draw(&self, ctx: &CanvasRenderingContext2d) {
        ctx.begin_path();
        ctx.set_fill_style(&JsValue::from_str(&self.color));
        ctx.arc(self.x, self.y, self.radius, 0.0, std::f64::consts::PI * 2.0)
            .unwrap();
        ctx.fill();
    }
    
    // Getters
    pub fn x(&self) -> f64 { self.x }
    pub fn y(&self) -> f64 { self.y }
    pub fn radius(&self) -> f64 { self.radius }
}`,
        language: 'rust'
      },
      'index.js': {
        content: `import init, { fibonacci, render_mandelbrot, Particle } from './pkg/rust_wasm_app.js';

// Initialize the WebAssembly module
async function run() {
  // Load the WASM file
  await init();
  
  console.log("WASM module loaded!");
  
  // Test the fibonacci function
  console.log("Fibonacci(10) =", fibonacci(10));
  
  // Set up the Mandelbrot canvas
  const mandelbrotCanvas = document.getElementById('mandelbrot-canvas');
  const ctx = mandelbrotCanvas.getContext('2d');
  
  // Render the Mandelbrot set
  const renderButton = document.getElementById('render-button');
  renderButton.addEventListener('click', () => {
    const width = mandelbrotCanvas.width;
    const height = mandelbrotCanvas.height;
    
    // Get values from inputs
    const xMin = parseFloat(document.getElementById('x-min').value);
    const xMax = parseFloat(document.getElementById('x-max').value);
    const yMin = parseFloat(document.getElementById('y-min').value);
    const yMax = parseFloat(document.getElementById('y-max').value);
    const iterations = parseInt(document.getElementById('iterations').value);
    
    console.time('mandelbrot');
    render_mandelbrot(ctx, width, height, xMin, xMax, yMin, yMax, iterations);
    console.timeEnd('mandelbrot');
  });
  
  // Set up the particle animation
  const particleCanvas = document.getElementById('particle-canvas');
  const particleCtx = particleCanvas.getContext('2d');
  const width = particleCanvas.width;
  const height = particleCanvas.height;
  
  // Create particles
  const particles = [];
  const particleCount = 100;
  
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 2 + Math.random() * 5;
    particles.push(new Particle(x, y, radius));
  }
  
  // Animation loop
  function animate() {
    particleCtx.clearRect(0, 0, width, height);
    
    for (const particle of particles) {
      particle.update(width, height);
      particle.draw(particleCtx);
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

run().catch(console.error);`,
        language: 'javascript'
      },
      'index.html': {
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rust WebAssembly Demo</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
      color: #333;
    }
    
    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 40px;
    }
    
    .demo-section {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      color: #3498db;
      margin-top: 0;
    }
    
    canvas {
      display: block;
      margin: 20px auto;
      background-color: #000;
      border-radius: 4px;
    }
    
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .control-group {
      flex: 1;
      min-width: 150px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background-color: #2980b9;
    }
    
    .performance {
      margin-top: 20px;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h1>Rust WebAssembly Demo</h1>
  
  <div class="demo-section">
    <h2>Mandelbrot Set Renderer</h2>
    <p>This demo renders the Mandelbrot set using Rust compiled to WebAssembly for high performance.</p>
    
    <div class="controls">
      <div class="control-group">
        <label for="x-min">X Min:</label>
        <input type="number" id="x-min" value="-2.0" step="0.1">
      </div>
      
      <div class="control-group">
        <label for="x-max">X Max:</label>
        <input type="number" id="x-max" value="1.0" step="0.1">
      </div>
      
      <div class="control-group">
        <label for="y-min">Y Min:</label>
        <input type="number" id="y-min" value="-1.5" step="0.1">
      </div>
      
      <div class="control-group">
        <label for="y-max">Y Max:</label>
        <input type="number" id="y-max" value="1.5" step="0.1">
      </div>
      
      <div class="control-group">
        <label for="iterations">Max Iterations:</label>
        <input type="number" id="iterations" value="100" min="10" max="1000">
      </div>
    </div>
    
    <button id="render-button">Render Mandelbrot</button>
    
    <canvas id="mandelbrot-canvas" width="800" height="600"></canvas>
    
    <div class="performance">
      <div id="mandelbrot-performance">Render time will appear here</div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>Particle Animation</h2>
    <p>This demo shows animated particles with physics calculated in Rust.</p>
    
    <canvas id="particle-canvas" width="800" height="400"></canvas>
  </div>
  
  <script type="module" src="./index.js"></script>
</body>
</html>`,
        language: 'html'
      },
      'Cargo.toml': {
        content: `[package]
name = "rust-wasm-app"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2.84"
js-sys = "0.3.61"
web-sys = { version = "0.3.61", features = [
  "console",
  "Window",
  "Document",
  "HtmlCanvasElement",
  "CanvasRenderingContext2d",
  "Performance",
]}

[profile.release]
opt-level = 3
lto = true
codegen-units = 1`,
        language: 'toml'
      }
    },
    features: [
      'Rust code compiled to WebAssembly',
      'High-performance Mandelbrot set renderer',
      'Interactive particle physics simulation',
      'Bidirectional Rust-JavaScript communication',
      'Optimized for maximum performance',
      'Responsive UI with real-time updates'
    ],
    useCase: 'Ideal for web applications that need near-native performance for computationally intensive tasks.',
    techStack: ['Rust', 'WebAssembly', 'wasm-bindgen', 'JavaScript', 'Canvas API']
  },
  {
    id: 'rust-tauri-chat',
    name: 'Tauri Chat App',
    description: 'A cross-platform chat app using React Native frontend and a Rust (Tauri) backend for secure, fast messaging.',
    icon: Smartphone,
    category: 'mobile',
    subcategory: 'chat',
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
    subcategory: 'todo',
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
    subcategory: 'social',
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
  },
  {
    id: 'rust-hft-crypto-arbitrage',
    name: 'Rust Crypto Arbitrage Bot',
    description: 'A high-frequency crypto arbitrage bot with a Rust backend and real-time exchange connectors.',
    icon: Zap,
    category: 'hft',
    subcategory: 'crypto',
    difficulty: 'Expert',
    tags: ['rust', 'hft', 'crypto', 'arbitrage', 'binance', 'coinbase'],
    estimatedTime: '180 minutes',
    files: {
      'main.rs': {
        content: `mod exchanges;
mod arbitrage;
mod config;

use exchanges::{binance::BinanceClient, coinbase::CoinbaseClient, ExchangeClient};
use arbitrage::find_arbitrage;
use config::Config;

fn main() {
    let config = Config::load("config.yaml");
    let binance = BinanceClient::new(&config.binance_api_key, &config.binance_secret);
    let coinbase = CoinbaseClient::new(&config.coinbase_api_key, &config.coinbase_secret);

    loop {
        let binance_book = binance.get_order_book("BTCUSDT");
        let coinbase_book = coinbase.get_order_book("BTC-USD");
        if let Some(opportunity) = find_arbitrage(&binance_book, &coinbase_book) {
            println!("Arbitrage opportunity: {:?}", opportunity);
            // Place orders here...
        }
        std::thread::sleep(std::time::Duration::from_millis(100));
    }
}`,
        language: 'rust'
      },
      'arbitrage.rs': {
        content: `use crate::exchanges::OrderBook;

pub struct ArbitrageOpportunity {
    pub buy_exchange: String,
    pub sell_exchange: String,
    pub profit: f64,
}

pub fn find_arbitrage(book1: &OrderBook, book2: &OrderBook) -> Option<ArbitrageOpportunity> {
    if book1.best_ask < book2.best_bid {
        Some(ArbitrageOpportunity {
            buy_exchange: book1.exchange.clone(),
            sell_exchange: book2.exchange.clone(),
            profit: book2.best_bid - book1.best_ask,
        })
    } else if book2.best_ask < book1.best_bid {
        Some(ArbitrageOpportunity {
            buy_exchange: book2.exchange.clone(),
            sell_exchange: book1.exchange.clone(),
            profit: book1.best_bid - book2.best_ask,
        })
    } else {
        None
    }
}`,
        language: 'rust'
      },
      'config.yaml': {
        content: `binance_api_key: "your-binance-key"
binance_secret: "your-binance-secret"
coinbase_api_key: "your-coinbase-key"
coinbase_secret: "your-coinbase-secret"
`,
        language: 'yaml'
      }
    },
    features: [
      'Multi-exchange real-time order book sync',
      'Arbitrage opportunity detection',
      'Ultra-low latency execution',
      'Risk management and logging',
      'Dockerized deployment'
    ],
    useCase: 'For traders and quants who want to exploit price differences across crypto exchanges.',
    techStack: ['Rust', 'Tokio', 'WebSockets', 'REST API', 'Docker']
  },
  {
    id: 'rust-hft-market-maker',
    name: 'Rust Market Maker',
    description: 'A market making bot for crypto/forex with a Rust backend, featuring custom quoting and inventory management.',
    icon: Zap,
    category: 'hft',
    subcategory: 'market-making',
    difficulty: 'Expert',
    tags: ['rust', 'hft', 'market-making', 'liquidity', 'crypto'],
    estimatedTime: '150 minutes',
    files: {
      'main.rs': {
        content: `mod market;
mod inventory;
mod quoting;

use market::MarketData;
use inventory::InventoryManager;
use quoting::Quoter;

fn main() {
    let mut inventory = InventoryManager::new(100.0); // max position size
    let mut quoter = Quoter::new(0.01); // 1% spread

    loop {
        let market_data = MarketData::fetch("BTCUSD");
        let (bid, ask) = quoter.quote(&market_data, inventory.position());
        println!("Quoting: bid={} ask={}", bid, ask);

        // Simulate fills and update inventory
        inventory.update(market_data.last_price);
        std::thread::sleep(std::time::Duration::from_millis(100));
    }
}`,
        language: 'rust'
      },
      'inventory.rs': {
        content: `pub struct InventoryManager {
    position: f64,
    max_position: f64,
}

impl InventoryManager {
    pub fn new(max_position: f64) -> Self {
        Self { position: 0.0, max_position }
    }

    pub fn update(&mut self, fill_price: f64) {
        // Simulate random fills
        self.position += (rand::random::<f64>() - 0.5) * 0.1;
        if self.position > self.max_position {
            self.position = self.max_position;
        }
        if self.position < -self.max_position {
            self.position = -self.max_position;
        }
        println!("Current position: {}", self.position);
    }

    pub fn position(&self) -> f64 {
        self.position
    }
}`,
        language: 'rust'
      },
      'quoting.rs': {
        content: `use crate::market::MarketData;

pub struct Quoter {
    spread: f64,
}

impl Quoter {
    pub fn new(spread: f64) -> Self {
        Self { spread }
    }

    pub fn quote(&self, market: &MarketData, position: f64) -> (f64, f64) {
        let mid = market.last_price;
        let bid = mid * (1.0 - self.spread / 2.0);
        let ask = mid * (1.0 + self.spread / 2.0);
        (bid, ask)
    }
}`,
        language: 'rust'
      }
    },
    features: [
      'Custom quoting logic',
      'Inventory/risk management',
      'Real-time PnL tracking',
      'Exchange simulator for backtesting',
      'Metrics dashboard'
    ],
    useCase: 'For liquidity providers and algorithmic traders.',
    techStack: ['Rust', 'Actix', 'WebSockets', 'Prometheus', 'Grafana']
  },
  {
    id: 'rust-hft-twap-twap',
    name: 'Rust TWAP/VWAP Execution Bot',
    description: 'A Rust-powered execution bot for TWAP/VWAP strategies, ideal for institutional trading.',
    icon: Zap,
    category: 'hft',
    subcategory: 'execution',
    difficulty: 'Advanced',
    tags: ['rust', 'hft', 'twap', 'vwap', 'execution', 'trading'],
    estimatedTime: '120 minutes',
    files: {
      'main.rs': {
        content: `mod twap;
mod vwap;
mod exchange;

use twap::TwapExecutor;
use vwap::VwapExecutor;
use exchange::Exchange;

fn main() {
    let exchange = Exchange::connect("BINANCE");
    let mut twap = TwapExecutor::new(exchange.clone(), 100.0, 10); // 100 units over 10 intervals
    let mut vwap = VwapExecutor::new(exchange, 100.0, 10);

    twap.execute();
    vwap.execute();
}`,
        language: 'rust'
      },
      'twap.rs': {
        content: `use crate::exchange::Exchange;

pub struct TwapExecutor {
    exchange: Exchange,
    total_qty: f64,
    intervals: usize,
}

impl TwapExecutor {
    pub fn new(exchange: Exchange, total_qty: f64, intervals: usize) -> Self {
        Self { exchange, total_qty, intervals }
    }

    pub fn execute(&mut self) {
        let qty_per_interval = self.total_qty / self.intervals as f64;
        for i in 0..self.intervals {
            self.exchange.send_order(qty_per_interval);
            println!("TWAP: Sent order {} of {}", i + 1, self.intervals);
            std::thread::sleep(std::time::Duration::from_secs(1));
        }
    }
}`,
        language: 'rust'
      },
      'vwap.rs': {
        content: `use crate::exchange::Exchange;

pub struct VwapExecutor {
    exchange: Exchange,
    total_qty: f64,
    intervals: usize,
}

impl VwapExecutor {
    pub fn new(exchange: Exchange, total_qty: f64, intervals: usize) -> Self {
        Self { exchange, total_qty, intervals }
    }

    pub fn execute(&mut self) {
        // For demo, just split equally
        let qty_per_interval = self.total_qty / self.intervals as f64;
        for i in 0..self.intervals {
            self.exchange.send_order(qty_per_interval);
            println!("VWAP: Sent order {} of {}", i + 1, self.intervals);
            std::thread::sleep(std::time::Duration::from_secs(1));
        }
    }
}`,
        language: 'rust'
      },
      'exchange.rs': {
        content: `#[derive(Clone)]
pub struct Exchange {
    name: String,
}

impl Exchange {
    pub fn connect(name: &str) -> Self {
        println!("Connected to exchange: {}", name);
        Self { name: name.to_string() }
    }

    pub fn send_order(&self, qty: f64) {
        println!("Order sent to {}: qty={}", self.name, qty);
    }
}`,
        language: 'rust'
      }
    },
    features: [
      'TWAP/VWAP algorithmic execution',
      'Exchange adapters (Binance, Coinbase, etc.)',
      'Order slicing and scheduling',
      'Execution quality analytics',
      'Configurable via YAML/JSON'
    ],
    useCase: 'For funds and desks needing advanced order execution.',
    techStack: ['Rust', 'Serde', 'Tokio', 'YAML', 'REST API']
  },
];