// import React from "react";
import "./App.css";
// import FlowChart from "./components/FlowChart";
// function App() {
//   return (
//     <div>
//       <h1 style={{ textAlign: "center" }}>
//         AutoMailr - Email Sequence Builder
//       </h1>
//       <FlowChart />
//     </div>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CSVUpload from "./components/CSVUpload";
import FlowChart from "./components/FlowChart";
import CsvMapper from "./CSVMapper";
import NameYourList from "./components/NameYourList";
// import NextPage from "./components/NextPage";
// import NameYourList from "./components/NameYourList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FlowChart />} />
        <Route path="/add-new-list" element={<CSVUpload />} />

        <Route path="/mapper" element={<CsvMapper />} />
        <Route path="/final-step" element={<NameYourList />} />
      </Routes>
    </Router>
  );
};

export default App;
