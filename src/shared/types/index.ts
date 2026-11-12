// ─── Core Utilities ───────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export type EntityId = string;

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole =
  | 'PLATFORM_SUPER_ADMIN'
  | 'ORGANIZATION_ADMIN'
  | 'CAMPUS_PRINCIPAL'
  | 'ACADEMIC_COORDINATOR'
  | 'TEACHER'
  | 'STAFF'
  | 'PARENT'
  | 'STUDENT';

export type LanguageCode = 'en' | 'fr' | 'de';

export type GradingSystemType =
  | 'PRIMARY_COMPETENCY'
  | 'GERMAN_SCALE'
  | 'FRENCH_SCALE'
  | 'PERCENTAGE'
  | 'LETTER_GRADE'
  | 'CUSTOM';

export type TermStructure = 'SEMESTER' | 'TRIMESTER' | 'QUARTER';

export type AttendanceMode = 'HOMEROOM_DAILY' | 'PERIOD_LESSON';

export type StudentStatus =
  | 'APPLICANT'
  | 'ADMITTED'
  | 'ENROLLED'
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'TRANSFERRED'
  | 'GRADUATED'
  | 'ARCHIVED'
  | 'WITHDRAWN';

export type CompetencyLevel =
  'EXCEEDING' | 'SECURE' | 'DEVELOPING' | 'EMERGING';

export type AttendanceStatus =
  'PRESENT' | 'ABSENT_UNEXCUSED' | 'ABSENT_EXCUSED' | 'LATE' | 'MEDICAL';

export type InvoiceStatus =
  'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type ApplicationStatus =
  | 'INQUIRY'
  | 'APPLIED'
  | 'REVIEW'
  | 'INTERVIEW'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'ENROLLED'
  | 'DECLINED'
  | 'WITHDRAWN';

export type EmploymentType =
  'FULL_TIME' | 'PART_TIME' | 'PERMANENT' | 'FIXED_TERM' | 'SUBSTITUTE';

export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type PeriodType = 'LESSON' | 'BREAK' | 'LUNCH' | 'ASSEMBLY';

export type RoomType =
  'CLASSROOM' | 'LAB' | 'SPORTS' | 'MUSIC' | 'ART' | 'OTHER';

export type SubjectType = 'CORE' | 'ELECTIVE';

export type AssessmentType =
  'HOMEWORK' | 'QUIZ' | 'TEST' | 'MIDTERM' | 'FINAL' | 'ORAL' | 'PROJECT';

export type SubscriptionTier = 'FOUNDATION' | 'OPERATIONAL' | 'ENTERPRISE';

export type GuardianRelationship =
  | 'MOTHER'
  | 'FATHER'
  | 'STEPPARENT'
  | 'LEGAL_GUARDIAN'
  | 'FOSTER_PARENT'
  | 'OTHER';

export type AnnouncementAudience =
  'ALL' | 'CAMPUS' | 'YEAR_GROUP' | 'FACULTY' | 'PARENTS' | 'STUDENTS';

export type InvoiceLineCategory =
  | 'TUITION'
  | 'REGISTRATION'
  | 'CANTEEN'
  | 'TRANSPORT'
  | 'EXTRACURRICULAR'
  | 'OTHER';

// ─── Organization & Campus ────────────────────────────────────────────────────

export interface Organization {
  id: EntityId;
  name: string;
  legalName: string;
  registrationNumber?: string;
  taxId?: string;
  country: string;
  address: string;
  logoUrl?: string;
  baseCurrency: string;
  defaultLanguage: LanguageCode;
  campuses: Campus[];
  subscriptionTier: SubscriptionTier;
  createdAt: string;
}

export interface Campus {
  id: EntityId;
  organizationId: EntityId;
  name: string;
  type: 'PRIMARY' | 'SECONDARY' | 'UNIFIED';
  address: string;
  city: string;
  country: string;
  timezone: string;
  phone?: string;
  principalId?: EntityId;
  termStructure: TermStructure;
  gradingSystem: GradingSystemType;
  attendanceMode: AttendanceMode;
  workingWeek: DayOfWeek[];
  isActive: boolean;
}

export interface AcademicYear {
  id: EntityId;
  campusId: EntityId;
  label: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  terms: Term[];
}

export interface Term {
  id: EntityId;
  academicYearId: EntityId;
  name: string;
  startDate: string;
  endDate: string;
  order: number;
}

// ─── Students & Guardians ─────────────────────────────────────────────────────

export interface Student {
  id: EntityId;
  organizationId: EntityId;
  campusId: EntityId;
  studentNumber: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality?: string;
  languagesSpoken: string[];
  enrollmentDate: string;
  status: StudentStatus;
  yearGroupId: EntityId;
  classId: EntityId;
  guardians: Guardian[];
  hasSEN: boolean;
  hasMedicalAlert: boolean;
  hasLegalHold: boolean;
  photoUrl?: string;
  email?: string;
  createdAt: string;
}

