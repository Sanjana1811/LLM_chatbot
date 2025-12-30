import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatWith from './pages/ChatWith';
import CustomFeed from "./pages/CustomFeeds/CustomFeed";
import Art from "./pages/CustomFeeds/Art";
import Entertainment from "./pages/CustomFeeds/Entertainment";
import Science from "./pages/CustomFeeds/Science";
import Tech from "./pages/CustomFeeds/Tech";
import News from "./pages/CustomFeeds/News";
import Sports from "./pages/CustomFeeds/Sports";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home / AI Assistant */}
        <Route path="/" element={<ChatWith />} />

        {/* Custom Feed Carousel */}
        <Route path="/feed" element={<CustomFeed />} />

        {/* Category Pages */}
        <Route path="/feed/art" element={<Art />} />
        <Route path="/feed/entertainment" element={<Entertainment />} />
        <Route path="/feed/science" element={<Science />} />
        <Route path="/feed/tech" element={<Tech />} />
        <Route path="/feed/news" element={<News />} />
        <Route path="/feed/sports" element={<Sports />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// import { useState } from 'react'
// import ChatWith from './pages/ChatWith';
// import './App.css'

// function App() {
//   // const [count, setCount] = useState(0)

//   return (
//     <>
//       <ChatWith />
//     </>
//   )
// }

// export default App
