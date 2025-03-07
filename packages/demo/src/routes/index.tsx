import { Route, Routes } from "react-router-dom";

import { Demo } from "@/pages/demo/demo";

export const Router = () => {
  return (
    <Routes>
      <Route path="/demo" element={<Demo />} />
    </Routes>
  );
};
