import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import { parseLog } from "~/components/utilities";

export async function loader({ request }: LoaderArgs) {
  // console
  // .log
  // parseLog(
  //   '',
  //   '[%d:%t %^] %^ %^ %s - %m %^ %v "%U" [Client %h] [Length %b] [Gzip %^] [Sent-to %^] "%u" "%R"'
  // )
  // ();
  return json({});
}

export default function Index() {
  let dt = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
