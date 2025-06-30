# 🎓 TalentPath – Learning Management System

TalentPath is a full-featured MERN stack-based online learning platform that connects students and instructors through intuitive interfaces and modern technologies.

## ✨ Live Demo
👉 [Visit Live](https://talentpath-frontend.onrender.com/)

---

## 👨‍🎓 Student Features

- 🔍 Search and browse available courses  
- 💳 Purchase courses using **eSewa**  
- 📈 Track course progress and mark lectures as completed  
- 🎓 View enrolled courses with progress & completion status  
- 🧑‍💻 Update personal profile  

---

## 👨‍🏫 Instructor Features

- ➕ Create new courses with title, description & video lectures  
- 📤 Upload videos using **Cloudinary**  
- 📚 Publish or unpublish courses  
- 📊 Dashboard for sales & engagement using **Recharts**  
- ✍️ Write course content using **React-Quill**  
- 🧑‍💻 Update personal profile  

---

## 🧱 Project Structure

- frontend # React + Vite client
-  backend # Node.js + Express API

---

## 🔧 Technologies Used

- **Frontend**: React + Vite + TailwindCSS + Zustand + shadcn/ui  
- **Backend**: Node.js + Express + MongoDB + Multer + Cloudinary  
- **Authentication**: JWT  
- **Payments**: eSewa  
- **Security**: CryptoJS  
- **Rich Text Editor**: React-Quill  
- **Charts**: Recharts  

---

## 📦 Environment Variables

### Frontend `.env`

```env
VITE_BACKEND_URL=
VITE_ESEWA_SECRET=
```

### Backend `.env`

```env
MONGODB_URI=
VITE_FRONTEND_URL=
JWT_SECRET_KEY=
NODE_ENV=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
CLOUDINARY_NAME=
ESEWA_SECRET=
```

## 🛠️ Getting Started

### 1. Clone the Repository

git clone https://github.com/sujitbarnawal/LMS.git
cd talentpath

### 2. Setup Frontend

- cd frontend
- npm install
- Create .env file and add necessary variables given above
- npm run dev

### 3. Setup Backend

- cd backend
- npm install
- Create .env file and add necessary variables given above
- npm run server

## 📸 Screenshots

### Home page and Login page
![image](https://github.com/user-attachments/assets/fc2c75bd-b833-46ba-bb42-9220b40406ac)
![image](https://github.com/user-attachments/assets/27e1d1ef-2112-488c-939f-b72f7b89b0f2)

### For Instructor 
![image](https://github.com/user-attachments/assets/69ae7ae5-a78b-4f9e-be41-3a00f235f936)
![image](https://github.com/user-attachments/assets/7a2fe38d-69d4-4866-a8cc-488ef536f4b4)
![image](https://github.com/user-attachments/assets/0f51443c-cd01-4847-a62a-102bdfac3b4f)

### For Student 
![image](https://github.com/user-attachments/assets/7fb84195-7e07-46fa-9d0b-13e605b6af69)
![image](https://github.com/user-attachments/assets/cfbfeff5-3fe0-44fa-8081-b76dd9b28d21)
![image](https://github.com/user-attachments/assets/03e95403-b3c2-4bba-b871-f9620c041889)
![image](https://github.com/user-attachments/assets/a5ce4f52-e35a-4210-92fb-b6b21665582d)
![image](https://github.com/user-attachments/assets/c6896c84-87bd-4507-8f5f-797022fd30b0)
![image](https://github.com/user-attachments/assets/fb2c2ad0-7816-493c-8a9e-9b1f064a4397)

## 🤝 Contributions

Feel free to fork this repository and make contributions. Pull requests are welcome and appreciated!
