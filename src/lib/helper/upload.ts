import prisma from '@/lib/prisma';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function uploadFile(formData: FormData, userId: string) {
  const files = formData.getAll('photos') as File[];
  const urls: string[] = []

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploaded = await imagekit.upload({
      file: buffer,
      fileName: userId + '-' + file.name,
      folder: '/writeforother',
    })

    urls.push(uploaded.url)

    const res = await prisma.user.update({
      where: { id: userId },
      data: {
        showsCasePhotos: {
          push: uploaded.url
        }
      }
    })

  }

}