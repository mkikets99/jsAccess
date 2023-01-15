import { ActionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import Lang, { getLanguages } from "~/language";
import { commitSession, getSession } from "~/MemorySession";

export default function SetupIndex() {
  let lang = new Lang("en_US");

  let langs: any = getLanguages();
  return (
    <>
      <div className="row">
        <h1>{lang.get("setup.0.head")}</h1>
      </div>
      <hr />
      <Form method="post">
        <div className="row">
          <label htmlFor="lang">{lang.get("setup.lang")}:</label>
          <select className="u-full-width" name="lang" id="lang">
            <option key={-1} selected value={lang.get("language.code")}>
              {lang.get("language.name")}
            </option>
            {Object.keys(langs).map((k, i) => {
              return (
                <option key={i} value={k}>
                  {langs[k]}
                </option>
              );
            })}
          </select>
        </div>
        <div className="row">
          <input
            className="u-full-width button-primary"
            type="submit"
            value={lang.get("setup.next")}
          />
        </div>
      </Form>
    </>
  );
}

export async function action({ request }: ActionArgs) {
  let data = await request.formData();
  let lang = (await data.get("lang")) as string;
  let session = await getSession(request.headers.get("Cookies"));
  session.set("setup.lang", lang);
  return redirect("/setup/step/1", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
