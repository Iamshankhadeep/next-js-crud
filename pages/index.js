import Head from "next/head";
import styles from "../styles/Home.module.css";
import Redis from "ioredis";
import { Login } from "../components/login";
import { useState } from "react";

let redis = new Redis(process.env.REDIS_URL);

export default function Home({ data }) {
  const [count, setCount] = useState(data);
  const [loggedIn, setLoggedIn] = useState(false);

  const increment = async () => {
    const response = await fetch("/api/incr", { method: "POST" });
    const data = await response.json();
    setCount(data.count);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {loggedIn ? (
          <>
            <h1 className={styles.title}>Welcome to my website</h1>
            <p className={styles.description}>
              Get started by editing <code>pages/index.js</code>
            </p>
            <p className={styles.description}>
              View Count: <b>{count}</b>
            </p>
            <button type="button" onClick={increment}>
              Manual Increment (+1)
            </button>
          </>
        ) : (
          <Login />
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const data = await redis.incr("counter");
  return { props: { data } };
}
