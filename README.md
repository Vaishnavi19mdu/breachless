# 🔐 Breachless — Secret Exposure Analyzer

<div align="center">

**Awareness before compromise.**

A modern web application that detects hardcoded secrets in your code before they leak to production.

[Live Demo](https://breachless.onrender.com/) | [Features](#features) | [Getting Started](#getting-started)

</div>

---

## 🚀 What is Breachless?

Breachless is a secret detection tool that helps developers identify exposed credentials, API keys, and sensitive data in their code before committing to version control.

Paste your code or configuration files and get instant feedback on potential security vulnerabilities.

---

## ✨ Features

### 🔎 Comprehensive Secret Detection

Detects 14+ types of secrets, including:
- AWS Access & Secret Keys
- GitHub Personal Access Tokens
- Stripe API Keys
- Database Connection Strings
- JWT Tokens
- Private Cryptographic Keys
- And more...

### ⚠️ Risk Analysis
- Real-time scanning with severity levels (Critical, High, Medium, Low)
- Line-by-line detection with masked previews
- Overall risk assessment

### 📘 Educational Guidance
- Plain-English explanations of what each secret does
- Step-by-step remediation instructions
- Links to security best practices
- Guidance on using environment variables correctly

### 🔐 Authentication System
- User registration and login
- Role-based access (Admin, Staff, User)
- Firebase Authentication integration
- Secure dashboard access

### 📊 Admin Dashboard
- View all contact form submissions
- Track user sign-ups and analytics
- Monitor secrets revealed count
- Manage response status
- User role management

### 🎨 Modern UI
- Clean, dark-themed interface
- Animated 3D blob visualization
- Fully responsive design
- Smooth transitions and effects

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Firebase account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vaishnavi19mdu/breachless.git
   cd breachless
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
   Create a `.env.local` file with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

---

## 🧪 How to Use

### For Regular Users
1. **Sign Up** - Create an account with email and password
2. **Navigate to Analyzer** - Click "Analyze Exposure" button
3. **Paste Your Code** - Copy code from .env files, config files, or scripts
4. **Run Analysis** - Click "Analyze Code" and wait 1-2 seconds
5. **Review Results** - See detected secrets with severity levels and remediation guides

### For Admin/Staff
1. **Login** - Use your admin/staff credentials
2. **Access Dashboard** - Automatically redirected to dashboard
3. **View Analytics** - See user sign-ups and contact submissions
4. **Manage Queries** - Respond to user contact form submissions
5. **Monitor Activity** - Track usage statistics and secrets revealed

---

## 📁 Project Structure

```
breachless/
├── public/
│   └── _redirects          # Routing config for deployment
├── src/
│   ├── analyze/            # Secret detection logic
│   ├── auth/               # Login/signup components
│   ├── context/            # Auth context
│   ├── dashboards/         # Admin & Staff dashboards
│   ├── firebase/           # Firebase configuration
│   ├── components/         # Reusable components
│   ├── App.tsx             # Main app component
│   └── Router.tsx          # Route configuration
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🧰 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Deployment**: Render

---

## 👨‍💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### User Roles

- **User**: Can use the secret analyzer tool
- **Staff**: Can view and respond to contact queries
- **Admin**: Full access to analytics, user management, and contact queries

### Promoting Users to Admin/Staff

1. Go to Firebase Console → Firestore Database
2. Navigate to the `users` collection
3. Find the user document (by UID)
4. Update the `role` field:
   - `"user"` - Regular user
   - `"staff"` - Staff member
   - `"admin"` - Administrator

### Adding New Secret Patterns

Edit `src/analyze/SecretDetector.ts` and add to the `SECRET_PATTERNS` array:

```typescript
{
  name: 'Your Secret Type',
  pattern: /your-regex-pattern/g,
  severity: 'critical',
  description: 'What this secret does',
  remediation: 'How to fix it'
}
```

---

## 🚀 Deployment

The app is deployed on **Render**.

**Live URL**: [https://breachless.onrender.com/](https://breachless.onrender.com/)

### Deploy Your Own

1. Fork this repository
2. Sign up at [render.com](https://render.com)
3. Create a new **Static Site**
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
6. Add environment variables (Firebase config)
7. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🔒 Security Note

⚠️ **This tool performs client-side analysis only.** Your code never leaves your browser.

### Best Practices:
- Use environment variables (`.env` files)
- Add `.env` to `.gitignore`
- Rotate compromised credentials immediately
- Use secret management tools (AWS Secrets Manager, HashiCorp Vault, etc.)
- Enable Firebase Security Rules to protect your database
- Never commit secrets to version control

---

## 🙏 Acknowledgments

- Built with React and Firebase
- UI inspired by modern security tools
- Secret detection patterns based on industry standards

---

<div align="center">

Made with 🛡️ by the Breachless Team

[Report Bug](https://github.com/Vaishnavi19mdu/breachless/issues) · [Request Feature](https://github.com/Vaishnavi19mdu/breachless/issues)

</div>
