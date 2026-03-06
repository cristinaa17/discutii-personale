# Team 1:1 Discussions – HR Application

## Overview

This application is an internal HR tool used to manage team members and their 1:1 discussions.
It allows HR managers or team leads to store information about employees and track discussion notes.

The application is built using **Angular for the frontend** and **Node.js + Express for the backend**, with **SQLite** used as the database.

---

## Features

### Member Management

* Add new team members
* Edit member information
* Soft delete / restore members
* Upload profile photo (drag & drop or file upload)

### Discussions

* Add new 1:1 discussion notes
* Edit existing discussions
* Delete discussions
* View discussions per employee
* Search discussions globally

### Import

* Import members from Excel files
* Import discussions from Excel files

---

## Project Structure

```
project-root
│
├── backend
│   ├── db.js
│   ├── server.js
│   ├── hr.db
│   └── uploads
│
├── src
│   ├── app
│   │   ├── discussion-add
│   │   ├── discussion-list
│   │   ├── member-details
│   │   ├── member-form
│   │   ├── search-discussion-dialog
│   │   ├── team
│   │   └── models
│   │
│   ├── assets
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── angular.json
├── package.json
└── README.md
```

---

## Requirements

Make sure you have the following installed:

* Node.js **20 LTS or 22 LTS**
* npm

Check your version:

```
node -v
```

⚠️ Node **23 is not supported by Angular** and may produce warnings.

---

## Installation

Clone the repository:

```
git clone <repository-url>
```

Go to the project folder:

```
cd discutii-personale
```

Install frontend dependencies:

```
npm install
```

Install backend dependencies:

```
cd backend
npm install
```

---

## Running the Application

### Start the backend

```
cd backend
node server.js
```

Backend runs on:

```
http://localhost:3000
```

### Start the frontend

```
npm start
```

Frontend runs on:

```
http://localhost:4200
```
