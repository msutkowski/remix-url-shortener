import type { LinksFunction, LoaderFunction } from "remix";
import { Meta, Links, Scripts, useRouteData, LiveReload } from "remix";
import { Outlet } from "react-router-dom";

import stylesUrl from "./styles/global.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export let loader: LoaderFunction = async () => {
  return {
    date: new Date(),
  };
};

function Document({ children }: { children: React.ReactNode }) {
  let data = useRouteData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  let data = useRouteData();
  return (
    <Document>
      <Outlet />
      <footer>
        <p>
          &#127871; This page was rendered at{" "}
          {new Date(data.date).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZoneName: "short",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </p>
      </footer>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>This is unfortunate</h1>
      <pre>{error.message}</pre>
      <p>Trying reloading the page.</p>
    </Document>
  );
}
