# BroCode - Collaborative Coding Platform

## Overview

**BroCode** is a cutting-edge collaborative coding platform designed for real-time code editing, project collaboration, and seamless interaction between developers. The platform provides an intuitive environment for teams to collaborate on coding projects with advanced features, including code analysis, debugging, real-time chat, and code completion recommendations.

BroCode integrates **WebSockets** for live editing, **Groq** for code analysis and debugging, **JDoodle** for compiling code, and includes a **room key system** for creating private collaborative spaces.

The platform operates on a **client-server architecture**, with a **Flask API** that powers the backend services and is deployed on **Render**. All API endpoints are rigorously tested using **Postman**. The websocket server has been deployed on glitch.

Deployed Site on Vercel: https://brocodee.vercel.app/

Server and API Code: https://github.com/JoshuxVro/BroCode-Server-Code

## Features

### 1. Real-Time Code Editing
BroCode allows users to edit code simultaneously in real-time. Changes made by one user are instantly reflected across all users in the same room.

### 2. Groq Chatbot
The platform features a **Groq-based chatbot** to assist users with coding questions, error fixes, and debugging insights.

### 3. Code Analysis and Debugging
Using **Groq**, BroCode provides advanced code analysis and error detection tools to help developers spot issues early and optimize their code.

### 4. Code Compiler (JDoodle)
BroCode integrates **JDoodle**, a third-party compiler, to run code in multiple programming languages and provide real-time feedback on syntax errors and runtime issues.

### 5. Code Completion Recommendations
The platform offers intelligent code completion suggestions to speed up coding and improve productivity.

### 6. Room Key System
Each user can create or join private collaboration rooms using a unique room key. This ensures secure and private coding sessions.

### 7. Voice Chat Feature
Utilizes websocket to create a roomcall to allow users working as a team to communicate with each other vocally.

### 7. Flask API & Client-Server Architecture
BroCode uses a **Flask API** to handle all backend logic, running on a scalable client-server architecture. The platform uses WebSockets for real-time communication and interaction between clients.

### 8. API Testing with Postman
All API endpoints are thoroughly tested using **Postman** to ensure reliability and performance.

### 9. Deployed on Render
The entire platform is hosted and deployed on **Render**, ensuring high availability and scalability for users.

## Technologies

* **Frontend**: HTML, CSS, JavaScript, WebSockets
* **Backend**: Flask (Python)
* **Real-Time Communication**: WebSockets
* **Code Analysis & Debugging**: Groq
* **Compiler**: JDoodle
* **API Testing**: Postman
* **Deployment**: Render
  
