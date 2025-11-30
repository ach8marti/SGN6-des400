// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import IndexPage from "./IndexPage/IndexPage";
import Lock from "./Phone/Lock";
import Unlock from "./Phone/Unlock";
import MessageApp from "./Phone/MessageApp";
import Chat from "./Phone/Chat";
import Character from "./Character/Character";
import Evidence from "./Evidence/Evidence";
import BadEnd from "./Ending/BadEnd";
import GoodEnd from "./Ending/GoodEnd";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/lock" element={<Lock />} />
        <Route path="/unlock" element={<Unlock />} />
        <Route path="/messages" element={<MessageApp />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/suspects" element={<Character />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/bad-end" element={<BadEnd />} />
        <Route path="/good-end" element={<GoodEnd />} />
      </Routes>
    </Router>
  );
}