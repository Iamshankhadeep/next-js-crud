import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Login } from "../components/login";
import { useEffect, useState } from "react";
import crypto from "crypto";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [username, setUsername] = useState("blank");
  const [addTodo, setAddTodo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [listData, setListData] = useState("");
  const [updateId, setUpdateId] = useState("");
  console.log(listData, "list data");
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

  const getTodoList = async () => {
    const response = await fetch("/api/list", {
      method: "POST",
      body: JSON.stringify({ type: "get", username }),
    });
    const data = await response.json();
    setListData(data.list);
    console.log(data, "data get todo list");
  };

  const addToList = async () => {
    const timeNow = new Date().getTime();
    const hash = crypto
      .pbkdf2Sync(`${timeNow}:${username}`, "niceList", 1000, 64, `sha256`)
      .toString(`hex`);

    const dataList = {
      id: hash.slice(0, 10),
      title: addTodo,
      createdAt: timeNow,
      expiresAt: new Date(date).getTime(),
      isDone: false,
    };
    const dataListS = JSON.stringify({ type: "add", username, ...dataList });
    console.log(dataListS, "data");
    const response = await fetch("/api/list", {
      method: "POST",
      body: JSON.stringify({ type: "add", username, ...dataList }),
    });
    const data = await response.json();
    await getTodoList();
  };

  const onListDelete = async (id) => {
    const dataListS = JSON.stringify({ type: "remove", username, id });
    console.log(dataListS, "data");
    const response = await fetch("/api/list", {
      method: "POST",
      body: JSON.stringify({ type: "remove", username, id }),
    });
    const data = await response.json();
    console.log(data, "data on list delete");
    await getTodoList();
  };

  const onListUpdate = async (id) => {
    const response = await fetch("/api/list", {
      method: "POST",
      body: JSON.stringify({
        type: "update",
        username,
        id,
        title: addTodo,
        expiresAt: new Date(date).getTime(),
        isDone: false,
      }),
    });
    const data = await response.json();
    console.log(data, "data on list delete");
    await getTodoList();
    setUpdateId("");
    setAddTodo("");
    setDate(new Date().toISOString().slice(0, 16));
  };

  useEffect(() => {
    getTodoList();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {loggedIn ? (
          <>
            <h1 className={styles.title}>TODO list</h1>
            <p>
              You are logged in as <strong>{username}</strong>.
            </p>
            <div>
              <input
                type="text"
                className="border-black border-2 rounded m-1 p-1"
                value={addTodo}
                onChange={(e) => setAddTodo(e.target.value)}
              />
              <input
                type="datetime-local"
                className="border-black border-2 rounded m-1 p-1"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  console.log(e.target.value, "date");
                }}
              />
              <button
                onClick={() => {
                  if (updateId) {
                    onListUpdate(updateId);
                  } else {
                    addToList();
                  }
                }}
                className="border-black border-2 align-center rounded-md m-1 p-1 bg-blue-900 text-white text-center"
              >
                {updateId ? "Update" : "Add Todo"}
              </button>
            </div>
            <hr className="w-1" />
            <div className="flex-col w-10/12">
              <ul className="list-disc">
                {listData
                  ? listData.map((item, index) => (
                      <li className="w-full" key={item.id}>
                        <strong>{item.title}</strong>
                        <button
                          name={item.id}
                          onClick={(e) => {
                            onListDelete(e.target.name);
                            // console.log(e);
                          }}
                          className="border-black border-2 align-center text-white self-end rounded-md m-1 p-1 bg-red-900"
                        >
                          delete
                        </button>
                        <button
                          name={item.title}
                          id={`${item.id}_${item.expiresAt}`}
                          onClick={(e) => {
                            const [id, time] = e.target.id.split("_");
                            console.log(time, "times value");
                            setDate(
                              new Date(Number(time)).toISOString().slice(0, 16)
                            );
                            setAddTodo(e.target.name);
                            setUpdateId(id);
                          }}
                          className="border-black border-2 align-center rounded-md m-1 p-1 bg-green-600 text-white text-center"
                        >
                          update
                        </button>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
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
