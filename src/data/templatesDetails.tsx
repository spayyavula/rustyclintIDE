// Project Templates Data
// This file contains template definitions for various project types

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
export const TEMPLATES = [
  {
    id: 'android-hello-world',
    name: 'Android Hello World',
    description: 'A simple Android Hello World app with complete deployment pipeline to Google Play Store',
    category: 'mobile',
    subcategory: 'android',
    difficulty: 'Beginner',
    tags: ['Android', 'Kotlin', 'Deployment', 'Google Play'],
    icon: 'Smartphone',
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
  }
];
// In templates.jsx
//const templates = [/* ... */];
export default TEMPLATES;