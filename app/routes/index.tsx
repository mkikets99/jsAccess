import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import { parseLog } from "~/components/utilities";

export async function loader({ request }: LoaderArgs) {
  // console
    // .log
    // parseLog(
    //   '[16/Jan/2023:08:35:20 +0000] - 200 200 - GET https kubaydesign.de "/brabus-led-kuhlergrill-rotes-abzeichen-emblem-logo-fur-mercedes-w463-g-wagon-g63-g500-g55-1.html" [Client 114.119.155.210] [Length 17247] [Gzip -] [Sent-to 172.16.1.2] "Mozilla/5.0 (Linux; Android 7.0;) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; PetalBot;+https://webmaster.petalsearch.com/site/petalbot)" "https://kubaydesign.de/catalog/category/view/s/g-class-w463-4x4/id/53/"',
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
