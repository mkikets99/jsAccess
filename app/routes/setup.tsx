import { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { StyleSheet } from "~/components/interfaces";
import setups from "~/styles/setup.css";

export default function SetupContainer() {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: setups }];
}
