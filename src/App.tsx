import React from "react";
import "./App.css";
import HomeView from "./containers/HomeView";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SignInView from "./containers/SignInView";
import SignUpView from "./containers/SignUpView";
import FigmaDetectFileKeyView from "./containers/FigmaDetectFileView";
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SignUpView />} />
          <Route path="/sign-in" element={<SignInView />} />
          <Route path="/figma-detect-file" element={<FigmaDetectFileKeyView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
