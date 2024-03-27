import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const App = () => {
  const code = new URLSearchParams(window.location.search).get("code");

  return code ? <Dashboard code={code} /> : <Login />;
};

export default App;
