import { Route, Routes } from "react-router-dom";


import TableView from "@/pages/table";
import ListView from "./pages/list";

function App() {
  return (
    <Routes>
      <Route element={<TableView />} path="/" />
      <Route element={<ListView />} path="/list" />
    </Routes>
  );
}

export default App;
