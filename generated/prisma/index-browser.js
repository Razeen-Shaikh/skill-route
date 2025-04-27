
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  passwordHash: 'passwordHash',
  role: 'role',
  failedAttempts: 'failedAttempts',
  lockedUntil: 'lockedUntil',
  resetToken: 'resetToken',
  resetTokenExpiry: 'resetTokenExpiry',
  emailVerified: 'emailVerified',
  verificationToken: 'verificationToken',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.UserProfileScalarFieldEnum = {
  userId: 'userId',
  bio: 'bio',
  location: 'location',
  website: 'website',
  socialLinks: 'socialLinks',
  avatar: 'avatar',
  rank: 'rank',
  level: 'level',
  xp: 'xp',
  levelProgress: 'levelProgress',
  levelProgressMax: 'levelProgressMax',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  lastLogin: 'lastLogin',
  completedQuizzes: 'completedQuizzes',
  completedTutorials: 'completedTutorials',
  completedRoadmaps: 'completedRoadmaps',
  completedSteps: 'completedSteps',
  completedChallenges: 'completedChallenges',
  completedInterviews: 'completedInterviews',
  completedProjects: 'completedProjects',
  theme: 'theme'
};

exports.Prisma.UserProgressScalarFieldEnum = {
  tutorialId: 'tutorialId',
  bestAttemptId: 'bestAttemptId',
  lastAttemptId: 'lastAttemptId',
  userQuizAttemptId: 'userQuizAttemptId',
  isCompleted: 'isCompleted',
  completedAt: 'completedAt',
  attempts: 'attempts',
  bestScore: 'bestScore',
  percentageCompleted: 'percentageCompleted',
  interviewCompleted: 'interviewCompleted',
  challengeCompleted: 'challengeCompleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  profileId: 'profileId'
};

exports.Prisma.UserStreakScalarFieldEnum = {
  profileId: 'profileId',
  streak: 'streak',
  streakDays: 'streakDays',
  lastLogin: 'lastLogin',
  currentStart: 'currentStart',
  currentEnd: 'currentEnd',
  longestStreak: 'longestStreak',
  longestStart: 'longestStart',
  longestEnd: 'longestEnd',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserQuizAttemptScalarFieldEnum = {
  id: 'id',
  quizId: 'quizId',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  score: 'score',
  isPassed: 'isPassed',
  feedback: 'feedback',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  profileId: 'profileId'
};

exports.Prisma.UserQuestionAttemptScalarFieldEnum = {
  id: 'id',
  questionId: 'questionId',
  selectedOption: 'selectedOption',
  isCorrect: 'isCorrect',
  xpEarned: 'xpEarned',
  userQuizAttemptId: 'userQuizAttemptId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LastActivityScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  description: 'description',
  xpAwarded: 'xpAwarded',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  quizId: 'quizId',
  tutorialId: 'tutorialId',
  roadmapId: 'roadmapId',
  roadmapStepId: 'roadmapStepId',
  quizAttemptId: 'quizAttemptId',
  questionAttemptId: 'questionAttemptId'
};

exports.Prisma.UserBadgeScalarFieldEnum = {
  badgeId: 'badgeId',
  earnedAt: 'earnedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  profileId: 'profileId'
};

exports.Prisma.BadgeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  imageUrl: 'imageUrl',
  xpReq: 'xpReq',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CoinWalletScalarFieldEnum = {
  profileId: 'profileId',
  balance: 'balance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CoinTransactionScalarFieldEnum = {
  id: 'id',
  type: 'type',
  amount: 'amount',
  description: 'description',
  transactionAt: 'transactionAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  profileId: 'profileId'
};

exports.Prisma.RoadmapScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  type: 'type',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.RoadmapProgressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  roadmapId: 'roadmapId',
  progress: 'progress',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RoadmapStepScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  order: 'order',
  status: 'status',
  progress: 'progress',
  completedAt: 'completedAt',
  completed: 'completed',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  parentId: 'parentId',
  roadmapId: 'roadmapId'
};

exports.Prisma.TutorialScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  content: 'content',
  category: 'category',
  authorId: 'authorId',
  likes: 'likes',
  views: 'views',
  isLocked: 'isLocked',
  cost: 'cost',
  hasChallenge: 'hasChallenge',
  difficulty: 'difficulty',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  stepsId: 'stepsId',
  tutorialId: 'tutorialId',
  nextTutorialId: 'nextTutorialId'
};

