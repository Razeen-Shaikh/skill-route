import prisma from "@/lib/prisma";
import { User } from '@prisma/client';
import bcrypt from "bcryptjs";

const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

async function main() {
    console.log('🌱 Starting database seeding...');

    // Seed Users
    const usersData = [
        {
            email: 'alice@mail.com',
            name: 'Alice',
            password: 'alice_password',
            avatar: 'https://i.pravatar.cc/150?u=alice',
            badges: ['First Badge', 'Second Badge'],
            achievements: ['First Achievement', 'Second Achievement'],
        },
        {
            email: 'bob@mail.com',
            name: 'Bob',
            password: 'bob_password',
            avatar: 'https://i.pravatar.cc/150?u=bob',
            badges: ['Third Badge', 'Fourth Badge'],
            achievements: ['Third Achievement', 'Fourth Achievement'],
        },
        {
            email: 'charlie@mail.com',
            name: 'Charlie',
            password: 'charlie_password',
            avatar: 'https://i.pravatar.cc/150?u=charlie',
            badges: ['Fifth Badge', 'Sixth Badge'],
            achievements: ['Fifth Achievement', 'Sixth Achievement'],
        },
        {
            email: 'kali@mail.com',
            name: 'Kali',
            password: 'kali_password',
            avatar: 'https://i.pravatar.cc/150?u=kali',
            badges: ['Seventh Badge', 'Eighth Badge'],
            achievements: ['Seventh Achievement', 'Eighth Achievement'],
        }
    ];

    const users: User[] = [];

    for (const userData of usersData) {
        users.push(await prisma.user.upsert({
            where: { email: userData.email },
            update: {
                name: userData.name,
                password: await hashPassword(userData.password),
                avatar: userData.avatar,
                badges: userData.badges,
                achievements: userData.achievements,
            },
            create: {
                name: userData.name,
                email: userData.email,
                password: await hashPassword(userData.password),
                avatar: userData.avatar,
                badges: userData.badges,
                achievements: userData.achievements,
                stats: {
                    create: {
                        quizzesAttempted: Math.floor(Math.random() * 10) + 1,
                        bestScore: Math.floor(Math.random() * 100) + 1,
                        coursesCompleted: Math.floor(Math.random() * 10) + 1,
                        streak: Math.floor(Math.random() * 100) + 1,
                        lastActiveDate: getRandomDate(new Date("2021-01-01"), new Date()),
                        rank: Math.floor(Math.random() * 100) + 1,
                        previous_rank: Math.floor(Math.random() * 100) + 1,
                        points: {
                            createMany: {
                                data: Array.from({ length: 4 }, () => ({
                                    points: Math.floor(Math.random() * 1000) + 1,
                                    reason: Math.random() > 0.5 ? 'First points' : 'Completed React.js Course',
                                    date: getRandomDate(new Date("2021-01-01"), new Date()),
                                })),
                            },
                        },
                        progress: {
                            createMany: {
                                data: Array.from({ length: 4 }, () => ({
                                    count: Math.floor(Math.random() * 10) + 1,
                                    date: getRandomDate(new Date("2021-01-01"), new Date()),
                                })),
                            }
                        }
                    },
                }
            }
        }));
    }

    // Seed Quizzes
    const quizzesData = [
        {
            title: 'Quiz 1',
            description: 'This is the first quiz',
            questions: [
                { text: 'What is 2 + 2?', options: ['1', '2', '3', '4'], answer: '4', points: 1 },
                { text: 'What is 3 * 3?', options: ['6', '9', '12', '15'], answer: '9', points: 1 },
                { text: 'What is 10 / 2?', options: ['2', '3', '4', '5'], answer: '5', points: 1 },
            ]
        },
        {
            title: 'Quiz 2',
            description: 'This is the second quiz',
            questions: Array.from({ length: 10 }, (_, i) => ({
                text: `What is ${i} + ${i}?`,
                options: ['1', '2', '3', '4'],
                answer: `${i + i}`,
                points: 1
            }))
        }
    ];

    for (const quizData of quizzesData) {
        await prisma.quiz.create({
            data: {
                title: quizData.title,
                description: quizData.description,
                questions: {
                    createMany: {
                        data: quizData.questions,
                    },
                },
                attempts: {
                    createMany: {
                        data: usersData.map((_, index) => ({
                            userId: users[index].id,
                            score: Math.floor(Math.random() * 4),
                        })),
                    },
                },
            },
        });
    }

    console.log('✅ Database seeding completed!');
}

main().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});