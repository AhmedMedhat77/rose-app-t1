"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface IDeliveryLocationContext {
  city: string;
  setCity: (city: string) => void;
}

const DeliveryLocationContext = createContext<IDeliveryLocationContext | null>(
  null,
);

export function DeliveryLocationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [city, setCity] = useState("");

  return (
    <DeliveryLocationContext.Provider value={{ city, setCity }}>
      {children}
    </DeliveryLocationContext.Provider>
  );
}

export function useDeliveryLocation() {
  const context = useContext(DeliveryLocationContext);

  if (!context) {
    throw new Error(
      "useDeliveryLocation must be used within DeliveryLocationProvider",
    );
  }

  return context;
}