exports.Prisma.QuizScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  isTimed: 'isTimed',
  timeLimit: 'timeLimit',
  maxScore: 'maxScore',
  passPercentage: 'passPercentage',
  difficulty: 'difficulty',
  order: 'order',
  tutorialLocked: 'tutorialLocked',
  questionCount: 'questionCount',
  estimatedDuration: 'estimatedDuration',
  tutorialId: 'tutorialId',
  stepsId: 'stepsId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.QuizQuestionScalarFieldEnum = {
  id: 'id',
  questionText: 'questionText',
  options: 'options',
  correctAnswer: 'correctAnswer',
  xp: 'xp',
  quizId: 'quizId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdminActivityLogScalarFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  action: 'action',
  target: 'target',
  targetId: 'targetId',
  timestamp: 'timestamp'
};

exports.Prisma.TagScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  usageCount: 'usageCount',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.UserRole = exports.$Enums.UserRole = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  USER: 'USER'
};

exports.ThemeName = exports.$Enums.ThemeName = {
  DARK: 'DARK',
  LIGHT: 'LIGHT'
};

exports.ActivityType = exports.$Enums.ActivityType = {
  BADGE: 'BADGE',
  COINS: 'COINS',
  LOGIN: 'LOGIN',
  QUIZ: 'QUIZ',
  ROADMAP: 'ROADMAP',
  STEP: 'STEP',
  TUTORIAL: 'TUTORIAL',
  TRANSACTION: 'TRANSACTION',
  XP: 'XP',
  LEVEL: 'LEVEL'
};

exports.TransactionType = exports.$Enums.TransactionType = {
  EARNED: 'EARNED',
  PENALTY: 'PENALTY',
  REWARD: 'REWARD',
  SPENT: 'SPENT',
  ALL: 'ALL'
};

exports.RoadmapType = exports.$Enums.RoadmapType = {
  AI: 'AI',
  BACKEND: 'BACKEND',
  DEVOPS: 'DEVOPS',
  FRONTEND: 'FRONTEND',
  FULLSTACK: 'FULLSTACK',
  DATA_SCIENCE: 'DATA_SCIENCE',
  MOBILE: 'MOBILE',
  MACHINE_LEARNING: 'MACHINE_LEARNING',
  MERN: 'MERN',
  MEAN: 'MEAN',
  BLOCKCHAIN: 'BLOCKCHAIN',
  CYBER_SECURITY: 'CYBER_SECURITY',
  GAMING: 'GAMING',
  CLOUD: 'CLOUD',
  SOFTWARE_TESTING: 'SOFTWARE_TESTING'
};

exports.StepStatus = exports.$Enums.StepStatus = {
  COMPLETED: 'COMPLETED',
  IN_PROGRESS: 'IN_PROGRESS',
  NOT_STARTED: 'NOT_STARTED'
};

exports.DifficultyLevel = exports.$Enums.DifficultyLevel = {
  EASY: 'EASY',
  HARD: 'HARD',
  MEDIUM: 'MEDIUM'
};

exports.TutorialStatus = exports.$Enums.TutorialStatus = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  PUBLISHED: 'PUBLISHED'
};

exports.TagType = exports.$Enums.TagType = {
  GLOBAL: 'GLOBAL',
  QUIZ: 'QUIZ',
  ROADMAP: 'ROADMAP',
  TUTORIAL: 'TUTORIAL'
};

exports.Prisma.ModelName = {
  User: 'User',
  UserProfile: 'UserProfile',
  UserProgress: 'UserProgress',
  UserStreak: 'UserStreak',
  UserQuizAttempt: 'UserQuizAttempt',
  UserQuestionAttempt: 'UserQuestionAttempt',
  LastActivity: 'LastActivity',
  UserBadge: 'UserBadge',
  Badge: 'Badge',
  CoinWallet: 'CoinWallet',
  CoinTransaction: 'CoinTransaction',
  Roadmap: 'Roadmap',
  RoadmapProgress: 'RoadmapProgress',
  RoadmapStep: 'RoadmapStep',
  Tutorial: 'Tutorial',
  Quiz: 'Quiz',
  QuizQuestion: 'QuizQuestion',
  AdminActivityLog: 'AdminActivityLog',
  Tag: 'Tag'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
