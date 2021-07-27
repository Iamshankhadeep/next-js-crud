import React from "react";

const Login = ({ onSubmitLogIn, onSubmitSignUp }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <>
      <input
        className="border-black border-2 rounded m-1 p-1"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border-black border-2 rounded m-1 p-1"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={"password"}
      />
      <button
        className="border-black border-2 align-center rounded-md m-1 p-1 bg-blue-900 text-white w-11/12 text-center"
        type={"submit"}
        onClick={() => {
          onSubmitLogIn({ username, password });
        }}
      >
        Log In
      </button>
      <button
        className="border-black border-2 align-center rounded-md m-1 p-1 bg-green-600 text-white w-11/12 text-center"
        onClick={() => {
          onSubmitSignUp({ username, password });
        }}
      >
        Sign Up
      </button>
    </>
  );
};

export { Login };
