// ESM
import { faker } from "@faker-js/faker";

export function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
}

export const USERS = faker.helpers.multiple(createRandomUser, {
  count: 5,
});

export const exploreDatas = [
  {
    id: 1,
    title: "Just Cut CNX",
    category: "Hair Cut",
    imageURL: [
      "https://placehold.jp/164x164.png",
      "https://placehold.jp/164x164.png",
      "https://placehold.jp/164x164.png",
    ],
    descriiption: `Welcome to "Just Cut.", where style meets comfort in every snip! Located in a cozy corner of town, our warm and inviting atmosphere greets you the moment you step through the door. With soft, plush seating and soothing music playing in the background, we've created the perfect oasis for your hair care needs.`,
    phoneNumber: "+1 (123) 456 789",
    address: "Nimmanhaemin Road Chiangmai Thailand",
    latitude: "40.7128",
    longitude: "74.0060",
  },
];
