import { json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Lang from "~/language";
import { getSession } from "~/MemorySession";

export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("Cookies"));
  let lang = session.get("setup.lang");
  return json({ lang });
}

export default function Step1() {
  let data = useLoaderData();
  let lang = new Lang(data.lang);
  return (
    <>
      <div className="row">
        <h1>{lang.get("setup.1.head")}</h1>
      </div>
      <div className="row">{lang.get("setup.1.body")}</div>
      <hr />
      <Form method="post" reloadDocument={false}>
        <div className="row">
          <label htmlFor="path">Path to logs folder:</label>
          <input className="u-full-width" id="path" type="text" />
        </div>
      </Form>
    </>
  );
}
