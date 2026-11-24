# Internship Board REST API

A REST API for managing internship records using Node.js, Express.js and SQLite.

## Technologies
- Node.js
- Express.js
- SQLite
- JavaScript

## Features
- Create internships
- Get all internships
- Get internship by ID
- Update internships
- Delete internships
- Input validation
- Pagination
- Persistent database storage

## Installation
npm install

## Run the server
npm run dev

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/internships | Get all internships |
| GET | /api/internships/:id | Get internship by ID |
| POST | /api/internships | Add internship |
| PUT | /api/internships/:id | Update internship |
| DELETE | /api/internships/:id | Delete internship |

## Pagination
/api/internships?page=1&limit=5

## Server
http://localhost:3000
