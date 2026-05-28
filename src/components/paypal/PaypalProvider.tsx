"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import type { ReactNode } from "react";

export function PaypalProvider({
  clientId,
  children,
}: {
  clientId: string;
  children: ReactNode;
}) {
  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
