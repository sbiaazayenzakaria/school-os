import {
  CompetencyLevel,
  GradeResult,
  GradingSystemType,
} from '@/shared/types';

export interface IGradingStrategy {
  readonly systemType: GradingSystemType;
  calculateGrade(
    rawScore: number,
    maxScore: number,
    weight?: number
  ): GradeResult;
  formatForDisplay(grade: GradeResult, locale?: string): string;
  isPassing(grade: GradeResult): boolean;
  getSemanticBadgeColor(
    grade: GradeResult
  ): 'emerald' | 'teal' | 'amber' | 'rose' | 'slate';
  getLabel(grade: GradeResult): string;
}

// ─── Primary Competency Strategy (Default for Primary Education) ───────────────

export class PrimaryCompetencyStrategy implements IGradingStrategy {
  readonly systemType = 'PRIMARY_COMPETENCY' as const;

  calculateGrade(rawScore: number, maxScore: number): GradeResult {
    const pct = maxScore > 0 ? (rawScore / maxScore) * 100 : 0;
    let competencyLevel: CompetencyLevel = 'EMERGING';

    if (pct >= 85) competencyLevel = 'EXCEEDING';
    else if (pct >= 65) competencyLevel = 'SECURE';
    else if (pct >= 45) competencyLevel = 'DEVELOPING';
    else competencyLevel = 'EMERGING';

    return {
      rawScore,
      competencyLevel,
      displayValue: this.getCompetencyLabel(competencyLevel),
      badgeColor: this.getCompetencyBadgeColor(competencyLevel),
      isPassing: competencyLevel !== 'EMERGING',
      label: this.getCompetencyLabel(competencyLevel),
    };
  }

  formatForDisplay(grade: GradeResult): string {
    return grade.displayValue;
  }

  isPassing(grade: GradeResult): boolean {
    return grade.competencyLevel !== 'EMERGING';
  }

  getSemanticBadgeColor(
    grade: GradeResult
  ): 'emerald' | 'teal' | 'amber' | 'rose' | 'slate' {
    return this.getCompetencyBadgeColor(grade.competencyLevel ?? 'EMERGING');
  }

  getLabel(grade: GradeResult): string {
    return this.getCompetencyLabel(grade.competencyLevel ?? 'EMERGING');
  }

  private getCompetencyLabel(level: CompetencyLevel): string {
    switch (level) {
      case 'EXCEEDING':
        return 'Exceeding / Expert';
      case 'SECURE':
        return 'Secure / Acquis';
      case 'DEVELOPING':
        return 'Developing / En acquisition';
      case 'EMERGING':
        return 'Emerging / Non acquis';
    }
  }

  private getCompetencyBadgeColor(
    level: CompetencyLevel
  ): 'emerald' | 'teal' | 'amber' | 'rose' | 'slate' {
    switch (level) {
      case 'EXCEEDING':
        return 'emerald';
      case 'SECURE':
        return 'teal';
      case 'DEVELOPING':
        return 'amber';
      case 'EMERGING':
        return 'rose';
    }
  }
}

// ─── French Grading Strategy (0.00 to 20.00 scale) ─────────────────────────────

export class FrenchGradingStrategy implements IGradingStrategy {
  readonly systemType = 'FRENCH_SCALE' as const;

  calculateGrade(rawScore: number, maxScore: number): GradeResult {
    const normalizedScore = maxScore > 0 ? (rawScore / maxScore) * 20 : 0;
    const rounded = Math.round(normalizedScore * 10) / 10;
    const passing = rounded >= 10.0;

    let badgeColor: 'emerald' | 'teal' | 'amber' | 'rose' | 'slate' = 'rose';
    let label = 'Ajourné';

    if (rounded >= 16.0) {
      badgeColor = 'emerald';
      label = 'Très Bien';
    } else if (rounded >= 14.0) {
      badgeColor = 'teal';
      label = 'Bien';
    } else if (rounded >= 12.0) {
      badgeColor = 'amber';
      label = 'Assez Bien';
    } else if (rounded >= 10.0) {
      badgeColor = 'amber';
      label = 'Passable';
    }

    return {
      rawScore: rounded,
      displayValue: `${rounded.toFixed(1)}/20`,
      badgeColor,
      isPassing: passing,
      label,
    };
  }

  formatForDisplay(grade: GradeResult): string {
    return `${grade.displayValue} (${grade.label})`;
  }

