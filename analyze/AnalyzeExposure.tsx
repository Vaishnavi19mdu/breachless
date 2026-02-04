import { useState } from 'react';
import { SecretDetector } from './SecretDetector';
import { AnalysisResult, DetectedSecret } from './types';

export default function AnalyzeExposure() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);

    // Simulate network delay for realistic UX
    setTimeout(() => {
      const analysis = SecretDetector.analyzeCode(input);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500 border-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 border-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-blue-500 border-blue-500 bg-blue-500/10';
      default: return 'text-green-500 border-green-500 bg-green-500/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      default: return '🔵';
    }
  };

  const getSecretExplanation = (type: string) => {
    const explanations: Record<string, string> = {
      'AWS Access Key': 'A key that gives access to your Amazon Web Services account. Anyone with this can use your AWS resources and rack up charges.',
      'AWS Secret Key': 'The password for your AWS account. With this, attackers can access your cloud servers, databases, and files.',
      'GitHub Token': 'A password that gives full access to your GitHub account and all your code repositories.',
      'Stripe Secret Key': 'The key to your Stripe payment processing account. Attackers could steal money or customer payment information.',
      'Google API Key': 'Access to Google services tied to your account. Could be used to make unauthorized API calls at your expense.',
      'Database URL': 'The address and password to your database. Attackers can read, modify, or delete all your data.',
      'Private Key': 'A cryptographic key used for secure connections. Anyone with this can impersonate you or decrypt your communications.',
      'JWT Token': 'A token that proves who you are to a server. Attackers can use this to access your account without a password.',
      'API Key Generic': 'A key to access an API service. Could let attackers use the service pretending to be you.',
      'Password in Code': 'A hardcoded password. Never put passwords directly in code - they should be stored securely.',
      'OAuth Token': 'An access token for OAuth authentication. Allows access to your account or services.',
      'Slack Token': 'Access to your Slack workspace. Attackers could read messages or post as you.',
      'SendGrid API Key': 'Access to your SendGrid email service. Could be used to send spam emails from your account.',
      'Twilio API Key': 'Access to your Twilio phone/SMS service. Could rack up charges by making calls or sending messages.'
    };
    return explanations[type] || 'A sensitive credential that should not be in your code.';
  };

  const getActionableAdvice = (type: string) => {
    const advice: Record<string, string> = {
      'AWS Access Key': 'Go to AWS IAM Console → Delete this key → Create a new one → Store it in .env file',
      'AWS Secret Key': 'Go to AWS IAM Console → Rotate credentials → Never put the new one in code',
      'GitHub Token': 'Go to GitHub Settings → Developer settings → Personal access tokens → Revoke this token → Create new one',
      'Stripe Secret Key': 'Go to Stripe Dashboard → API Keys → Roll this key → Use environment variables',
      'Google API Key': 'Go to Google Cloud Console → Credentials → Delete this key → Create new restricted key',
      'Database URL': 'Change your database password → Update connection string → Move to .env file',
      'Private Key': 'Generate a new key pair → Update your servers → Never commit private keys',
      'JWT Token': 'This token is compromised → Invalidate it → Force users to re-login if needed',
      'API Key Generic': 'Find the service this key belongs to → Regenerate the key → Store securely',
      'Password in Code': 'Remove this password → Use environment variables instead → Update the password',
      'OAuth Token': 'Revoke this token in the service settings → Re-authenticate to get a new one',
      'Slack Token': 'Go to Slack API Dashboard → Revoke this token → Create new token with minimal permissions',
      'SendGrid API Key': 'Go to SendGrid Settings → Revoke key → Create new key with limited scope',
      'Twilio API Key': 'Go to Twilio Console → Delete this key → Create new key → Store in environment variables'
    };
    return advice[type] || 'Rotate this credential immediately and store it securely in environment variables.';
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#BDE038] to-[#10454F] bg-clip-text text-transparent">
            Secret Exposure Analyzer
          </h1>
          <p className="text-xl text-gray-400">
            Paste your code or configuration files to scan for exposed secrets and credentials.
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <textarea
            className="w-full h-64 p-6 rounded-xl bg-[#121212] border border-white/30 text-lg font-mono focus:border-[#BDE038] focus:outline-none transition-colors resize-none"
            placeholder="Paste your code here...

Example:
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
STRIPE_SECRET_KEY=sk_test_51HxJ8k2eZvKYlo2C..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || isAnalyzing}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#10454F] to-[#BDE038] text-black text-lg font-semibold hover:shadow-lg hover:shadow-[#BDE038]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Analyze Code
                </>
              )}
            </button>

            <button
              onClick={() => {
                setInput('');
                setResult(null);
              }}
              className="px-8 py-4 rounded-full border border-white/30 text-lg hover:border-white/50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className={`p-6 rounded-xl border-2 ${getRiskColor(result.riskLevel)}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold">Analysis Complete</h2>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Risk Level</div>
                  <div className="text-2xl font-bold uppercase">{result.riskLevel}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold">{result.foundSecrets.length}</div>
                  <div className="text-sm text-gray-400">Secrets Found</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{result.totalLines}</div>
                  <div className="text-sm text-gray-400">Lines Scanned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {result.foundSecrets.filter(s => s.severity === 'critical').length}
                  </div>
                  <div className="text-sm text-gray-400">Critical Issues</div>
                </div>
              </div>
            </div>

            {/* Detected Secrets */}
            {result.foundSecrets.length > 0 ? (
              <div className="bg-[#121212] border border-red-500/50 rounded-xl p-6">
                <h3 className="text-[2.69rem] font-bold mb-6 flex items-center gap-2">
                  <span>⚠️</span>
                  Detected Secrets ({result.foundSecrets.length})
                </h3>

                <div className="space-y-4">
                  {result.foundSecrets.map((secret, index) => (
                    <div
                      key={index}
                      className="bg-black/50 border border-white/20 rounded-lg p-5 hover:border-[#BDE038]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getSeverityIcon(secret.severity)}</span>
                          <div>
                            <h4 className="text-[2.24rem] font-semibold">{secret.type}</h4>
                            <p className="text-[0.923rem] text-gray-400" style={{ textShadow: '0 0 8px rgba(189, 224, 56, 0.3)' }}>
                              Found on Line {secret.line}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[0.672rem] font-semibold uppercase ${getRiskColor(secret.severity)}`}>
                          {secret.severity}
                        </span>
                      </div>

                      <p className="text-gray-300 mb-3 text-[1.12rem]">{secret.description}</p>
                      
                      {/* What is this? */}
                      <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                        <p className="text-[0.941rem] text-blue-300">
                          <strong>What is this?</strong> {getSecretExplanation(secret.type)}
                        </p>
                      </div>
                      
                      <div className="bg-black/80 border border-white/10 rounded p-3 font-mono text-[0.941rem]">
                        <code className="text-red-400">{secret.match}</code>
                      </div>

                      {/* What to do */}
                      <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                        <p className="text-[0.941rem] text-yellow-300">
                          <strong>⚠️ What to do:</strong> {getActionableAdvice(secret.type)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="mt-6 p-5 bg-[#BDE038]/10 border border-[#BDE038]/30 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-[#BDE038]">🛡️ What You Need to Do Right Now</h4>
                  
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <p className="font-semibold text-white mb-2">Step 1: Delete These Secrets Immediately</p>
                      <p className="text-sm">Remove all the detected secrets from your code. Don't commit this code to GitHub or any version control system.</p>
                    </div>

                    <div>
                      <p className="font-semibold text-white mb-2">Step 2: Change Your Passwords/Keys</p>
                      <p className="text-sm">Go to each service (AWS, Stripe, GitHub, etc.) and generate new keys. The old ones are now compromised since they were in your code.</p>
                    </div>

                    <div>
                      <p className="font-semibold text-white mb-2">Step 3: Use Environment Variables Instead</p>
                      <p className="text-sm mb-2">Instead of putting secrets in your code, use a <code className="bg-black/50 px-2 py-1 rounded">.env</code> file:</p>
                      <div className="bg-black/80 border border-white/10 rounded p-3 font-mono text-sm">
                        <div className="text-gray-500"># Create a file called .env in your project root</div>
                        <div className="text-green-400">AWS_SECRET_KEY=your_secret_here</div>
                        <div className="text-green-400">DATABASE_URL=your_db_url_here</div>
                      </div>
                      <p className="text-sm mt-2">Then access them in your code with <code className="bg-black/50 px-2 py-1 rounded">process.env.AWS_SECRET_KEY</code></p>
                    </div>

                    <div>
                      <p className="font-semibold text-white mb-2">Step 4: Add .env to .gitignore</p>
                      <p className="text-sm mb-2">Create or edit your <code className="bg-black/50 px-2 py-1 rounded">.gitignore</code> file and add this line:</p>
                      <div className="bg-black/80 border border-white/10 rounded p-3 font-mono text-sm">
                        <div className="text-green-400">.env</div>
                        <div className="text-green-400">.env.local</div>
                      </div>
                      <p className="text-sm mt-2">This prevents your secrets from ever being committed to GitHub.</p>
                    </div>

                    <div className="pt-3 border-t border-white/20">
                      <p className="font-semibold text-white mb-2">📚 Need More Help?</p>
                      <ul className="text-sm space-y-1">
                        <li>• <a href="https://www.npmjs.com/package/dotenv" target="_blank" rel="noopener noreferrer" className="text-[#BDE038] hover:underline">Learn about dotenv (for environment variables)</a></li>
                        <li>• <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository" target="_blank" rel="noopener noreferrer" className="text-[#BDE038] hover:underline">How to remove secrets from GitHub history</a></li>
                        <li>• <a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="text-[#BDE038] hover:underline">OWASP Secrets Management Guide</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#121212] border border-green-500/50 rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-400">
                  <span>✓</span>
                  No Secrets Detected
                </h3>
                <p className="text-gray-300 mb-4">
                  Great! We didn't find any obvious secrets in your code. However, always practice secure coding:
                </p>
                <ul className="space-y-2 text-gray-400 ml-4">
                  <li>• Continue using environment variables for sensitive data</li>
                  <li>• Review your code for business logic vulnerabilities</li>
                  <li>• Keep dependencies up to date</li>
                  <li>• Use pre-commit hooks to prevent accidental commits</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!result && (
          <div className="bg-[#121212] border border-white/20 rounded-xl p-6 mt-8">
            <h3 className="text-xl font-semibold mb-4">What we scan for:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-400">
              <div>
                <p className="font-semibold text-white mb-2">🔑 API Keys & Tokens</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• AWS Access & Secret Keys</li>
                  <li>• GitHub Tokens</li>
                  <li>• Stripe API Keys</li>
                  <li>• Google API Keys</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">🗄️ Database & Infrastructure</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Database Connection Strings</li>
                  <li>• Private Cryptographic Keys</li>
                  <li>• JWT Tokens</li>
                  <li>• OAuth Tokens</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}