import "./index.css";
import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { PasswordGate } from "./components/PasswordGate";

render(
  <PasswordGate>
    <App />
  </PasswordGate>,
  document.getElementById("root")
);