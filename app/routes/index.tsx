import {
  createSession,
  Form,
  json,
  redirect,
  usePendingFormSubmit,
  useRouteData,
} from "remix";
import { nanoid } from "nanoid";
import { Link, Prisma } from "@prisma/client";

import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";

import stylesUrl from "../styles/index.css";
import { withSession } from "../sessions";

export let meta: MetaFunction = () => {
  return {
    title: "Generate a URL",
    description: "The fastest url generator in the west",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = ({ request }) => {
  return withSession(request, (session) => {
    return json({
      data: session.get("generateError") || session.get("generateResult"),
    });
  });
};

export default function Index() {
  let pendingForm = usePendingFormSubmit();
  let sessionData = useRouteData<{ data: { errors?: any; result?: Link } }>();

  const recentLink = sessionData.data?.result;

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Generate a url!</h2>

      <div>
        <Form method="post" action="/generate">
          <input
            required
            type="text"
            name="long_url"
            placeholder="Shorten a url"
          />
          <button type="submit" disabled={!!pendingForm}>
            {!!pendingForm ? <Loading /> : "Generate it!"}
          </button>
        </Form>

        <div>
          {recentLink && (
            <>
              <p>Here's your link:</p>

              <div style={{ padding: 10 }}>
                <a href={recentLink.link} target="_blank">
                  {recentLink.link}
                </a>
              </div>
              <code>{JSON.stringify(recentLink, null, 2)}</code>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <svg
      className="spin"
      style={{ height: "1rem" }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}
