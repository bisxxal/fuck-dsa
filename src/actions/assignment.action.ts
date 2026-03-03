'use server'

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const createAssignment = async (formData: FormData) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'Not authorized user' }));
        }
        const amount = formData.get('amount') as string;
        const buyerId = formData.get('buyerId') as string;
        const expectedDate = formData.get('expectedDate') as string;

        if (!amount || !buyerId) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'all field is require' }));
        }

        const res = await prisma.assignment.create({
            data: {
                price: parseFloat(amount),
                status: 'PENDING',
                buyerId,
                writerId: session.user?.id || '',
                expectedDate: expectedDate ? new Date(expectedDate) : new Date(),
            }
        })
        if (res) {
            return JSON.parse(JSON.stringify({ status: 200, message: 'Assignment created successfully' }));
        }
        return JSON.parse(JSON.stringify({ status: 500, message: 'Something went wrong' }));
    } catch (error) {

    }
}

export const getAssignments = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'Not authorized user' }));
        }

        const res = await prisma.assignment.findMany({
            where: {
                OR: [
                    { buyerId: session.user?.id || '' },
                    { writerId: session.user?.id || '' }
                ]
            },
            select: {
                id: true,
                price: true,
                status: true,
                createdAt: true,
                expectedDate: true,
                rating: {
                    select: {
                        stars: true
                    }
                },
                buyer: {
                    select: {
                        name: true,
                        image: true, id: true
                    }
                },
                writer: {
                    select: {
                        name: true,
                        image: true, id: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        if (res) {
            return JSON.parse(JSON.stringify({ status: 200, data: res }));
        }
        return JSON.parse(JSON.stringify({ status: 500, message: 'Something went wrong' }));
    } catch (error) {

    }
}

export const updateAssignmentStatus = async (assignmentId: string, status: 'PENDING' | 'COMPLETED') => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'Not authorized user' }));
        }

        if (!assignmentId) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'Assignment id is required' }));
        }
        const res = await prisma.assignment.updateMany({
            where: {
                id: assignmentId,
                writerId: session.user?.id || ''
            },
            data: {
                status,
                expectedDate: new Date()
            }
        })

        if (res) {
            return JSON.parse(JSON.stringify({ status: 200, message: 'Assignment status updated successfully' }));
        }
        return JSON.parse(JSON.stringify({ status: 500, message: 'Something went wrong' }));
    } catch (error) {

    }
}

export const rateAssignment = async (assignmentId: string, rating: number, buyerId: string, writerId: string) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'Not authorized user' }));
        }

        if (!assignmentId || !rating || !writerId) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'Assignment id is required' }));
        }
        const res = await prisma.rating.create({
            data: {
                assignmentId,
                buyerId: session.user?.id || '',
                writerId,
                stars: rating
            }
        })

        if (res) {
            return JSON.parse(JSON.stringify({ status: 200, message: 'Assignment rated successfully' }));
        }
        return JSON.parse(JSON.stringify({ status: 500, message: 'Something went wrong' }));

    }
    catch (error) {

    }
}

export const getTransactionsBySelectedMonth = async (selectedMonth:number, selectedYear:number) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return JSON.parse(JSON.stringify({ status: 500, message: 'Not authorized user' }));
        }

        const completedAssignments = await prisma.assignment.findMany({
            where: {
                writerId: session.user?.id || '',
                status: 'COMPLETED',
                expectedDate: {
                    gte: new Date(selectedYear, selectedMonth, 1),
                    lt: new Date(selectedYear, selectedMonth + 1, 1)
                }
            },
            select: {
                price: true,
                expectedDate: true,
            }
        });


        return JSON.parse(JSON.stringify({ status: 200, data: completedAssignments }));
    } catch (error) {
        return JSON.parse(JSON.stringify({ status: 500, message: 'Something went wrong' }));
    }
}   