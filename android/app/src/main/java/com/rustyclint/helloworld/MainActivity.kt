package com.rustyclint.helloworld

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
}