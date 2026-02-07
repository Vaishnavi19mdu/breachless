🔐 Breachless — Secret Exposure Analyzer
<div align="center">

Awareness before compromise.

A modern web application that detects hardcoded secrets in your code before they leak to production.

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

Database Connection Strings

JWT Tokens

Private Cryptographic Keys

And more...

⚠️ Risk Analysis

Real-time scanning with severity levels (Critical, High, Medium, Low)

Line-by-line detection with masked previews

Overall risk assessment

📘 Educational Guidance

Plain-English explanations of what each secret does

Step-by-step remediation instructions

Links to security best practices

Guidance on using environment variables correctly

🎨 Modern UI

Clean, dark-themed interface

Animated 3D blob visualization

Fully responsive design

Smooth transitions and effects

🛠️ Getting Started
Prerequisites

Node.js v16 or higher

npm or yarn

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

This project is licensed under the MIT License.

🔒 Security Note

This tool performs client-side analysis only.
Your code never leaves your browser.

Best practices:

Use environment variables (.env files)

Add .env to .gitignore

Rotate compromised credentials immediately

Use dedicated secret management tools

<div align="center">

Made with care ❤️ by the Breachless Team

</div>
