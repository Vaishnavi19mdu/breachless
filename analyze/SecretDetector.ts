import { SecretPattern, DetectedSecret, AnalysisResult } from './types';

// Comprehensive secret patterns
const SECRET_PATTERNS: SecretPattern[] = [
  {
    name: 'AWS Access Key',
    regex: /AKIA[0-9A-Z]{16}/g,
    severity: 'critical',
    description: 'AWS Access Key ID detected'
  },
  {
    name: 'AWS Secret Key',
    regex: /AWS_SECRET_ACCESS_KEY\s*=\s*[A-Za-z0-9/+=]{40}/gi,
    severity: 'critical',
    description: 'AWS Secret Access Key detected'
  },
  {
    name: 'GitHub Token',
    regex: /gh[ps]_[A-Za-z0-9]{36}/g,
    severity: 'critical',
    description: 'GitHub Personal Access Token detected'
  },
  {
    name: 'Stripe Secret Key',
    regex: /sk_(live|test)_[A-Za-z0-9]{24,}/gi,
    severity: 'critical',
    description: 'Stripe Secret Key detected'
  },
  {
    name: 'Google API Key',
    regex: /AIza[0-9A-Za-z-_]{35}/g,
    severity: 'critical',
    description: 'Google API Key detected'
  },
  {
    name: 'Database URL',
    regex: /(postgres|mysql|mongodb):\/\/[^\s]+/gi,
    severity: 'high',
    description: 'Database connection string with credentials'
  },
  {
    name: 'Private Key',
    regex: /-----BEGIN (RSA |DSA |EC )?PRIVATE KEY-----/gi,
    severity: 'critical',
    description: 'Private cryptographic key detected'
  },
  {
    name: 'JWT Token',
    regex: /eyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*/g,
    severity: 'high',
    description: 'JSON Web Token detected'
  },
  {
    name: 'API Key Generic',
    regex: /api[_-]?key\s*[:=]\s*['"]?[A-Za-z0-9-_]{20,}['"]?/gi,
    severity: 'high',
    description: 'Generic API key pattern detected'
  },
  {
    name: 'Password in Code',
    regex: /password\s*[:=]\s*['"][^'"]{4,}['"]/gi,
    severity: 'high',
    description: 'Hardcoded password detected'
  },
  {
    name: 'OAuth Token',
    regex: /access[_-]?token\s*[:=]\s*['"]?[A-Za-z0-9-_.]{20,}['"]?/gi,
    severity: 'high',
    description: 'OAuth access token detected'
  },
  {
    name: 'Slack Token',
    regex: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[A-Za-z0-9]{24,}/g,
    severity: 'critical',
    description: 'Slack API token detected'
  },
  {
    name: 'SendGrid API Key',
    regex: /SG\.[A-Za-z0-9-_]{22}\.[A-Za-z0-9-_]{43}/g,
    severity: 'critical',
    description: 'SendGrid API key detected'
  },
  {
    name: 'Twilio API Key',
    regex: /SK[a-z0-9]{32}/gi,
    severity: 'critical',
    description: 'Twilio API key detected'
  }
];

export class SecretDetector {
  static analyzeCode(code: string): AnalysisResult {
    const lines = code.split('\n');
    const foundSecrets: DetectedSecret[] = [];

    lines.forEach((line, index) => {
      SECRET_PATTERNS.forEach(pattern => {
        const matches = line.matchAll(pattern.regex);
        
        for (const match of matches) {
          foundSecrets.push({
            type: pattern.name,
            severity: pattern.severity,
            line: index + 1,
            match: this.maskSecret(match[0]),
            description: pattern.description
          });
        }
      });
    });

    // Determine overall risk level
    const riskLevel = this.calculateRiskLevel(foundSecrets);

    return {
      foundSecrets,
      totalLines: lines.length,
      riskLevel
    };
  }

  private static maskSecret(secret: string): string {
    if (secret.length <= 8) {
      return '***';
    }
    const visible = 4;
    return secret.substring(0, visible) + '***' + secret.substring(secret.length - visible);
  }

  private static calculateRiskLevel(secrets: DetectedSecret[]): 'safe' | 'low' | 'medium' | 'high' | 'critical' {
    if (secrets.length === 0) return 'safe';
    
    const hasCritical = secrets.some(s => s.severity === 'critical');
    const hasHigh = secrets.some(s => s.severity === 'high');
    
    if (hasCritical && secrets.length >= 3) return 'critical';
    if (hasCritical) return 'high';
    if (hasHigh && secrets.length >= 2) return 'high';
    if (hasHigh) return 'medium';
    
    return 'low';
  }
}
