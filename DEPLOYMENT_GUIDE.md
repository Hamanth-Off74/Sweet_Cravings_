# Deployment Guide for Your Sweet Cravings Web App

Deploying your Node.js application makes it accessible to everyone on the internet. Here’s a guide on how to deploy your project using Render, a popular and easy-to-use cloud platform.

## Pre-requisites

1.  **GitHub Account**: Your code needs to be on GitHub. It looks like you've already pushed your code, which is great!
2.  **MongoDB Atlas Account**: Your current application connects to a MongoDB database running on your local machine (`localhost`). For a live deployment, you need a cloud-hosted database. MongoDB Atlas offers a free tier that is perfect for this.
3.  **Render Account**: You will need a Render account to host the application.

---

## Step 1: Set Up Your Cloud Database with MongoDB Atlas

1.  **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2.  **Create a Free Cluster**: Follow the instructions to create a new, free-tier shared cluster. You can choose a cloud provider and region that is closest to you.
3.  **Database User and IP Access**:
    *   Under "Database Access", create a new database user. Remember the username and password.
    *   Under "Network Access", add your current IP address to the access list. To make it accessible from Render, you should add `0.0.0.0/0` (Allow Access From Anywhere).
4.  **Get Your Connection String**:
    *   Go to your cluster's "Overview" and click "Connect".
    *   Select "Connect your application".
    *   Choose "Node.js" as the driver and the latest version.
    *   Copy the connection string provided. It will look something like this:
        `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

---

## Step 2: Prepare Your Application for Deployment

Your application needs a small change to use the new MongoDB Atlas connection string when deployed.

1.  **Open `app.js`**.
2.  **Find the `mongoose.connect` line**.
3.  **Update it** to use an environment variable for the connection string. This keeps your database credentials secure.

    ```javascript
    // Replace this:
    mongoose.connect('mongodb://localhost:27017/sweetcravings', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB Connected Successfully'))
        .catch(err => console.log(err));

    // With this:
    const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetcravings';
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB Connected Successfully'))
        .catch(err => console.log(err));
    ```
This change tells your app: "If a `MONGODB_URI` is provided in the environment (like on Render), use it. Otherwise, for local development, use the `localhost` one."

---

## Step 3: Deploy on Render

1.  **Sign Up**: Go to [Render.com](https://render.com/) and create an account, preferably by linking your GitHub account.
2.  **Create a New Web Service**:
    *   On your Render dashboard, click **New +** and select **Web Service**.
    *   Connect your GitHub account and select your project repository.
3.  **Configure the Service**:
    *   **Name**: Give your service a name (e.g., `sweet-cravings-app`).
    *   **Region**: Choose a region close to you.
    *   **Branch**: Select your main branch (e.g., `main` or `master`).
    *   **Root Directory**: Leave this as is.
    *   **Runtime**: Select **Node**.
    *   **Build Command**: `npm install`
    *   **Start Command**: `node app.js`
    *   **Instance Type**: Choose the **Free** plan.
4.  **Add Environment Variables**:
    *   This is the most important step for connecting your app to the database and Razorpay.
    *   Under "Advanced", click **Add Environment Variable**. Add the following key-value pairs:
        *   **Key**: `MONGODB_URI`
        *   **Value**: Your MongoDB Atlas connection string from Step 1. **Remember to replace `<username>` and `<password>` with the database user credentials you created.**
        *   **Key**: `RAZORPAY_KEY_ID`
        *   **Value**: Your Razorpay Key ID.
        *   **Key**: `RAZORPAY_KEY_SECRET`
        *   **Value**: Your Razorpay Key Secret.
5.  **Deploy!**:
    *   Click **Create Web Service**.
    *   Render will automatically pull your code from GitHub, build it, and start your application. You can watch the progress in the deploy logs.
    *   Once it's live, Render will provide you with a public URL (like `https://your-app-name.onrender.com`) to access your deployed project.

Your website is now live! Any time you push new changes to your GitHub repository, Render will automatically redeploy the application with the latest version.
