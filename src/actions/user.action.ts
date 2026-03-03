'use server'
import { authOptions } from "@/lib/auth"
import { uploadFile } from "@/lib/helper/upload"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"

export const userProfile = async () => {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return { status: 400, message: "User not authenticated" };
        }

        const user = await prisma.user.findUnique({
            where: {
                id: session.user?.id || ''
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                isSellerModeActive: true,
                collegeName: true,
                district: true,
                assignmentsWritten: {
                    select: {
                        id: true,
                        status: true,
                        price: true,
                        expectedDate: true,
                    }
                },
                ratingsReceived: {
                    select: {
                        stars: true
                    }
                }
            }
        })

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        return { status: 200, user };

    } catch (error) {
        return { status: 500, message: 'Something went wrong' }
    }
}
export const createWritterProfile = async (type: 'col' | 'writer', formData: FormData) => {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return { status: 400, message: "User not authenticated" };
        }
        if (type === 'writer') {
            const description = formData.get('description') as string;
            const pagePrice = formData.get('page') as string;
            const digramsPrice = formData.get('digram') as string;

            const updatedUser = await prisma.user.update({
                where: {
                    id: session.user?.id || ''
                },
                data: {
                    isSellerModeActive: true,
                    description,
                    pagePrice: pagePrice ? parseFloat(pagePrice) : null,
                    digramsPrice: digramsPrice ? parseFloat(digramsPrice) : null,
                }
            })
            if (!updatedUser) {
                return { status: 404, message: "User not found" };
            }
            return { status: 200, message: "Writter profile created successfully" };
        }
        if (type === 'col') {
            const collegeName = formData.get('collegeName') as string;
            const district = formData.get('district') as string;

            const updatedUser = await prisma.user.update({
                where: {
                    id: session.user?.id || ''
                },
                data: {
                    collegeName,
                    district
                }
            })
            if (!updatedUser) {
                return { status: 404, message: "User not found" };
            }
            return { status: 200, message: "Writter profile created successfully" };
        }

    } catch (error) {
        return { status: 500, message: 'Something went wrong' }
    }
}

export const savePhotoUrlsToDB = async (formData: FormData) => {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return { status: 400, message: "User not authenticated" };
        }
        await uploadFile(formData, session.user?.id as string);
    }

    catch (e) {

    }
}

export const deletePhotos = async (photoUrls: string[]) => {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return { status: 400, message: "User not authenticated" };
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user?.email || ''
            },
            select: {
                showsCasePhotos: true,
            }
        })

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        const updatedPhotos = user.showsCasePhotos.filter(photo => !photoUrls.includes(photo));

        const updatedUser = await prisma.user.update({
            where: {
                email: session.user?.email || ''
            },
            data: {
                showsCasePhotos: updatedPhotos
            }
        })

        if (!updatedUser) {
            return { status: 404, message: "User not found" };
        }

        return { status: 200, message: "Photos deleted successfully" };
    }
    catch (error) {
        return { status: 500, message: 'Something went wrong' }
    }
}

export const allWritters = async (district: string) => {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return { status: 400, message: "User not authenticated" };
        }
        const writters = await prisma.user.findMany({
            where: {
                id: { not: session.user?.id || '' },
                isSellerModeActive: true,
                district
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                showsCasePhotos: true,
                description: true,
                pagePrice: true,
                ratingsReceived: {
                    select: {
                        stars: true,
                    }
                },
                collegeName: true,
                district: true,
            }
        })

        return { status: 200, writters };
    } catch (error) {
    }
}
export const singleWritter = async (id: string , type:'E'|'W') => {
    try {
        const session = await getServerSession(authOptions)
        
        const writters = await prisma.user.findUnique({
            where: {
                id: type==='W' ? id : session?.user?.id
            },
            select: {
                id: true,
                name: true,
                image: true,
                description: true,
                pagePrice: true,
                collegeName: true,
                ratingsReceived: {
                    select: {
                        stars: true,
                    }
                },
                digramsPrice: true,
                showsCasePhotos: true,
            }
        })
        return { status: 200, writters };

    } catch (error) {

    }
}