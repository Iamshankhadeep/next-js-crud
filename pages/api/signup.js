import Redis from "ioredis";

let redis = new Redis(process.env.REDIS_URL);

export default async (req, res) => {
  if (req.method !== "POST") {
    res
      .status(400)
      .send({ message: "Only POST requests allowed", succes: false });
    return;
  }
  const { username, password } = JSON.parse(req.body);
  const data = await redis.hgetall(username);
  if (!data.username) {
    await redis.hmset(username, { username, password });
    res.status(200).json({ succes: true });
    return;
  }
  res
    .status(400)
    .send({ message: "Username already in the database", succes: false });
};
