# 🚀 Quick Start Guide

## For the Impatient Developer

### Option 1: Use the Start Script (Easiest)
```powershell
cd "c:\Users\Sun Tyres\OneDrive\Desktop\dessert web"
.\start-react-app.ps1
```

This will automatically:
- Check MongoDB
- Start backend server
- Start React frontend
- Open your browser

### Option 2: Manual Start (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd "c:\Users\Sun Tyres\OneDrive\Desktop\dessert web"
npm start
```

**Terminal 2 - Frontend:**
```bash
cd "c:\Users\Sun Tyres\OneDrive\Desktop\dessert web\client"
npm run dev
```

**Browser:**
Open http://localhost:3000

---

## 📋 Quick Reference

### Project URLs
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017

### Key Files
- **App Entry:** `client/src/App.jsx`
- **Backend:** `app.js`
- **Routes:** `routes/index.js`
- **Styles:** `client/public/css/style.css`
- **Cart Logic:** `client/src/context/CartContext.jsx`

### Commands

**Install Dependencies:**
```bash
npm install                      # Backend
cd client && npm install        # Frontend
```

**Development:**
```bash
npm start                        # Backend (nodemon)
cd client && npm run dev        # Frontend (vite)
```

**Build:**
```bash
cd client && npm run build      # Production build
```

**Test Payment:**
- Use Razorpay test mode (already configured)
- Test card: 4111 1111 1111 1111
- Any CVV and future expiry

### File Structure
```
client/src/
├── components/        # Reusable components
├── pages/            # Route pages
├── context/          # Global state
├── data/             # Static data
├── App.jsx           # Main app
└── main.jsx          # Entry point
```

### Common Tasks

**Add New Page:**
1. Create `client/src/pages/NewPage.jsx`
2. Add route in `client/src/App.jsx`
3. Add link in `Header.jsx` or `Footer.jsx`

**Add New API:**
1. Add route in `routes/index.js`
2. Create API call in component with axios

**Modify Styles:**
- Edit `client/public/css/style.css`

**Update Cart:**
- Use `useCart()` hook from CartContext

---

## 🎯 What You Have

✅ Full React frontend  
✅ Express REST API  
✅ MongoDB database  
✅ Razorpay payments  
✅ Cart with localStorage  
✅ User authentication UI  
✅ Admin panel  
✅ Responsive design  
✅ All original features  

## 📚 Learn More

- React: https://react.dev
- Vite: https://vitejs.dev
- React Router: https://reactrouter.com
- Express: https://expressjs.com
- MongoDB: https://mongodb.com

---

**🎉 You're all set! Happy coding!**
