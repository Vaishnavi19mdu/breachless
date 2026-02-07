🔐 Breachless — Secret Exposure Analyzer
<div align="center">

Awareness before compromise.

A modern web application that detects hardcoded secrets in your code before they leak to production.

[Live Demo](https://breachless.onrender.com/) | [Features](#features) | [Getting Started](#getting-started)

</div>
🚀 What is Breachless?

Breachless is a secret detection tool that helps developers identify exposed credentials, API keys, and sensitive data in their code before committing to version control.

Paste your code or configuration files and get instant feedback on potential security vulnerabilities.

✨ Features
🔎 Comprehensive Secret Detection

Detects 14+ types of secrets, including:

AWS Access & Secret Keys

GitHub Personal Access Tokens

Stripe API Keys

<<<<<<< HEAD
### Authentication System
- User registration and login
- Role-based access (Admin, Staff, User)
- Firebase Authentication integration
- Secure dashboard access

### Admin Dashboard
- View all contact form submissions
- Track user analytics and usage statistics
- Monitor secrets revealed count
- Manage response status

### Modern UI
- Clean, dark-themed interface
- Animated 3D graphics with Three.js
- Responsive design
- Smooth transitions and effects
=======
Database Connection Strings
>>>>>>> 4dad294388885aa335b125b270155a687692e967

JWT Tokens

<<<<<<< HEAD
### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account (for authentication)
=======
Private Cryptographic Keys
>>>>>>> 4dad294388885aa335b125b270155a687692e967

And more...

<<<<<<< HEAD
1. Clone the repository
```bash
git clone https://github.com/Vaishnavi19mdu/breachless.git
cd breachless
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
```bash
# Create .env.local file with your Firebase config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the development server
```bash
npm run dev
```

5. Open your browser and navigate to http://localhost:3000
=======
⚠️ Risk Analysis

Real-time scanning with severity levels (Critical, High, Medium, Low)

Line-by-line detection with masked previews

Overall risk assessment
>>>>>>> 4dad294388885aa335b125b270155a687692e967

📘 Educational Guidance

Plain-English explanations of what each secret does

Step-by-step remediation instructions

<<<<<<< HEAD
### For Regular Users
1. **Sign Up** - Create an account with email and password
2. **Navigate to Analyzer** - Click "Analyze Exposure" button
3. **Paste Your Code** - Copy code from .env files or scripts
4. **Run Analysis** - Click "Analyze Code"
5. **Review Results** - See detected secrets with remediation guides

### For Admin/Staff
1. **Login** - Use your credentials
2. **Access Dashboard** - View contact submissions and analytics
3. **Manage Queries** - Respond to user queries
4. **Monitor Usage** - Track secrets revealed and user activity
=======
Links to security best practices
>>>>>>> 4dad294388885aa335b125b270155a687692e967

Guidance on using environment variables correctly

<<<<<<< HEAD
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Deployment**: Render
=======
🎨 Modern UI
>>>>>>> 4dad294388885aa335b125b270155a687692e967

Clean, dark-themed interface

Animated 3D blob visualization

<<<<<<< HEAD
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### User Roles

- **User**: Can use the secret analyzer tool
- **Staff**: Can view and respond to contact queries
- **Admin**: Full access to analytics and user management

To promote a user to admin:
1. Go to Firebase Console → Firestore
2. Find the user document in `users` collection
3. Change `role` field from `staff` to `admin`

## Deployment

The app is deployed on Render.

Live at: https://breachless.onrender.com/
=======
Fully responsive design

Smooth transitions and effects

🛠️ Getting Started
Prerequisites
>>>>>>> 4dad294388885aa335b125b270155a687692e967

Node.js v16 or higher

npm or yarn

<<<<<<< HEAD
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
=======
Installation

Clone the repository

git clone https://github.com/Vaishnavi19mdu/breachless.git
cd breachless


Install dependencies

npm install


Run the development server

npm run dev


Open your browser

http://localhost:3000

📁 Project Structure

🧪 How to Use

Navigate to the Analyzer
Click the “Analyze Exposure” button on the homepage

Paste Your Code
Copy code from .env files, config files, or scripts

Run Analysis
Click “Analyze Code” and wait 1–2 seconds

Review Results
View detected secrets with severity levels and remediation guides

🧰 Tech Stack

Frontend: React + TypeScript

Styling: Tailwind CSS

3D Graphics: Three.js

Build Tool: Vite

👨‍💻 Development
Available Scripts

npm run dev — Start development server

npm run build — Build for production

npm run preview — Preview production build

Adding New Secret Patterns

Edit the following file and extend the SECRET_PATTERNS array:

src/analyze/SecretDetector.ts

🤝 Contributing

Contributions are welcome!
Feel free to open an issue or submit a Pull Request.

📄 License
>>>>>>> 4dad294388885aa335b125b270155a687692e967

This project is licensed under the MIT License.

🔒 Security Note

This tool performs client-side analysis only.
Your code never leaves your browser.

<<<<<<< HEAD
- Use environment variables (.env files)
- Add .env to .gitignore
- Rotate compromised credentials immediately
- Use secret management tools (AWS Secrets Manager, HashiCorp Vault)
- Enable Firebase Security Rules to protect your database

## Acknowledgments

- Built with React and Firebase
- UI inspired by modern security tools
- Secret detection patterns based on industry standards
=======
Best practices:
>>>>>>> 4dad294388885aa335b125b270155a687692e967

Use environment variables (.env files)

Add .env to .gitignore

Rotate compromised credentials immediately

Use dedicated secret management tools

<div align="center">

<<<<<<< HEAD
Made with 🛡️ by the Breachless Team

[Report Bug](https://github.com/Vaishnavi19mdu/breachless/issues) • [Request Feature](https://github.com/Vaishnavi19mdu/breachless/issues)

</div>
=======
Made with care ❤️ by the Breachless Team

</div>
>>>>>>> 4dad294388885aa335b125b270155a687692e967
