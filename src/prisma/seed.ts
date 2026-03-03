
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
 

async function main() {
  // const samplePhotos = [];
  // for (let i = 1; i <= 20; i++) {
  //   const gender = i % 2 === 0 ? 'women' : 'men';
  //   samplePhotos.push(`https://randomuser.me/api/portraits/${gender}/${i}.jpg`);
  // }
  // for (let i = 0; i < 20; i++) {
  //   const user = await prisma.user.create({
  //     data: {
  //       name: `${faker.person.firstName()}_${i}`,
  //       email: faker.internet.email(),
  //       image: samplePhotos[i],
  //       isSellerModeActive:true,
  //       description: faker.lorem.paragraph(),
  //       pagePrice: faker.number.int({ min: 5, max: 20 }),
  //       digramsPrice: faker.number.int({ min: 5, max: 20 }),
  //     },
  //   });
  //   console.log(`Created user with ID: ${user.name}`);
  // }

  for (let i = 0; i < 90; i++) {

    await prisma.message.create({
      data: {
        senderId : 'cmezxu6hm0000t0w0oaanwy5m',
        chatId:'cmfldw8uu0006t0xmjvc9c2w2',
        content:'Hello, bro!',
        createdAt: new Date(Date.now() + 1), 
      },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
    });
     await prisma.message.create({
      data: {
        senderId : 'cmf77d1sv0000t0fg713g7up2',
        chatId:'cmfldw8uu0006t0xmjvc9c2w2',
        content:  `good evening, bro! ${i}`,
        createdAt: new Date(Date.now() + 1), 
      },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
    });
  }
  
}

main()
  .then(() => {
    console.log('Seeding complete!');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Error while seeding:', e);
    return prisma.$disconnect();
  });

