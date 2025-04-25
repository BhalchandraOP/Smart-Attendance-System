# 🎓 Smart Attendance System

A real-time web-based attendance system using RFID, Node.js, MongoDB, Redis, and WebSocket. Tracks students’ entry and exit dynamically with live updates and a user-friendly interface.

![Smart Attendance System Banner](https://github.com/BhalchandraOP/Smart-Attendance-System/blob/main/banner.png?raw=true)

---

## ✨ Features

- 📡 Real-time attendance tracking using WebSocket
- 🎴 RFID-based scan system for student entry/exit
- 🧾 Attendance count and scan history tracking
- 📋 Add and manage students easily via UI
- 🌐 MongoDB for dynamic student data storage
- ⚡ Redis caching for optimized performance
- 💻 LCD/Hardware interface-ready

---

## 🖼️ Screenshots

| Live Dashboard | All Students Table |
|----------------|--------------------|
| ![Live](https://github.com/BhalchandraOP/Smart-Attendance-System/blob/main/Live_Info.png?raw=true) | ![Table](https://github.com/BhalchandraOP/Smart-Attendance-System/blob/main/all_student.jpg?raw=true) |

---

## 🔧 Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/BhalchandraOp/Smart-Attendance_System.git
cd Smart-Attendance_System
```

2. **Install dependencies:**
```bash
npm install
```
3. **Start MongoDB & Redis (make sure both are running locally or use cloud versions like Atlas/Redis Cloud).:**
4. **Run the app:**
```bash
nodemon server.js
```
5. **Open Frontend:**
-Just open index.html in your browser. Make sure it's allowed to connect to localhost:3000.

6. **📁 Folder Structure:**
```pgsql
Smart-Attendance_System/
├── models/
│   └── Student.js
├── public/
│   └── index.html
│   └── style.css
├── server.js
├── package.json
└── README.md
```
## 🚀 Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- WebSocket
- Redis (optional but recommended)
- HTML/CSS/JS (Vanilla frontend)
  
## 🙋‍♂️ Author
[Bhalchandra](https://github.com/BhalchandraOP)
For suggestions or queries, feel free to raise an issue or contact me!

## 📸 Screenshots
![HardWare Model](https://github.com/BhalchandraOP/Smart-Attendance-System/blob/main/model.jpg?raw=true)
![WEb Interface](https://github.com/BhalchandraOP/Smart-Attendance-System/blob/main/Screenshot_26-4-2025_1733_.jpeg?raw=true
)
