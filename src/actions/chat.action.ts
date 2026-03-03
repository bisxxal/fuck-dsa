'use server'

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const createChatParticipant = async (receiverId: string) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { status: 500, message: 'Not authorized user' };
        }

        const currentUserId = session.user.id;

        const existingChat = await prisma.chat.findFirst({
            where: {
                participants: {
                    every: {
                        userId: {
                            in: [currentUserId, receiverId],
                        },
                    },
                    some: {
                        userId: currentUserId,
                    },
                },
            },
            include: {
                participants: true,
            },
        });

        if (existingChat && existingChat.participants.length === 2) {
            const hasBothUsers = existingChat.participants.some(p => p.userId === currentUserId)
                && existingChat.participants.some(p => p.userId === receiverId);
            if (hasBothUsers) {
                return { chatId: existingChat.id };
            }
        }

        const chat = await prisma.chat.create({
            data: {
                participants: {
                    create: [
                        { user: { connect: { id: currentUserId } } },
                        { user: { connect: { id: receiverId } } },
                    ],
                },
            },
        });

        return { chatId: chat.id };

    } catch (error) {
        console.error('Error creating or fetching chat:', error);
        return { status: 500, message: 'Internal server error' };
    }
}


export const getChatUsers = async () => {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'Not authorized user' }));
        }

        const chats = await prisma.chatParticipant.findMany({
            where: { userId: session.user.id },
            include: {
                // user: true,
                chat: {
                    select: {
                        messages: {
                            orderBy: {
                                createdAt: 'desc'
                            },
                            select: {
                                content: true,
                                createdAt: true,
                            },
                            take: 1
                        },
                        participants: {
                            where: {
                                userId: { not: session.user.id }
                            },
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                        id: true,
                                        image: true,
                                    }
                                }
                            }
                        },
                    }

                }
            }
        })

        return JSON.parse(JSON.stringify({chats, userId: session.user.id}));
    } catch (error) {

    }
}



export const deleteSelectMessages = async (messageId: string[]) => {
    try {
        const res = await prisma.message.deleteMany({
            where: {
                id: {
                    in: messageId
                }
            }
        })
        if (!res) {
            return JSON.parse(JSON.stringify({ status: false }));
        }

        return JSON.parse(JSON.stringify({ status: true }));
    } catch (error) {
        return JSON.parse(JSON.stringify({ status: false }));
    }
}