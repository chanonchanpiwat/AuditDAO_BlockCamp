export const mockBounty = [
  {
    projectId: "12345",
    projectName: "ToTheMoon",
    title: "Buy the dip",
    description:
      "Cypherpunk | Minted in 🇦🇷 | Smart Contracts at @lensprotocol by Aave",
    bounty: 450,
    asset: "DAI",
    image: "ToTheMoon",
  },
  {
    projectId: "54321",
    projectName: "GoodMorning",
    title: "Wake up early",
    description: "The early bird is drowsy",
    bounty: 12,
    asset: "DAI",
    image: "earlyBird",
  },
  {
    projectId: "5678",
    projectName: "Scam",
    title: "Don't buy it ",
    description: "This project is scam",
    bounty: 300,
    asset: "DAI",
    image: "Scam",
  },
  {
    projectId: "91011",
    projectName: "FakeContract",
    title: "Contract for scamer",
    description: "This contract is create for scam everyone",
    bounty: 4500,
    asset: "DAI",
    image: "fake",
  },
];

export const mockComments = [
  {
    from: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    description: "You should delete your community 🥰",
    like: 90,
    reply: [
      {
        commentId: "1234",
        from: "0x70997970C51812dc",
        description: "🥳 Suck comment i ever seen\nasdasdasdasdasdas\nGGGGGGGGGG",
      },
      {
        commentId: "4321",
        from: "0x010C7d01b50e0d17dc79C8",
        description: "Good comment, GO GO GO 🤬",
      },
      {
        commentId: "5678",
        from: "0x12dc3A010C7d01b50e0d17d",
        description: "............................Just Spam ...............",
      },
    ],
  },
  {
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    description: "Your project is scam 😶‍🌫️",
    like: 120,
    reply: [
      {
        commentId: "1234",
        from: "0x70997970C51812dc",
        description: "Suck comment i ever seen\nasdasdasdasdasdas\nGGGGGGGGGG",
      },
      {
        commentId: "4321",
        from: "0x010C7d01b50e0d17dc79C8",
        description: "Good comment, GO GO GO",
      },
    ],
  },
  {
    from: "0x9612aBFa520e1F0A3Ee2B9A683bcC599eF652b44",
    description: "I like your project, go to the moon",
    like: -5,
  },
];
