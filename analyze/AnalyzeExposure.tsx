import React, { useState } from 'react';
import { SecretDetector } from './SecretDetector';
import type { AnalysisResult } from './types';

export default function AnalyzeExposure() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadMode, setUploadMode] = useState<'text' | 'files' | 'folder'>('text');
  const [fileResults, setFileResults] = useState<{fileName: string; result: AnalysisResult}[]>([]);

  const analyzeCode = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const analysisResult = SecretDetector.analyzeCode(code);
      setResult(analysisResult);
      setAnalyzing(false);
    }, 1500);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setAnalyzing(true);
    const results: {fileName: string; result: AnalysisResult}[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = await file.text();
      const analysisResult = SecretDetector.analyzeCode(text);
      
      if (analysisResult.foundSecrets.length > 0) {
        results.push({ fileName: file.name, result: analysisResult });
      }
    }

    setFileResults(results);
    setAnalyzing(false);
  };

  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setAnalyzing(true);
    const results: {fileName: string; result: AnalysisResult}[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Skip non-text files
      if (!file.type.includes('text') && !file.name.match(/\.(js|ts|tsx|jsx|py|env|json|yml|yaml|xml|md|txt)$/i)) {
        continue;
      }

      try {
        const text = await file.text();
        const analysisResult = SecretDetector.analyzeCode(text);
        
        if (analysisResult.foundSecrets.length > 0) {
          results.push({ fileName: file.webkitRelativePath || file.name, result: analysisResult });
        }
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }

    setFileResults(results);
    setAnalyzing(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'low': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-green-500/20 border-green-500/50 text-green-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  const getSecretExplanation = (type: string): string => {
    const explanations: Record<string, string> = {
      'AWS Access Key': 'This is like a username for Amazon Web Services. Anyone with this can access your AWS account and resources.',
      'AWS Secret Key': 'This is like a password for AWS. Combined with an Access Key, it gives full access to your AWS account.',
      'GitHub Token': 'This token allows access to your GitHub repositories. Someone could read, modify, or delete your code.',
      'Stripe Secret Key': 'This key can process payments and access customer data in your Stripe account.',
      'Google API Key': 'This key is used to access Google services. It could result in unauthorized usage and charges.',
      'Database URL': 'This contains credentials to connect to your database. Anyone with this can read, modify, or delete your data.',
      'Private Key': 'This is a cryptographic private key used for secure communications. If leaked, encrypted data can be decrypted.',
      'JWT Token': 'JSON Web Tokens are used for authentication. This could allow someone to impersonate users.',
      'API Key': 'Generic API key that provides access to a service or application.',
      'Password': 'A password found directly in code, which is a major security risk.',
      'OAuth Token': 'Used for authentication with third-party services.',
      'Slack Token': 'Provides access to your Slack workspace and messages.',
      'SendGrid API Key': 'Can be used to send emails through your SendGrid account.',
      'Twilio API Key': 'Provides access to your Twilio account for sending SMS and making calls.'
    };
    return explanations[type] || 'This appears to be a sensitive credential that should not be exposed.';
  };

  const getActionableAdvice = (type: string): string => {
    const advice: Record<string, string> = {
      'AWS Access Key': '1. Go to AWS IAM Console immediately\n2. Delete this access key\n3. Create a new key pair\n4. Update your applications with the new key\n5. Store keys in environment variables or AWS Secrets Manager',
      'GitHub Token': '1. Go to GitHub Settings → Developer settings → Personal access tokens\n2. Revoke this token immediately\n3. Generate a new token\n4. Store it in .env file and add .env to .gitignore',
      'Stripe Secret Key': '1. Log into Stripe Dashboard\n2. Go to Developers → API keys\n3. Roll (regenerate) this secret key\n4. Update your application with new key\n5. Never commit keys to version control',
      'Database URL': '1. Change your database password immediately\n2. Update the connection string in your .env file\n3. Rotate any other credentials in the connection string\n4. Review database access logs',
      'Private Key': '1. Generate a new key pair immediately\n2. Update all systems using this key\n3. Revoke the old key\n4. Store private keys securely using a secrets manager',
      'JWT Token': '1. Invalidate this token on your server\n2. Change your JWT secret\n3. Force re-authentication for affected users\n4. Never hardcode JWT secrets'
    };
    return advice[type] || '1. Remove this secret from your code immediately\n2. Rotate/change the credential\n3. Store in environment variables\n4. Add .env files to .gitignore';
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-full border border-white/40 text-sm hover:border-[#BDE038] hover:text-[#BDE038] transition-colors"
          >
            ← Back
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-[#BDE038]">Secret Exposure Analyzer</h1>
        <p className="text-gray-400 mb-8">
          Paste your code, upload files, or scan an entire folder to detect exposed secrets
        </p>

        {/* Upload Mode Selector */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => { setUploadMode('text'); setFileResults([]); setResult(null); }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${uploadMode === 'text' ? 'bg-[#BDE038] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            📝 Paste Code
          </button>
          <button
            onClick={() => { setUploadMode('files'); setResult(null); }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${uploadMode === 'files' ? 'bg-[#BDE038] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            📄 Upload Files
          </button>
          <button
            onClick={() => { setUploadMode('folder'); setResult(null); }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${uploadMode === 'folder' ? 'bg-[#BDE038] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            📁 Upload Folder
          </button>
        </div>

        {/* Text Input Mode */}
        {uploadMode === 'text' && (
          <div className="space-y-4">
            <textarea
              className="w-full h-96 p-6 rounded-xl bg-[#121212] border border-white/30 text-sm font-mono focus:border-[#BDE038] focus:outline-none resize-none"
              placeholder={`Paste your code here...

Example:
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
DATABASE_URL=postgresql://user:pass@localhost:5432/db
STRIPE_SECRET_KEY=sk_test_...`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={analyzeCode}
              disabled={!code || analyzing}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#10454F] to-[#BDE038] text-black text-lg font-semibold hover:shadow-lg hover:shadow-[#BDE038]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Code'}
            </button>
          </div>
        )}

        {/* File Upload Mode */}
        {uploadMode === 'files' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-[#BDE038] transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".js,.ts,.tsx,.jsx,.py,.env,.json,.yml,.yaml,.xml,.md,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-6xl mb-4">📄</div>
                <div className="text-xl font-semibold mb-2">Click to upload files</div>
                <div className="text-gray-400 text-sm">Supports: .js, .ts, .py, .env, .json, .yml, .txt, etc.</div>
              </label>
            </div>
          </div>
        )}

        {/* Folder Upload Mode */}
        {uploadMode === 'folder' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-[#BDE038] transition-colors">
              <input
                type="file"
                onChange={handleFolderUpload}
                className="hidden"
                id="folder-upload"
                /* @ts-ignore */
                webkitdirectory=""
                directory=""
                multiple
              />
              <label htmlFor="folder-upload" className="cursor-pointer">
                <div className="text-6xl mb-4">📁</div>
                <div className="text-xl font-semibold mb-2">Click to upload folder</div>
                <div className="text-gray-400 text-sm">Select a folder to scan all files recursively</div>
              </label>
            </div>
          </div>
        )}

        {/* Loading State */}
        {analyzing && (
          <div className="mt-8 p-8 bg-[#121212] border border-white/20 rounded-xl text-center">
            <div className="text-[#BDE038] text-xl mb-2">Analyzing...</div>
            <div className="text-gray-400 text-sm">Scanning for exposed secrets</div>
          </div>
        )}

        {/* Single File Results */}
        {result && uploadMode === 'text' && !analyzing && (
          <div className="mt-8 space-y-6">
            {/* Summary Card */}
            <div className={`p-6 rounded-xl border ${getRiskColor(result.riskLevel)}`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{result.riskLevel.toUpperCase()} RISK</div>
                  <div className="text-sm opacity-80 mt-1">
                    {result.foundSecrets.length} secret(s) found in {result.totalLines} lines
                  </div>
                </div>
                <div className="text-5xl">
                  {result.riskLevel === 'critical' ? '🚨' : result.riskLevel === 'high' ? '⚠️' : result.riskLevel === 'medium' ? '⚡' : result.riskLevel === 'safe' ? '✅' : '🔍'}
                </div>
              </div>
            </div>

            {/* Secrets List */}
            {result.foundSecrets.length > 0 ? (
              <div className="space-y-4">
                {result.foundSecrets.map((secret, index) => (
                  <div key={index} className="p-6 bg-[#121212] border border-white/20 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{getSeverityIcon(secret.severity)}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{secret.type}</h3>
                        <p className="text-sm text-gray-400 mb-4">Found on Line {secret.line}</p>
                        <p className="text-gray-300 mb-4">{secret.description}</p>
                        
                        {/* What is this */}
                        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <div className="font-semibold text-blue-400 mb-2">ℹ️ What is this?</div>
                          <p className="text-sm text-gray-300">{getSecretExplanation(secret.type)}</p>
                        </div>

                        {/* Secret Preview */}
                        <div className="mb-4 p-4 bg-black/50 border border-white/10 rounded-lg">
                          <div className="font-semibold text-gray-400 mb-2">Detected Secret:</div>
                          <code className="text-sm text-red-400 font-mono break-all">{secret.match}</code>
                        </div>

                        {/* What to do */}
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <div className="font-semibold text-yellow-400 mb-2">⚡ What to do:</div>
                          <pre className="text-sm text-gray-300 whitespace-pre-wrap">{getActionableAdvice(secret.type)}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                <div className="text-5xl mb-4">✅</div>
                <div className="text-2xl font-bold text-green-400 mb-2">No Secrets Detected!</div>
                <div className="text-gray-400">Your code appears to be safe from exposed credentials.</div>
              </div>
            )}
          </div>
        )}

        {/* Multiple File Results */}
        {fileResults.length > 0 && (uploadMode === 'files' || uploadMode === 'folder') && !analyzing && (
          <div className="mt-8 space-y-6">
            <div className="p-6 bg-[#121212] border border-white/20 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Scan Results</h2>
              <div className="text-gray-400">
                Scanned {fileResults.length} file(s) with exposed secrets
              </div>
            </div>

            {fileResults.map((fileResult, fileIndex) => (
              <div key={fileIndex} className="p-6 bg-[#121212] border border-white/20 rounded-xl">
                <h3 className="text-xl font-bold text-[#BDE038] mb-4">📄 {fileResult.fileName}</h3>
                <div className={`p-4 rounded-lg border mb-4 ${getRiskColor(fileResult.result.riskLevel)}`}>
                  <div className="font-semibold">{fileResult.result.riskLevel.toUpperCase()} RISK</div>
                  <div className="text-sm opacity-80">
                    {fileResult.result.foundSecrets.length} secret(s) in {fileResult.result.totalLines} lines
                  </div>
                </div>

                <div className="space-y-4">
                  {fileResult.result.foundSecrets.map((secret, secretIndex) => (
                    <div key={secretIndex} className="p-4 bg-black/30 border border-white/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{getSeverityIcon(secret.severity)}</span>
                        <span className="font-semibold">{secret.type}</span>
                        <span className="text-sm text-gray-500">Line {secret.line}</span>
                      </div>
                      <code className="text-sm text-red-400 font-mono block mt-2">{secret.match}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results from File Upload */}
        {fileResults.length === 0 && (uploadMode === 'files' || uploadMode === 'folder') && !analyzing && uploadMode !== 'text' && (
          <div className="mt-8 p-8 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
            <div className="text-5xl mb-4">✅</div>
            <div className="text-2xl font-bold text-green-400 mb-2">No Secrets Found!</div>
            <div className="text-gray-400">All scanned files appear to be safe.</div>
          </div>
        )}
      </div>
    </div>
  );
}