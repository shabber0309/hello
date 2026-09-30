# Deploying Live Fix to Render

This project is configured to deploy as a **single, unified service** on Render's Free tier (serving both the React Vite frontend and the Flask Python API on one domain with zero CORS complications).

---

## ⚡ Method 1: Automatic Blueprint (Easiest - 1 Click)

1. Push this repository to your GitHub:
   ```bash
   git push -u origin main
   ```
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** ➔ **Blueprint**.
4. Connect your GitHub repository:
   `https://github.com/Shabber10/Live-camera-monitored-hardware-and-software-service`
5. Render will automatically detect [`render.yaml`](file:///c:/Users/SHABBER%20HUSSAIN/Desktop/camfix/render.yaml) and configure:
   - **Build Command**: `chmod +x ./build.sh && ./build.sh`
   - **Start Command**: `gunicorn --chdir backend app:app --workers 2 --threads 4 --timeout 120`
   - **Health Check**: `/api/health`
6. Click **Apply**. Render will build the frontend, install backend dependencies, initialize the clean administrator account, and give you a live URL (e.g. `https://livefix-hardware.onrender.com`).

---

## 🛠️ Method 2: Manual Web Service Setup

If you prefer to configure it manually on Render:

1. Go to [Render Dashboard](https://dashboard.render.com/) ➔ **New +** ➔ **Web Service**.
2. Select your repository: `Live-camera-monitored-hardware-and-software-service`.
3. Configure the following settings:
   - **Name**: `livefix-app` (or any name you prefer)
   - **Region**: Closest to you (e.g., *Singapore* or *Oregon*)
   - **Branch**: `main`
   - **Root Directory**: *(Leave empty)*
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     chmod +x ./build.sh && ./build.sh
     ```
   - **Start Command**:
     ```bash
     gunicorn --chdir backend app:app --workers 2 --threads 4 --timeout 120
     ```
   - **Instance Type**: `Free`

4. In **Environment Variables**, add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `PYTHON_VERSION` | `3.11.9` | Ensures Python 3.11 compatibility |
   | `NODE_VERSION` | `22.14.0` | Node runtime to build React bundle |
   | `SECRET_KEY` | *(generate a random string)* | Flask session secret |
   | `JWT_SECRET_KEY` | *(generate a random string)* | JWT authentication secret |
   | `USE_MYSQL` | `false` | Uses SQLite out-of-the-box (or `true` if attaching MySQL) |
   | `FLASK_ENV` | `production` | Production mode |

5. Click **Create Web Service**.

---

## 🔑 Default Administrator Credentials on Render
When the application first boots on Render, the clean database is automatically initialized with:
- **Admin Username**: `admin`
- **Email**: `admin@livefix.com`
- **Password**: `admin123`
*(You can log in and change your password at `/login` or via the Admin Console).*
