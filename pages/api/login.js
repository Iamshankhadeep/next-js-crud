import Redis from "ioredis";

let redis = new Redis(process.env.REDIS_URL);

export default async (req, res) => {
  if (req.method !== "POST") {
    res
      .status(400)
      .send({ message: "Only POST requests allowed", success: false });
    return;
  }
  const { username, password } = JSON.parse(req.body);
  const userData = await redis.hgetall(username);
  console.log(userData);
  if (password === userData.password) {
    res.status(200).json({ username, success: true });
    return;
  }
  res.status(401).json({ success: false });
};
