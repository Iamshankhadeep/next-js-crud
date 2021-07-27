import Head from "next/head";
import styles from "../styles/Home.module.css";
import Redis from "ioredis";
import { Login } from "../components/login";
import { useState } from "react";

let redis = new Redis(process.env.REDIS_URL);

export default function Home({ data }) {
  const [count, setCount] = useState(data);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const increment = async () => {
    const response = await fetch("/api/incr", { method: "POST" });
    const data = await response.json();
    setCount(data.count);
  };

  const onSubmitLogIn = async (data) => {
    const responseLogIN = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const dataLogIn = await responseLogIN.json();
    console.log(dataLogIn, "data");
    if (dataLogIn.success) {
      setLoggedIn(true);
      setUsername(dataLogIn.username);
    }
  };

  const onSubmitSignUp = async (data) => {
    const responseSignUp = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await responseSignUp.json();
    console.log(res, "data signup");
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {loggedIn ? (
          <>
            <h1 className={styles.title}>Welcome to my website</h1>
            <p>
              You are logged in as <strong>{username}</strong>.
            </p>
          </>
        ) : (
          <>
            <div className="text-center">
              <p>You are not logged in, Log in</p>
            </div>
            <Login
              onSubmitLogIn={onSubmitLogIn}
              onSubmitSignUp={onSubmitSignUp}
            />
          </>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const data = await redis.incr("counter");
  return { props: { data } };
}
