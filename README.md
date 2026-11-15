# Apex Query

Apex Query is an AI-powered conversational web application that allows users to ask questions and receive intelligent responses through OpenAI. The application provides a ChatGPT-like interface where users can interact with AI without necessarily creating an account.

The platform supports both guest conversations and authenticated user sessions. Guest users can freely interact with the AI, but their conversation history is not stored. Users who sign up or log in can preserve their conversations and access their chat history.

## Features

- **AI-Powered Conversations:** Get intelligent responses to user queries through OpenAI integration.
- **Guest Chat:** Allows users to interact with the AI without signing up or logging in.
- **User Authentication:** Secure user registration and login functionality implemented using Passport.js.
- **Conversation History:** Authenticated users can preserve their conversations and access their previous chat history.
- **Guest Session Privacy:** Guest conversations are not permanently stored.
- **Database Integration:** MongoDB is used to manage user information and conversation data.
- **Cloud Database:** MongoDB Atlas is used for cloud-based database management.
- **Full-Stack Architecture:** Built using React for the frontend and Node.js with Express.js for the backend.

## Tech Stack

**Frontend**
- React.js

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- MongoDB Atlas

**Authentication**
- Passport.js

**AI Integration**
- OpenAI API

**Deployment**
- Render

## How It Works

1. Users visit Apex Query and can immediately start asking questions without creating an account.
2. The frontend sends user queries to the backend through API requests.
3. The backend communicates with the OpenAI API to generate responses.
4. The generated AI response is returned to the frontend and displayed in the chat interface.
5. Guest users can chat without having their conversation history permanently stored.
6. Registered users can sign up or log in using the authentication system implemented with Passport.js.
7. Authenticated users can save and access their conversation history through MongoDB.

## Authentication and Data Management

Apex Query provides two types of user experiences:

**Guest Users**

- Can access the application without registration.
- Can interact with the AI and ask questions.
- Conversation history is not permanently stored.

**Registered Users**

- Can create an account and log in.
- User authentication is handled using Passport.js.
- Can preserve their conversation history.
- Can access their previously stored conversations.

## Deployment

The application is deployed using Render, while MongoDB Atlas is used to host and manage the database in the cloud.

## Project Overview

Apex Query demonstrates the implementation of a full-stack AI-powered application by integrating React, Node.js, Express.js, MongoDB, Passport.js, and the OpenAI API.

The project focuses on AI integration, user authentication, guest access, conversation management, and full-stack web application development.

