import { getLevelFromXP, getRankFromLevelXP } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { ActivityType, Badge, CoinTransaction, CoinWallet, LastActivity, Quiz, QuizQuestion, Roadmap, RoadmapStep, StepStatus, Tag, Tutorial, TutorialStatus, User, UserBadge, UserProfile, UserProgress, UserQuestionAttempt, UserQuizAttempt, UserRole, UserStreak } from "@/generated/prisma";
import slugify from "slugify";
import { seedHelper } from "../lib/seedHelper";
import { quizQuestionData, quizzesData, roadmapData, tutorialsData, usersData } from "../lib/data";

async function main() {
    console.log('🌱 Starting database seeding...');

    /** SEED USERS **/

    console.log("🌱 Seeding users...");

    const users: User[] = [];

    for (const userData of usersData) {
        const createdAt = seedHelper.getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000))
        const updatedAt = new Date(createdAt.getTime() + seedHelper.getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000)).getTime());
        // const deletedAt = getRandomBool() ? null : new Date(updatedAt.getTime() + seedHelper.getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000)).getTime());
        const role = seedHelper.getRole() || "GUEST";

        const user = await prisma.user.create({
            data: {
                username: userData.username ?? "user",
                firstName: userData.firstName ?? "",
                lastName: userData.lastName,
                email: userData.email ?? "default@mail.com",
                passwordHash: await seedHelper.hashPassword("password123"),
                role: role as UserRole,
                emailVerified: true,
                failedAttempts: 0,
                resetToken: seedHelper.getResetToken(),
                resetTokenExpiry: seedHelper.getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000)),
                lockedUntil: seedHelper.getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000)),
                verificationToken: seedHelper.getResetToken(),
                createdAt,
                updatedAt,
                deletedAt: null,
            }
        });

        users.push({
            ...user,
            id: user.id.toString(),
        });
    }

    console.log(`🌱 Created ${usersData.length} users successfully!`);

    const userRecords = await prisma.user.findMany();

    /** SEED TUTORIALS **/

    console.log('🌱 Seeding tutorials...');

    const tutorials: Tutorial[] = [];

    for (const tutorialData of tutorialsData) {
        const tutorialDataToCreate = {
            title: tutorialData.title,
            description: tutorialData.description,
            content: tutorialData.content,
            cost: tutorialData.cost,
            isLocked: tutorialData.isLocked,
            authorId: userRecords[Math.floor(Math.random() * userRecords.length)].id,
            likes: Math.floor(Math.random() * 100),
            views: Math.floor(Math.random() * 100),
            category: tutorialData.category,
            hasChallenge: tutorialData?.hasChallenge ?? false,
            difficulty: seedHelper.getRandomDifficulty(),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: seedHelper.getTutorialStatus() as TutorialStatus,
            tutorialId: null,
            deletedAt: null,
            stepsId: null,
        };

        const tutorial = await prisma.tutorial.create({
            data: tutorialDataToCreate,
        });

        tutorials.push(tutorial);
    }

    for (let i = 0; i < tutorials.length - 1; i++) {
        await prisma.tutorial.update({
            where: { id: tutorials[i].id },
            data: { nextTutorialId: tutorials[i + 1].id },
        });
    }

    console.log(`🌱 Created ${tutorials.length} tutorials successfully!`);

    const tutorialRecords = await prisma.tutorial.findMany();

    /** SEED QUIZ TAGS */

    console.log('🌱 Seeding tags...');

    const tagsData = [
        { name: "HTML", slug: "html" },
        { name: "CSS", slug: "css" },
        { name: "JavaScript", slug: "javascript" },
        { name: "Web Development", slug: "web-development" },
        { name: "Frontend", slug: "frontend" },
        { name: "Backend", slug: "backend" },
        { name: "Responsive Design", slug: "responsive-design" },
        { name: "Accessibility", slug: "accessibility" },
        { name: "SEO", slug: "seo" },
        { name: "Performance", slug: "performance" }
    ];

    const tags: Tag[] = [];

    for (const tagData of tagsData) {
        const tag = await prisma.tag.create({
            data: {
                name: tagData.name,
                slug: tagData.slug,
            },
        });

        tags.push({ ...tag, id: tag.id.toString() });
    }

    console.log(`🌱 Created ${tags.length} tags successfully!`);

    // const tagRecords = await prisma.tag.findMany();

    /** SEED QUIZZES **/

    console.log('🌱 Seeding quizzes...');

    const quizzes: Quiz[] = [];

    for (let index = 0; index < quizzesData.length; index++) {
        const quizData = quizzesData[index];
        const isTimed = seedHelper.getRandomBool();
        const timeLimit = isTimed ? seedHelper.getRandomTimeLimit() : null;
        const estimatedDuration = isTimed ? timeLimit : 30;

        const createdQuiz = await prisma.quiz.create({
            data: {
                title: quizData.title,
                slug: slugify(quizData.title, { lower: true }),
                isTimed,
                timeLimit,
                tutorialId: tutorialRecords[index].id,
                createdAt: new Date(),
                updatedAt: new Date(),
                maxScore: 100,
                passPercentage: 50,
                difficulty: seedHelper.getRandomDifficulty(),
                order: index + 1,
                tutorialLocked: tutorialRecords[index].isLocked ?? false,
                questionCount: isTimed ? 5 : 10,
                estimatedDuration,
            },
        });

        quizzes.push({
            ...createdQuiz,
            id: createdQuiz.id.toString(),
            tutorialId: createdQuiz.tutorialId.toString(),
            deletedAt: null,
            stepsId: null,
        });
    }

    console.log(`🌱 Created ${quizzes.length} quizzes successfully!`);

    const quizRecords = await prisma.quiz.findMany();

    /** SEED QUIZ QUESTIONS **/

    console.log('🌱 Seeding quiz questions...');

    const quizQuestionsData = [];

    for (let index = 0; index < quizRecords.length; index++) {
        for (let j = 0; j < 5; j++) {
            const updatedQuizQuestion = {
                ...quizQuestionData[j],
                quizId: quizRecords[index].id,
            };
            quizQuestionsData.push(updatedQuizQuestion);
        }
    }

    const quizQuestions: QuizQuestion[] = [];

    for (const quizQuestion of quizQuestionsData) {
        const createQuizQuestion = await prisma.quizQuestion.upsert({
            where: {
                quizId_questionText: {
                    quizId: quizQuestion.quizId,
                    questionText: quizQuestion.questionText,
                },
            },
            update: {},
            create: {
                quizId: quizQuestion.quizId,
                questionText: quizQuestion.questionText,
                options: quizQuestion.options,
                correctAnswer: quizQuestion.correctAnswer,
                xp: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        quizQuestions.push({
            ...createQuizQuestion,
            id: createQuizQuestion.id.toString(),
            quizId: createQuizQuestion.quizId.toString(),
        });
    }

    console.log(`🌱 Created ${quizQuestions.length} quiz questions successfully!`);

    const quizQuestionRecords = await prisma.quizQuestion.findMany();

    /** SEED BADGES **/

    console.log('🌱 Seeding badges...');

    const badgesData = Array.from({ length: 10 }, (_unused, i) => ({
        name: `Badge ${i + 1}`,
        imageUrl: `https://dummyimage.com/100x100/${Math.floor(Math.random() * 16777215).toString(16)}/ffffff.png&text=Badge${i + 1}`,
        xpReq: (i + 1) * 100,
    }));

    const badges: Badge[] = [];

    for (const badgeData of badgesData) {
        const createdBadge = await prisma.badge.create({
            data: {
                name: badgeData.name,
                imageUrl: badgeData.imageUrl,
                xpReq: badgeData.xpReq,
                description: `Description for ${badgeData.name}`,
                createdAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
                updatedAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            },
        });
        badges.push({
            ...createdBadge,
            id: createdBadge.id.toString(),
            createdAt: createdBadge.createdAt,
            updatedAt: createdBadge.updatedAt,
        });
    }

    console.log(`🌱 Created ${badges.length} badges successfully!`);

    const badgeRecords = await prisma.badge.findMany();

    /** Roadmap **/

    console.log('🌱 Seeding roadmaps...');

    const roadmaps: Roadmap[] = [];
    for (const roadmap of roadmapData) {
        const createRoadmap = await prisma.roadmap.create({
            data: {
                title: roadmap.title,
                description: roadmap.description,
                createdAt: roadmap.createdAt,
                updatedAt: roadmap.updatedAt,
                type: seedHelper.getRoadmapType() || roadmap.type,
                category: ['Web Development', 'Data Science', 'Machine Learning', 'Mobile Development'][seedHelper.getRandomInt(0, 3)],
                createdById: userRecords[Math.floor(Math.random() * userRecords.length)].id,
            },
        });
        roadmaps.push(createRoadmap);
    }

    console.log(`🌱 Created ${roadmaps.length} roadmaps successfully!`);
    const roadmapRecords = await prisma.roadmap.findMany();

    /** Roadmap Steps **/

    console.log('🌱 Seeding roadmap steps...');

    await prisma.roadmapStep.deleteMany();

    const roadmapSteps: RoadmapStep[] = [];

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: 'HTML',
                description: 'Learn the basics of HTML.',
                status: StepStatus.COMPLETED,
                roadmapId: roadmaps[0].id,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 1,
                progress: 100,
                completed: seedHelper.getRandomBool(),
                completedAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
                parentId: null,
            },
        }),
    );

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: 'CSS',
                description: 'Understand the fundamentals of CSS.',
                roadmapId: roadmaps[0].id,
                status: StepStatus.IN_PROGRESS,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 2,
                progress: seedHelper.getRandomBool() ? 100 : 0,
                completed: seedHelper.getRandomBool(),
                completedAt: seedHelper.getRandomBool() ? seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
                parentId: roadmapSteps[0].id,
            },
        }),
    );

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: 'JavaScript',
                description: 'Master the essentials of JavaScript.',
                roadmapId: roadmaps[0].id,
                status: StepStatus.IN_PROGRESS,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 3,
                progress: seedHelper.getRandomBool() ? 100 : 0,
                completed: seedHelper.getRandomBool(),
                completedAt: seedHelper.getRandomBool() ? seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
                parentId: roadmapSteps[0].id,
            },
        }),
    );

    /*
    roadmapSteps[0] = await prisma.roadmapStep.update({
        where: { id: roadmapSteps[0].id },
        data: {
            children: {
                connect: [
                    { id: roadmapSteps[1].id },
                    { id: roadmapSteps[2].id },
                ],
            },
        },
    });
    */

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: "Tailwind CSS",
                description: "Learn the basics of Tailwind CSS.",
                roadmapId: roadmaps[0].id,
                status: StepStatus.NOT_STARTED,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 1,
                progress: seedHelper.getRandomBool() ? 100 : 0,
                completed: seedHelper.getRandomBool(),
                completedAt: seedHelper.getRandomBool() ? seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
                parentId: roadmapSteps[1].id,
            }
        })
    )

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: 'React',
                description: 'Get introduced to React.',
                roadmapId: roadmaps[0].id,
                status: StepStatus.NOT_STARTED,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 4,
                progress: seedHelper.getRandomBool() ? 100 : 0,
                completed: seedHelper.getRandomBool(),
                completedAt: seedHelper.getRandomBool() ? seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
                parentId: roadmapSteps[0].id,
            }
        })
    )

    roadmapSteps.push(
        await prisma.roadmapStep.create({
            data: {
                title: 'Node.js',
                description: 'Learn the basics of Node.js.',
                roadmapId: roadmaps[0].id,
                status: StepStatus.NOT_STARTED,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 5,
                progress: seedHelper.getRandomBool() ? 100 : 0,
                completed: seedHelper.getRandomBool(),
                completedAt: seedHelper.getRandomBool() ? seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
                parentId: roadmapSteps[0].id,
            }
        })
    )

    console.log(`🌱 Created ${roadmapSteps.length} roadmap steps successfully!`);

    const roadmapStepsRecords = await prisma.roadmapStep.findMany();

    /** SEED USER PROFILES **/

    console.log('🌱 Seeding user profile...');

    const userProfileData = [];

    for (let i = 0; i < userRecords.length; i++) {
        const xp = Math.floor(Math.random() * 10_000);
        const level = getLevelFromXP(xp);
        const rank = getRankFromLevelXP(level, xp);

        userProfileData.push({
            userId: userRecords[i].id,
            bio: `I'm user ${i + 1}!`,
            location: `Location ${i + 1}`,
            website: `https://example${i + 1}.com`,
            socialLinks: [`https://twitter.com/user${i + 1}`, `https://github.com/user${i + 1}`],
            avatar: `https://i.pravatar.cc/150?u=${userRecords[i].username}`,
            rank,
            level,
            xp,
            levelProgress: Math.floor(Math.random() * level * 100),
            levelProgressMax: level * 100,
            theme: seedHelper.getTheme(),
            lastLogin: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            completedQuizzes: quizRecords.slice(0, Math.floor(Math.random() * quizRecords.length)),
            completedTutorials: tutorialRecords.slice(0, Math.floor(Math.random() * tutorialRecords.length)),
            completedRoadmaps: roadmapRecords.slice(0, Math.floor(Math.random() * roadmapRecords.length)),
            completedSteps: roadmapStepsRecords.slice(0, Math.floor(Math.random() * roadmapStepsRecords.length)),
            createdAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            updatedAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        });
    }

    const userProfiles: UserProfile[] = [];

    for (const userProfile of userProfileData) {
        const createdUserProfile = await prisma.userProfile.upsert({
            where: {
                userId: userProfile.userId,
            },
            update: {},
            create: {
                userId: userProfile.userId,
                bio: userProfile.bio,
                location: userProfile.location,
                website: userProfile.website,
                socialLinks: userProfile.socialLinks,
                avatar: userProfile.avatar,
                level: userProfile.level,
                levelProgress: userProfile.levelProgress,
                levelProgressMax: userProfile.levelProgressMax,
                xp: userProfile.xp,
                rank: userProfile.rank,
                theme: userProfile.theme,
                createdAt: userProfile.createdAt,
                updatedAt: userProfile.updatedAt,
            },
        });
        userProfiles.push({ ...createdUserProfile });
    }

    console.log(`🌱 Created ${userProfiles.length} user profiles successfully!`);

    const userProfileRecords = await prisma.userProfile.findMany();

    console.log('🌱 Seeding transactions...');

    const transactionsData = Array.from({ length: 50 }, () => ({
        profileId: userRecords[Math.floor(Math.random() * userRecords.length)].id,
        amount: Math.floor(Math.random() * 100),
        type: seedHelper.getTransactionType(),
        description: 'Transaction description',
        transactionAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        createdAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }));

    const transactions: CoinTransaction[] = [];

    for (const transactionData of transactionsData) {
        const createdTransaction = await prisma.coinTransaction.upsert({
            where: {
                profileId_transactionAt: {
                    profileId: transactionData.profileId,
                    transactionAt: transactionData.transactionAt,
                },
            },
            update: {},
            create: {
                profileId: transactionData.profileId,
                amount: transactionData.amount,
                type: transactionData.type,
                description: transactionData.description,
                transactionAt: transactionData.transactionAt,
                createdAt: transactionData.createdAt,
                updatedAt: transactionData.updatedAt,
            },
        });
        transactions.push({ ...createdTransaction });
    }
    transactions.sort((a, b) => a.transactionAt.getTime() - b.transactionAt.getTime());

    console.log(`🌱 Created ${transactions.length} transactions successfully!`);

    const transactionRecords = await prisma.coinTransaction.findMany();

    console.log('🌱 Seeding userBadges...');

    const userBadgesData = Array.from({ length: userProfileRecords.length }, (_, i) => ({
        profileId: userProfileRecords[i].userId,
        badgeId: badgeRecords[Math.floor(Math.random() * badgeRecords.length)].id,
        earnedAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        createdAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }));

    const userBadges: UserBadge[] = [];

    for (const userBadge of userBadgesData) {
        const createUserBadge = await prisma.userBadge.create({
            data: userBadge,
        });

        userBadges.push({ ...createUserBadge });
    }

    console.log(`🌱 Created ${userBadgesData.length} user badges successfully!`);

    // const userBadgeRecords = await prisma.userBadge.findMany();

    console.log('🌱 Seeding streaks...');

    const streaksData = Array.from({ length: userRecords.length }, (_, i) => ({
        profileId: userRecords[i].id,
        streak: Math.floor(Math.random() * 100),
        streakDays: Math.floor(Math.random() * 30),
        lastLogin: new Date(Date.now() - 1),
        currentStart: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        currentEnd: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        longestStreak: Math.floor(Math.random() * 100),
        longestStart: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        longestEnd: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        createdAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }));

    const streaks: UserStreak[] = [];

    for (const streak of streaksData) {
        const createStreak = await prisma.userStreak.create({
            data: streak,
        });

        streaks.push({ ...createStreak });
    }

    console.log(`🌱 Created ${streaksData.length} streaks successfully!`);

    // const streakRecords = await prisma.userStreak.findMany();

    /** SEED COIN WALLET **/

    console.log('🌱 Seeding coin wallets...');

    const coinWalletsData = Array.from({ length: userProfileRecords.length }, (_, i) => ({
        profileId: userProfileRecords[i].userId,
        balance: Math.floor(Math.random() * 1000),
        createdAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
        updatedAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
    }));

    const coinWallets: CoinWallet[] = [];

    for (const coinWallet of coinWalletsData) {
        const createCoinWallet = await prisma.coinWallet.create({
            data: coinWallet,
        });

        coinWallets.push({ ...createCoinWallet });
    }

    console.log(`🌱 Created ${coinWallets.length} coin wallets successfully!`);

    // const coinWalletRecords = await prisma.coinWallet.findMany();

    /** SEED QUIZ ATTEMPTS**/

    console.log('🌱 Seeding quiz attempts...');

    const quizAttemptsData: UserQuizAttempt[] = [];

    for (let i = 0; i < quizRecords.filter((q: { tutorialId: string }) => q.tutorialId === tutorialRecords[Math.floor(Math.random() * tutorialRecords.length)].id).length * userProfileRecords.length * 2; i++) {
        const quizId = seedHelper.getQuizId(quizRecords, tutorialRecords);
        const startedAt = seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31));
        const quizRecord = quizRecords.find((q: { id: string }) => q.id === quizId);
        const score = seedHelper.getScoreBasedOnDifficulty(quizRecord?.difficulty || "EASY");
        const profileId = seedHelper.getUniqueUserId(userProfileRecords, quizAttemptsData);

        const completedAt = quizRecord?.timeLimit
            ? new Date(startedAt.getTime() + quizRecord.timeLimit * 60 * 1000)
            : startedAt;

        if (!profileId && !quizId) break;

        quizAttemptsData.push({
            id: crypto.randomUUID(),
            profileId: profileId ?? "defaultProfileId",
            quizId,
            startedAt,
            completedAt,
            score,
            createdAt: startedAt,
            updatedAt: startedAt,
            isPassed: score >= 50,
            feedback: null,
        });
    }

    const quizAttempts: UserQuizAttempt[] = [];
    for (const quizAttempt of quizAttemptsData) {
        const createQuizAttempt = await prisma.userQuizAttempt.create({
            data: {
                profileId: quizAttempt.profileId,
                quizId: quizAttempt.quizId,
                startedAt: quizAttempt.startedAt,
                completedAt: quizAttempt.completedAt,
                score: quizAttempt.score,
                createdAt: quizAttempt.startedAt,
                updatedAt: quizAttempt.startedAt,
            },
        });

        if (!createQuizAttempt) continue;

        quizAttempts.push({
            ...createQuizAttempt,
            id: createQuizAttempt.id.toString(),
            profileId: createQuizAttempt.profileId.toString(),
            quizId: createQuizAttempt.quizId.toString(),
            startedAt: createQuizAttempt.startedAt,
            completedAt: createQuizAttempt.completedAt,
            score: createQuizAttempt.score,
            createdAt: createQuizAttempt.createdAt,
            updatedAt: createQuizAttempt.updatedAt,
        });
    }

    quizAttempts.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());

    console.log(`🌱 Created ${quizAttemptsData.length} quiz attempts successfully!`);

    const quizAttemptRecords = await prisma.userQuizAttempt.findMany();

    /** SEED QUESTION ATTEMPTS **/

    console.log('🌱 Seeding question attempts...');

    const questionAttemptsData = [];
    for (const quizAttempt of quizAttemptRecords) {
        for (const question of quizQuestionRecords) {
            const selectedAnswer = seedHelper.selectedOption(question.id, { options: question.options });
            questionAttemptsData.push({
                userQuizAttemptId: quizAttempt.id,
                questionId: question.id,
                selectedOption: selectedAnswer,
                isCorrect: selectedAnswer === question.correctAnswer,
                xpEarned: selectedAnswer === question.correctAnswer ? question.xp : 0,
                createdAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
                updatedAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)),
            });
        }
    }

    const questionAttempts: UserQuestionAttempt[] = [];
    for (const questionAttempt of questionAttemptsData) {
        const createQuestionAttempt = await prisma.userQuestionAttempt.create({
            data: {
                userQuizAttemptId: questionAttempt.userQuizAttemptId!,
                questionId: questionAttempt.questionId!,
                selectedOption: questionAttempt.selectedOption!,
                isCorrect: questionAttempt.isCorrect!,
                xpEarned: questionAttempt.xpEarned!,
                createdAt: questionAttempt.createdAt!,
                updatedAt: questionAttempt.updatedAt!,
            },
        });
        questionAttempts.push(createQuestionAttempt);
    }

    console.log(`🌱 Created ${questionAttempts.length} question attempts successfully!`);

    // const questionAttemptRecords = await prisma.userQuestionAttempt.findMany();

    /** User Progress **/

    console.log('🌱 Seeding userProgress...');

    const userProgressData = Array.from({ length: 10 }, (_, i) => {
        const profileId = seedHelper.getUserId(userProfileRecords);
        const tutorialId = tutorialRecords[i].id;
        const percentageCompleted = seedHelper.getPercentageCompleted(profileId, tutorialId, quizRecords, quizAttemptRecords);
        const isCompleted = seedHelper.getIsCompleted(percentageCompleted);
        const attempts = seedHelper.getTotalQuizAttemptsByUserAndTutorial(profileId, tutorialId, quizRecords, quizAttemptRecords);
        const bestScore = seedHelper.getBestScoreByUserIdAndTutorialId(profileId, tutorialId, quizRecords, quizAttemptRecords);
        const date = seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31));

        return ({
            profileId,
            tutorialId,
            isCompleted,
            attempts,
            bestScore,
            percentageCompleted,
            interviewCompleted: false,
            challengeCompleted: false,
            completedAt: date,
            createdAt: date,
            updatedAt: new Date(date.getTime() + date.getTime()),
        })
    });

    const usersProgress: UserProgress[] = [];

    for (const userProgress of userProgressData) {
        const createProgress = await prisma.userProgress.create({
            data: {
                profileId: userProgress.profileId!,
                tutorialId: userProgress.tutorialId!,
                isCompleted: userProgress.isCompleted,
                attempts: userProgress.attempts,
                bestScore: userProgress.bestScore,
                percentageCompleted: userProgress.percentageCompleted,
                interviewCompleted: userProgress.interviewCompleted,
                challengeCompleted: userProgress.challengeCompleted,
                completedAt: userProgress.completedAt,
            },
        });
        usersProgress.push({
            ...createProgress,
            profileId: createProgress.profileId.toString(),
            tutorialId: createProgress.tutorialId.toString(),
            isCompleted: createProgress.isCompleted,
            attempts: createProgress.attempts,
            bestScore: createProgress.bestScore,
            percentageCompleted: createProgress.percentageCompleted,
            interviewCompleted: createProgress.interviewCompleted,
            challengeCompleted: createProgress.challengeCompleted,
            completedAt: createProgress.completedAt,
        });
    }

    console.log(`🌱 Created ${userProgressData.length} user progress successfully!`);

    // const userProgressRecords = await prisma.userProgress.findMany();

    /** Last Activity **/
    console.log(`🌱 Seeding last activities...`);

    const type = seedHelper.getActivityType();
    let value = 0;

    const getValue = () => {
        if (type === ActivityType.QUIZ) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.BADGE) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.TRANSACTION) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.TUTORIAL) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.XP) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.COINS) {
            value = Math.floor(Math.random() * 100);
        } else if (type === ActivityType.LEVEL) {
            value = Math.floor(Math.random() * 10);
        }
        return value;
    }

    const getDescription = () => {
        if (type === ActivityType.QUIZ) {
            return quizRecords[Math.floor(Math.random() * quizRecords.length)].title;
        } else if (type === ActivityType.BADGE) {
            return badgeRecords[Math.floor(Math.random() * badgeRecords.length)].name;
        } else if (type === ActivityType.TRANSACTION) {
            return transactionRecords[Math.floor(Math.random() * transactionRecords.length)].description;
        } else if (type === ActivityType.TUTORIAL) {
            return tutorialRecords[Math.floor(Math.random() * tutorialRecords.length)].title;
        } else if (type === ActivityType.XP) {
            return `Earned ${value} XP`;
        } else if (type === ActivityType.COINS) {
            return `Earned ${value} Coins`;
        } else if (type === ActivityType.LEVEL) {
            return `Unlocked Level ${value}`
        }
    }

    const lastActivitiesData = Array.from({ length: userRecords.length }, (_, i) => ({
        userId: userRecords[i].id,
        type: seedHelper.getActivityType(),
        xpAwarded: getValue(),
        description: getDescription(),
        createdAt: seedHelper.getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31))
    }));

    const lastActivities: LastActivity[] = [];
    for (const activity of lastActivitiesData) {
        const createActivity = await prisma.lastActivity.create({
            data: {
                userId: activity.userId,
                type: activity.type,
                xpAwarded: activity.xpAwarded,
                description: activity.description,
                createdAt: activity.createdAt,
            },
        });
        lastActivities.push({ ...createActivity });
    }

    console.log(`🌱 Created ${lastActivities.length} last activities successfully!`);

    /** SEEDING COMPLETED **/

    console.log('✅ Database seeding completed successfully!');
}

main()
    .catch(error => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });





