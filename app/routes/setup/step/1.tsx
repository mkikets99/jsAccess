import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import Lang from "~/language";
import { getSession } from "~/MemorySession";
import { checkLog, tryLog } from "~/utils/parser.server";

export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("Cookies"));
  let lang = session.get("setup.lang");
  return json({ lang });
}

export default function Step1() {
  let data = useLoaderData();
  let errors = useActionData();
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
          <label htmlFor="path">{lang.get("setup.1.path")}:</label>
          <span className="annotation">{lang.get("setup.1.path2")}</span>
          <input
            className="u-full-width"
            required
            placeholder="/path/to/the/log/file.log"
            id="path"
            type="text"
            name="path"
          />
          <span className="error annotation">{errors?.path}</span>
        </div>
        <div className="row">
          <input
            className="u-full-width button-primary"
            type={"submit"}
            value={lang.get("setup.next")}
          />
        </div>
      </Form>
    </>
  );
}

export async function action({ request }: ActionArgs) {
  let form = await request.formData();
  let pathToLog = (await form.get("path")) as string | null;
  let act = await tryLog(pathToLog || "");
  if (!act?.ok) {
    let error: any = {};
    if (act?.reason === "path.noexists") {
      error.path = "This Path is not exists. Please provide valid path.";
    }
    console.log(act);
    return json(error);
  }
  return json({});
}
