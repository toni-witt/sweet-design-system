"use client";

import { createContext, useContext } from "react";

const noop = () => {};
export const PaletteContext = createContext<() => void>(noop);
export const usePalette = () => useContext(PaletteContext);
