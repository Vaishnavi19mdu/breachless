// Types for secret detection

export interface SecretPattern {
  name: string;
  regex: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

export interface DetectedSecret {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  line: number;
  match: string;
  description: string;
}

export interface AnalysisResult {
  foundSecrets: DetectedSecret[];
  totalLines: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
}