export interface Guardian {
  id: EntityId;
  studentId: EntityId;
  firstName: string;
  lastName: string;
  relationship: GuardianRelationship;
  email: string;
  phone: string;
  isPrimaryContact: boolean;
  isBillingContact: boolean;
  hasLegalParentalResponsibility: boolean;
  isEmergencyPickupAuthorized: boolean;
  address?: string;
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export interface StaffMember {
  id: EntityId;
  organizationId: EntityId;
  campusId: EntityId;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  departmentId?: EntityId;
  employmentType: EmploymentType;
  qualifications: string[];
  contractedHoursPerWeek: number;
  allocatedHoursPerWeek: number;
  joinDate: string;
  isActive: boolean;
  photoUrl?: string;
}

// ─── Academic Structure ───────────────────────────────────────────────────────

export interface Department {
  id: EntityId;
  campusId: EntityId;
  name: string;
  headOfDepartmentId?: EntityId;
  subjectCount: number;
}

export interface YearGroup {
  id: EntityId;
  campusId: EntityId;
  name: string;
  order: number;
  type: 'PRIMARY' | 'SECONDARY';
}

export interface SchoolClass {
  id: EntityId;
  campusId: EntityId;
  yearGroupId: EntityId;
  name: string;
  homeroomTeacherId?: EntityId;
  roomId?: EntityId;
  maxCapacity: number;
  currentEnrollment: number;
  academicYearId: EntityId;
}

export interface Subject {
  id: EntityId;
  campusId: EntityId;
  code: string;
  name: string;
  departmentId?: EntityId;
  periodsPerWeek: number;
  isMandatory: boolean;
  type: SubjectType;
}

export interface Room {
  id: EntityId;
  campusId: EntityId;
  name: string;
  type: RoomType;
  capacity: number;
  floor?: string;
  building?: string;
  equipment: string[];
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export interface AttendanceRecord {
  id: EntityId;
  studentId: EntityId;
  classId: EntityId;
  date: string;
  period?: number;
  status: AttendanceStatus;
  notes?: string;
  recordedById: EntityId;
  recordedAt: string;
}

// ─── Assessments & Grading ────────────────────────────────────────────────────

export interface Assessment {
  id: EntityId;
  campusId: EntityId;
  classId: EntityId;
  subjectId: EntityId;
  termId: EntityId;
  title: string;
  type: AssessmentType;
  date: string;
  maxScore: number;
  weight: number;
  gradingSystem: GradingSystemType;
}

export interface Grade {
  id: EntityId;
  assessmentId: EntityId;
  studentId: EntityId;
  rawScore?: number;
  competencyLevel?: CompetencyLevel;
  narrativeComment?: string;
  gradedById: EntityId;
  gradedAt: string;
  isPublished: boolean;
}

export interface GradeResult {
  rawScore?: number;
  competencyLevel?: CompetencyLevel;
  displayValue: string;
  badgeColor: 'emerald' | 'teal' | 'amber' | 'rose' | 'slate';
  isPassing: boolean;
  label?: string;
}

// ─── Timetable ────────────────────────────────────────────────────────────────

export interface Period {
  id: EntityId;
  campusId: EntityId;
  name: string;
  startTime: string;
  endTime: string;
  order: number;
  type: PeriodType;
}

export interface TimetableSlot {
  id: EntityId;
  campusId: EntityId;
  academicYearId: EntityId;
  classId: EntityId;
  subjectId: EntityId;
  teacherId: EntityId;
  roomId: EntityId;
  periodId: EntityId;
  dayOfWeek: DayOfWeek;
}

// ─── Finance ──────────────────────────────────────────────────────────────────

export interface Invoice {
  id: EntityId;
  organizationId: EntityId;
  studentId: EntityId;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  lineItems: InvoiceLineItem[];
  totalMinorUnits: number;
  paidMinorUnits: number;
  status: InvoiceStatus;
}

export interface InvoiceLineItem {
  id: EntityId;
  description: string;
  category: InvoiceLineCategory;
  amountMinorUnits: number;
}

// ─── Communication ────────────────────────────────────────────────────────────

export interface AnnouncementTranslation {
  lang: LanguageCode;
  title: string;
  body: string;
}

export interface Announcement {
  id: EntityId;
  organizationId: EntityId;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  campusId?: EntityId;
  yearGroupId?: EntityId;
  isUrgent: boolean;
  authorId: EntityId;
  publishedAt: string;
  translations: AnnouncementTranslation[];
}

// ─── Admissions ───────────────────────────────────────────────────────────────

export interface Application {
  id: EntityId;
  organizationId: EntityId;
  campusId: EntityId;
  applicationNumber: string;
  applicantFirstName: string;
  applicantLastName: string;
  dateOfBirth: string;
  targetYearGroupId: EntityId;
  targetAcademicYearId: EntityId;
  status: ApplicationStatus;
  primaryGuardianName: string;
  primaryGuardianEmail: string;
  primaryGuardianPhone: string;
  appliedAt: string;
  notes?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  totalStudents: number;
  activeStaff: number;
  attendanceRateToday: number;
  outstandingFeesMinorUnits: number;
  currency: string;
  newApplicationsThisMonth: number;
  recentEnrollments: Student[];
  attendanceTrend: { date: string; rate: number }[];
  admissionsPipeline: { status: ApplicationStatus; count: number }[];
}
