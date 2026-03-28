# My Health Tracker (v1.0)

A full-stack mobile application built with **React Native (Expo)** and a **Node.js/Express** backend. It is specifically designed to help users track health events, such as seizure logging and monitoring, with a streamlined interface for recording details and managing history.

---

## 🚀 Key Features

* **Real-time Event Logging**: Record health events quickly with precise timestamps and dates.
* **Detailed Event Capture**: Capture critical information for each event, including:
    * **Type and Severity**: Categorize the nature and intensity of the health event.
    * **Triggers and Symptoms**: Document potential causes and physical experiences.
    * **Location and Duration**: Track where the event occurred and how long it lasted.
* **Event History & Management**: View a complete chronological list of past logs with options to edit or delete entries.
* **Seamless Navigation**: Built using **React Navigation** for a smooth flow between the dashboard, logging screens, and history.
* **Full-Stack Architecture**:
    * **Mobile Frontend**: Developed with React Native and Expo for cross-platform compatibility.
    * **RESTful API**: A Node.js and Express backend handles all data communication.
    * **Database**: MongoDB (via Mongoose) provides scalable storage for all health records.

---

## 🛠 Installation

### Prerequisites
* **Node.js** and **npm**
* **Expo CLI**
* **MongoDB** (Local or Atlas instance)

### Backend Setup
1.  Navigate to the server directory: `cd server`.
2.  Install dependencies: `npm install`.
3.  Configure environment variables: Create a `.env` file with your `MONGO_URI` and `PORT`.
4.  Start the server: `npm start` or `node server.js`.

### Mobile Setup
1.  Navigate to the root directory: `cd ..`
2.  Install dependencies: `npm install`.
3.  Update API configuration: Set your backend URL in `src/services/api.js`.
4.  Launch the app: `npx expo start`.

---

## 📖 How to Use

1.  **Dashboard**: Launch the app to see the main summary and quick-access action buttons.
2.  **Log an Event**: Tap "Record" to start the multi-step process, including time selection and detail confirmation.
3.  **Review History**: Visit the "List" screen to view all recorded events organized by date.
4.  **Edit/Delete**: Select any entry from the history list to modify its details or remove it entirely.

---

## ⚙️ Technical Overview

* **Frontend**: React Native, Expo, React Navigation, Axios.
* **Backend**: Node.js, Express, Mongoose, Dotenv, Cors.
* **State Management**: Uses React Context API (`SeizureContext`) for global application state.
* **API Layer**: Modular service files handle clean communication between the mobile app and the server.

---

## 🏷️ Suggested Topics

`react-native` `expo` `nodejs` `express-js` `mongodb` `health-tracker` `mobile-app` `full-stack-javascript` `seizure-tracker` `medical-logging` `rest-api` `context-api`

---

**Author**: D Kandekore  
**Version**: 1.0.0
