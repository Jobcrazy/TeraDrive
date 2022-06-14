## Introduction
The source code for CRM system of TeraDrive Recovery Company ([https://teradrive.ca](https://teradrive.ca/))

## Development team
* **Backend Developer**: Hang Liu, Yixuan Pan
* **Backend Developer**: Yixuan Pan, Zichun Xu, Johnson Lau

## How this repo is organized
This project is divided into two parts: the frontend and the backend. They communicate with each other using JSON, and the source code is in the [backend branch](../../tree/backend) and the [frontend branch](../../tree/frontend) respectively.
* **Backend**: accepts and processes requests from the frontend
* **Frontend**: interacts with the end user, and communicates with the backend

## 3rd party packages (Node.js dependencies)
### Backend
*   config: 3.3.6
*   cookie-parser: 1.4.4
*   debug: 2.6.9
*   express: 4.16.1
*   express-session: 1.17.1
*   formidable: 1.2.2
*   morgan: 1.9.1
*   mysql: 2.18.1
*   request: 2.88.2 
### Frontend
*   antd: 4.16.9,
*   axios: 0.21.1
*   http-proxy-middleware: 2.0.1,
*   react: 17.0.2,
*   react-cookies: 0.1.1,
*   react-dom: 17.0.2,
*   react-router-dom: 5.2.0,
*   react-scripts: 5.0.0,
*   redux: 4.1.1,
*   web-vitals: 1.1.2

## How to assemble the development environment
### Preparation

* Download and install [Node.js (14.16.1 or above)](https://nodejs.org/)

### Backend

*  Execute the following commands in a CLI:
   ```
   cd /path/to/backend/
   npm install
   npm start
   ```
   the *3rd party dependencies* will be automatically installed, and the **backend** application is running now

### Frontend
*  Execute the following commands in a CLI:
   ```
   cd /path/to/frontend/
   npm install
   npm start
   ```
   the *3rd party dependencies* will be automatically installed, and the **frontend** application is running now

### Preview
1. Launch Chrome and visit the frontend: [http://localhost](http://localhost)
2. The backend API is on: [http://localhost:3000](http://localhost:3000)
