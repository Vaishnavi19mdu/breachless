# 🛡️ Breachless - Secret Exposure Analyzer

<div align="center">
  
**Awareness before compromise.**

A modern web application that detects hardcoded secrets in your code before they leak to production.

</div>

---

## 🎯 What is Breachless?

Breachless is a secret detection tool that helps developers identify exposed credentials, API keys, and sensitive data in their code before committing to version control. Paste your code or configuration files and get instant feedback on potential security vulnerabilities.

## ✨ Features

### 🔍 **Comprehensive Secret Detection**
Detects 14+ types of secrets including:
- AWS Access & Secret Keys
- GitHub Personal Access Tokens
- Stripe API Keys
- Database Connection Strings
- JWT Tokens
- Private Cryptographic Keys
- And more...

### 📊 **Risk Analysis**
- Real-time scanning with severity levels (Critical, High, Medium, Low)
- Line-by-line detection with masked previews
- Overall risk assessment

### 🎓 **Educational Guidance**
- Plain-English explanations of what each secret does
- Step-by-step remediation instructions
- Links to security best practices
- How to use environment variables properly

### 🎨 **Modern UI**
- Clean, dark-themed interface
- Animated 3D blob visualization
- Responsive design
- Smooth transitions and effects

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   \\\ash
   git clone https://github.com/Vaishnavi19mdu/breachless.git
   cd breachless
   \\\

2. **Install dependencies**
   \\\ash
   npm install
   \\\

3. **Run the development server**
   \\\ash
   npm run dev
   \\\

4. **Open your browser**
   Navigate to \http://localhost:3000\

## 📁 Project Structure

\\\
breachless/
├── src/
│   ├── App.tsx
│   ├── Router.tsx
│   ├── Logo.tsx
│   ├── SecurityVisual.tsx
│   ├── index.tsx
│   └── analyze/
│       ├── AnalyzeExposure.tsx
│       ├── SecretDetector.ts
│       └── types.ts
├── public/
├── .gitignore
├── .env.example
├── package.json
└── README.md
\\\

## 🔒 How to Use

1. **Navigate to the Analyzer**
   - Click the "Analyze Exposure" button on the homepage

2. **Paste Your Code**
   - Copy code from your .env files, config files, or scripts
   - Paste into the text area

3. **Run Analysis**
   - Click "Analyze Code"
   - Wait 1-2 seconds for results

4. **Review Results**
   - See detected secrets with severity levels
   - Read explanations of what each secret does
   - Follow step-by-step remediation guides

## 🎨 Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **Build Tool**: Vite

## 🛠️ Development

### Available Scripts

- \
pm run dev\ - Start development server
- \
pm run build\ - Build for production
- \
pm run preview\ - Preview production build

### Adding New Secret Patterns

Edit \src/analyze/SecretDetector.ts\ and add to the \SECRET_PATTERNS\ array.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Security Note

This tool performs **client-side analysis only**. Your code never leaves your browser. However, always practice proper secret management:

- Use environment variables (.env files)
- Add .env to .gitignore
- Rotate compromised credentials immediately
- Use secret management tools

---

<div align="center">
Made with 🛡️ by the Breachless Team
</div>
