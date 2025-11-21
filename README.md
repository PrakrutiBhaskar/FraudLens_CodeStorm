# FraudLens CodeStorm

**FraudLens CodeStorm** is a fraud-detection / analytics project. 
FraudLens is a lightweight fake-app detection system designed for the CodeStorm hackathon.
It focuses on identifying counterfeit / impersonator Android applications that mimic trusted brands (banks, UPI apps, wallets, e-commerce, etc.).

The system analyzes data from Google Play Store or APK mirror sites (mocked or scraped), extracts risk signals, and gives each app a Fraud Risk Score, along with evidence and an auto-generated takedown email.



## Table of Contents

1. [How to Run It](#how-to-run-it)  
2. [Mocked vs Real Data](#mocked-vs-real-data)  
3. [Example Commands](#example-commands)  



  ## How to Run It

Here are the steps to set up and run the FraudLens project on your machine:

1. **Clone the repository**  
   ```bash
   git clone https://github.com/PrakrutiBhaskar/FraudLens_CodeStorm.git
   cd FraudLens_CodeStorm



**Install dependencies**
```bash
# Example for Node.js backend
cd backend
npm install

# If there's a frontend (React or otherwise)
cd ../frontend
npm install
```


**Set up configuration / environment variables**

Create a ```.env``` file in the backend folder (or wherever required).

Add environment variables such as database URLs, API keys, etc.
For example:
```bash
DB_URL=your_database_url_here  
API_KEY=your_api_key  
```

 
 **Run the backend & frontend**
```bash
# In the backend folder
npm run dev  

# In the frontend folder
npm start
```


**Access the application**

The backend server might run on ```http://localhost:5000``` (or whichever port you configured)

The frontend UI may run on ```http://localhost:3000``` (or your configured port)



2.**Mocked vs Real Data**

**Mocked Data:**
Some parts of the application (for testing or demo) may use mock data — for example, pre-generated JSON payloads, dummy user profiles, or synthetic fraud cases. These are not real user data and are used so developers can test features without connecting to a production database.

**Real Data:**
In production or your real setup, the app should connect to a real database (SQL, NoSQL, or others) or real data sources (APIs or transaction feeds). You will need valid credentials and data connections configured via ```.env```.
Note: Be careful not to commit real credentials or sensitive data to your repository. Use ```.gitignore``` to prevent ```.env``` or other config files from being pushed.



3.**Example Commands**
```bash
# Clone the repo
git clone https://github.com/PrakrutiBhaskar/FraudLens_CodeStorm.git

# Install backend dependencies
cd FraudLens_CodeStorm/backend
npm install

# Start backend in development mode (auto-reload)
npm run dev

# Install frontend dependencies
cd ../frontend
npm install

# Start frontend app
npm start

# Run tests (if applicable)
cd ../backend
npm test

# Example API call (if backend has an endpoint /detect-fraud)
curl -X POST http://localhost:5000/api/detect-fraud \
  -H "Content-Type: application/json" \
  -d '{"transaction_amount": 1000, "user_id": "abc123", "transaction_time": "2025-11-21T12:00:00Z"}'
```




