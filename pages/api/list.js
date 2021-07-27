import Redis from "ioredis";

let redis = new Redis(process.env.REDIS_URL);

export default async (req, res) => {
  const { type, username, ...data } = JSON.parse(req.body);
  const key = `${username}:list`;
  if (type === "add") {
    const dataList = await redis.get(key);
    const { list } = JSON.parse(dataList);
    await redis.set(key, JSON.stringify({ list: [data, ...list] }));
    res.status(200).json({ list: [data, ...list] });
  }
  if (type === "get") {
    const dataList = await redis.get(key);
    const { list } = JSON.parse(dataList);
    res.status(200).json({ list });
  }
  if (type === "remove") {
    const { id } = JSON.parse(req.body);
    const dataList = await redis.get(key);
    const { list } = JSON.parse(dataList);
    const newList = list.filter((item) => item.id !== id);
    await redis.set(key, JSON.stringify({ list: [...newList] }));
    res.status(200).json({ list: [data, ...list] });
  }
  if (type === "update") {
    const { id, username, type, ...data } = JSON.parse(req.body);
    const dataList = await redis.get(key);
    const { list } = JSON.parse(dataList);
    const newList = list.map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    await redis.set(key, JSON.stringify({ list: [...newList] }));
    res.status(200).json({ list: [data, ...list] });
  }
};
