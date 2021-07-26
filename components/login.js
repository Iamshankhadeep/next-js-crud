import React from "react";
const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <input
        value={password}
        onChange={(e) => setUsername(e.target.value)}
        type={"password"}
      />
      <br />
      <input type={"submit"} />
    </div>
  );
};

export { Login };
