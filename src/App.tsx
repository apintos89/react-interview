import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TodoLists } from "./pages/TodoLists";
import { ListItems } from "./pages/ListItems";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<TodoLists />} />
        <Route path="/list/:listId" element={<ListItems />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
