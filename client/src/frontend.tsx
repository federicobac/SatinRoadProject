/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {Toaster} from "react-hot-toast";
import {Routing} from "@/Routing.tsx";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
      <Toaster position="top-right"/>
      <Routing />
  </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