  isPassing(grade: GradeResult): boolean {
    return grade.isPassing;
  }

  getSemanticBadgeColor(
    grade: GradeResult
  ): 'emerald' | 'teal' | 'amber' | 'rose' | 'slate' {
    return grade.badgeColor;
  }

  getLabel(grade: GradeResult): string {
    return grade.label ?? '';
  }
}

// ─── German Grading Strategy (1.0 to 6.0 inverted curve) ───────────────────────

export class GermanGradingStrategy implements IGradingStrategy {
  readonly systemType = 'GERMAN_SCALE' as const;

  calculateGrade(rawScore: number, maxScore: number): GradeResult {
    // Percentage to KMK curve: 1.0 (best) to 6.0 (failing), <= 4.0 is passing
    const pct = maxScore > 0 ? (rawScore / maxScore) * 100 : 0;
    let note = 6.0;
    let badgeColor: 'emerald' | 'teal' | 'amber' | 'rose' | 'slate' = 'rose';
    let label = 'Ungenügend';

    if (pct >= 90) {
      note = 1.0 + ((100 - pct) / 10) * 0.5;
      badgeColor = 'emerald';
      label = 'Sehr gut';
    } else if (pct >= 80) {
      note = 1.6 + ((89 - pct) / 10) * 0.9;
      badgeColor = 'teal';
      label = 'Gut';
    } else if (pct >= 65) {
      note = 2.6 + ((79 - pct) / 15) * 0.9;
      badgeColor = 'teal';
      label = 'Befriedigend';
    } else if (pct >= 50) {
      note = 3.6 + ((64 - pct) / 15) * 0.4;
      badgeColor = 'amber';
      label = 'Ausreichend';
    } else if (pct >= 30) {
      note = 4.1 + ((49 - pct) / 20) * 0.9;
      badgeColor = 'rose';
      label = 'Mangelhaft';
    } else {
      note = 5.1 + ((29 - pct) / 30) * 0.9;
      badgeColor = 'rose';
      label = 'Ungenügend';
    }

    const rounded = Math.round(note * 10) / 10;
    const isPassing = rounded <= 4.0;

    return {
      rawScore: rounded,
      displayValue: `Note ${rounded.toFixed(1)}`,
      badgeColor,
      isPassing,
      label,
    };
  }

  formatForDisplay(grade: GradeResult): string {
    return `${grade.displayValue} (${grade.label})`;
  }

  isPassing(grade: GradeResult): boolean {
    return grade.isPassing;
  }

  getSemanticBadgeColor(
    grade: GradeResult
  ): 'emerald' | 'teal' | 'amber' | 'rose' | 'slate' {
    return grade.badgeColor;
  }

  getLabel(grade: GradeResult): string {
    return grade.label ?? '';
  }
}

// ─── Percentage Strategy ──────────────────────────────────────────────────────

export class PercentageGradingStrategy implements IGradingStrategy {
  readonly systemType = 'PERCENTAGE' as const;

  calculateGrade(rawScore: number, maxScore: number): GradeResult {
    const pct = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;
    const passing = pct >= 50;

    return {
      rawScore: pct,
      displayValue: `${pct}%`,
      badgeColor:
        pct >= 80
          ? 'emerald'
          : pct >= 60
            ? 'teal'
            : pct >= 50
              ? 'amber'
              : 'rose',
      isPassing: passing,
      label: passing ? 'Pass' : 'Fail',
    };
  }

  formatForDisplay(grade: GradeResult): string {
    return grade.displayValue;
  }

  isPassing(grade: GradeResult): boolean {
    return grade.isPassing;
  }

  getSemanticBadgeColor(
    grade: GradeResult
  ): 'emerald' | 'teal' | 'amber' | 'rose' | 'slate' {
    return grade.badgeColor;
  }

  getLabel(grade: GradeResult): string {
    return grade.label ?? '';
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export class GradingStrategyFactory {
  static getStrategy(type: GradingSystemType): IGradingStrategy {
    switch (type) {
      case 'PRIMARY_COMPETENCY':
        return new PrimaryCompetencyStrategy();
      case 'GERMAN_SCALE':
        return new GermanGradingStrategy();
      case 'FRENCH_SCALE':
        return new FrenchGradingStrategy();
      case 'PERCENTAGE':
      default:
        return new PercentageGradingStrategy();
    }
  }
}
