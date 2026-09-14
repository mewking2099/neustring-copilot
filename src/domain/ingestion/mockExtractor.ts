import type { DealShell, Statement } from '@/domain/deal/types'
import { defaultStatementSettings } from '@/domain/deal/statementSettings'
import { EXTRACTION_1_SHELL, EXTRACTION_1_STATEMENTS } from './fixtures/sampleExtraction1'
import { EXTRACTION_2_SHELL, EXTRACTION_2_STATEMENTS } from './fixtures/sampleExtraction2'

export interface ExtractionResult {
  shell: Partial<DealShell>
  statements: Statement[]
  confidence: 'high' | 'medium' | 'low'
  source: 'email' | 'file'
  sourceName: string
  factCount: number
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function hydrateStatement(partial: Partial<Statement>): Statement {
  return {
    id: makeId(),
    direction: partial.direction ?? 'inbound',
    roamingChannel: partial.roamingChannel ?? 'traditional',
    serviceTypes: partial.serviceTypes ?? [],
    model: partial.model ?? { family: 'A', variant: 'threshold' },
    bands: [{ from: 0, to: null, unit: 'volume', discount: null, discountUnit: 'volume' }],
    applyTo: 'threshold',
    settings: defaultStatementSettings(),
    createdAt: new Date().toISOString(),
  }
}

export function extractFromEmail(emailText: string): ExtractionResult {
  const lower = emailText.toLowerCase()

  // Route to fixture 2 if FRAF1 or M2M / BELMO in text
  if (lower.includes('fraf1') || lower.includes('belmo') || lower.includes('m2m deal')) {
    return {
      shell: EXTRACTION_2_SHELL,
      statements: EXTRACTION_2_STATEMENTS.map(hydrateStatement),
      confidence: 'high',
      source: 'email',
      sourceName: 'Email',
      factCount: 11,
    }
  }

  // Default to fixture 1
  return {
    shell: EXTRACTION_1_SHELL,
    statements: EXTRACTION_1_STATEMENTS.map(hydrateStatement),
    confidence: 'high',
    source: 'email',
    sourceName: 'Email',
    factCount: 14,
  }
}

export function extractFromFile(fileName: string): ExtractionResult | null {
  const lower = fileName.toLowerCase()

  // Known fixture files matching M2M / BELMO / FRAF pattern
  if (lower.includes('fraf') || lower.includes('belmo') || lower.includes('m2m')) {
    return {
      shell: EXTRACTION_2_SHELL,
      statements: EXTRACTION_2_STATEMENTS.map(hydrateStatement),
      confidence: 'medium',
      source: 'file',
      sourceName: fileName,
      factCount: 9,
    }
  }

  // Known fixture files matching bilateral / ARAX / GRAX pattern
  if (
    lower.includes('arax') ||
    lower.includes('grax') ||
    lower.includes('bilateral') ||
    lower.includes('deal')
  ) {
    return {
      shell: EXTRACTION_1_SHELL,
      statements: EXTRACTION_1_STATEMENTS.map(hydrateStatement),
      confidence: 'medium',
      source: 'file',
      sourceName: fileName,
      factCount: 12,
    }
  }

  // Unrecognised file
  return null
}
