"use client";

import { createContext, useState } from "react";

const Context = createContext<any>({});

export function NavbarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNavbar, setShowNavbar] = useState(true);

  return (
    <Context.Provider
      value={{
        showNavbar,
        setShowNavbar,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
