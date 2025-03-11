import prisma from "@/lib/prisma";
import { title } from "process";

async function main() {
    console.log('🌱 Seeding database...');

    const user1 = await prisma.user.upsert({
        where: { email: 'alice@mail.com' },
        update: {},
        create: {
            name: 'Alice',
            email: 'alice@mail.com',
            avatar: 'https://i.pravatar.cc/150?u=alice',
            points: 100,
            badges: ['First Badge',
                'Second Badge'
            ],
            achievements: [
                'First Achievement',
                'Second Achievement'
            ]

        }
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'bob@mail.com' },
        update: {},
        create: {
            name: 'Bob',
            email: 'bob@mail.com',
            avatar: 'https://i.pravatar.cc/150?u=bob',
            points: 200,
            badges: [
                'Third Badge',
                'Fourth Badge'
            ],
            achievements: [
                'Third Achievement',
                'Fourth Achievement',
            ]

        }
    });

    const user3 = await prisma.user.upsert({
        where: { email: 'charlie@mail.com' },
        update: {},
        create: {
            name: 'Charlie',
            email: 'charlie@mail.com',
            avatar: 'https://i.pravatar.cc/150?u=charlie',
            points: 300,
            badges: [
                'Fifth Badge',
                'Sixth Badge'
            ],
            achievements: [
                'Fifth Achievement',
                'Sixth Achievement'
            ]
        }
    });

    const pointsData = [
        {
            userId: user1.id,
            points: 100,
            reason: 'First points',
            date: new Date()
        },
        {
            userId: user2.id,
            points: 200,
            reason: 'Quiz Passed first attempt',
            date: new Date()
        },
        {
            userId: user3.id,
            points: 300,
            reason: 'Third points',
            date: new Date()
        },
        {
            userId: user1.id,
            points: 400,
            reason: 'Completed React.js Course',
            date: new Date()
        },
        {
            userId: user2.id,
            points: 500,
            reason: 'Quiz Passed second attempt',
            date: new Date()
        },
        {
            userId: user3.id,
            points: 600,
            reason: 'Sixth points',
            date: new Date()
        }
    ];

    await prisma.point.createMany({
        data: pointsData
    });

    const quiz1 = await prisma.quiz.create({
        data: {
            title: 'Quiz 1',
            description: 'This is the first quiz',
        },
    });

    const questions1 = [
        {
            quizId: quiz1.id,
            text: 'What is 2 + 2?',
            options: ['1', '2', '3', '4'],
            answer: '4',
            points: 1
        },
        {
            quizId: quiz1.id,
            text: 'What is 3 * 3?',
            options: ['6', '9', '12', '15'],
            answer: '9',
            points: 1
        },
        {
            quizId: quiz1.id,
            text: 'What is 10 / 2?',
            options: ['2', '3', '4', '5'],
            answer: '5',
            points: 1
        }
    ];

    await prisma.question.createMany({
        data: questions1
    });

    const attemps1 = [
        {
            userId: user1.id,
            quizId: quiz1.id,
            score: 2
        },
        {
            userId: user2.id,
            quizId: quiz1.id,
            score: 3
        },
        {
            userId: user3.id,
            quizId: quiz1.id,
            score: 1
        }
    ];

    await prisma.attempt.createMany({
        data: attemps1
    });

    const quiz2 = await prisma.quiz.create({
        data: {
            title: 'Quiz 2',
            description: 'This is the second quiz',
        },
    });

    const questions2 = [];

    for (let i = 0; i < 10; i++) {
        questions2.push({
            quizId: quiz2.id,
            text: `What is ${i} + ${i}?`,
            options: ['1', '2', '3', '4'],
            answer: `${i + i}`,
            points: 1
        });
    }

    await prisma.question.createMany({
        data: questions2
    });

    const attemps2 = [
        {
            userId: user1.id,
            quizId: quiz2.id,
            score: 2
        },
        {
            userId: user2.id,
            quizId: quiz2.id,
            score: 3
        },
        {
            userId: user3.id,
            quizId: quiz2.id,
            score: 1
        }
    ];

    await prisma.attempt.createMany({
        data: attemps2
    });


    console.log('✅ Seeding completed!');
}

main().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});