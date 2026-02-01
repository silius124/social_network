async function getFeedFriends(userId = 10) {
  const friendShip = await prisma.friendShip.findMany({
    where: {
      status: "accepted",
      OR: [{ requesterId: userId }, { receiverId: userId }],
    },
  });

  const friends = friendShip.map((f) =>
    f.requesterId === 10 ? f.receiverId : f.requesterId,
  );

  const feed = await prisma.post.findMany({
    where: {
      userId: {
        in: friends,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    ...(cursorId && {
      cursor: { id: cursorId },
      skip: 1,
    }),
  });
}
