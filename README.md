# React + Vite
AutoMailr - Email Marketing Sequence Builder
Overview
AutoMailr is a visual email marketing sequence builder developed using the MERN stack. It allows users to create automated email sequences using a flowchart-based interface. The backend uses Agenda and Nodemailer for scheduling and sending emails.

Features Implemented
Frontend (React & ReactFlow)
•	Flowchart Interface: Users can add and remove nodes for:
o	Cold Email
o	Wait/Delay
o	Lead Source
•	Saving & Loading Sequences:
o	Implemented functionality to save user-created sequences.
o	Sequences can be selected and displayed correctly from saved data.
•	User Interaction:
o	Users can select a lead source.
o	Users can schedule emails using a sequence.
•	ReactFlow Integration:
o	Dynamic node creation and deletion.
o	Custom node types for different functionalities.

Backend (Express, MongoDB, Nodemailer, Agenda)
•	API to Fetch Sequences: Implemented an endpoint to retrieve saved sequences.
•	API to Save Sequences: Implemented an endpoint to save sequences into MongoDB.

Technologies Used
•	Frontend: React, ReactFlow, Axios
•	Backend: Node.js, Express, MongoDB
•	Libraries: Nodemailer, Agenda, ReactFlow
Deployment
•	LINK OF LIVE PROJECT: https://curious-crisp-ddfa0f.netlify.app/
•	Frontend: Deployed on Netlify
•	Backend: Running on Render 
•	Database: MongoDB Atlas
GitHub 
•	Frontend: https://github.com/VAISHALI-NILE/AutoMailr-Frontend
•	Backend: https://github.com/VAISHALI-NILE/AutoMailr-Backend

Setup Instructions
Frontend
1. Clone the repository:
git clone <your-repo-link>
cd frontend
npm install
npm start

Backend
1. Clone the backend repository:
git clone <your-repo-link>
cd backend
npm install

2. Setup environment variables:
touch  .env

3. Add the following variables:
MONGO_URI=<your-mongo-db-uri>
PORT=prot_no

4. Start the backend server:
Node server.js


Video Link : https://drive.google.com/file/d/1uSv1JmgQt1Cle-VFywJQP5rdrZ0NTX_d/view?usp=sharing

