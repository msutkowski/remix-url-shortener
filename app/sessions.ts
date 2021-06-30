import {
  Response,
  json,
  createCookieSessionStorage,
  Request,
  Session,
} from "remix";

let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: { name: "__session" },
});

export async function withSession(
  request: Request,
  next: (session: Session) => Promise<Response> | Response
) {
  let session = await getSession(request.headers.get("Cookie"));

  // pass the session to the loader/action and let it handle the response
  let response = await next(session);

  // if they returned a plain object, turn it into a response
  if (!(response instanceof Response)) {
    response = json(response);
  }

  // commit the session automatically
  response.headers.append("Set-Cookie", await commitSession(session));

  return response;
}

export { getSession, commitSession, destroySession };
