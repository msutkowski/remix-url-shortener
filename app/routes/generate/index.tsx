import { Link, Prisma } from "@prisma/client";
import { nanoid } from "nanoid";
import { ActionFunction, LoaderFunction, MetaFunction, redirect } from "remix";
import prisma from "../../db";
import { withSession } from "../../sessions";

/**
 * Generates a url-safe short code
 *
 * @remarks At 10,000 IDs per second, it'd take roughly 11 days to have a 1% probability of a collision.
 * @link https://zelark.github.io/nano-id-cc/
 * @param length The number of characters to include in generated string
 * @returns string
 */

export const generateShortCode = (length = 12) => {
  return nanoid(length);
};

export let meta: MetaFunction = () => {
  return {
    title: "Generate a URL",
    description: "The fastest url generator in the west",
  };
};

export let action: ActionFunction = async ({ request }) => {
  return withSession(request, async (session) => {
    const hash = generateShortCode();
    const link = `${process.env.APP_URL}/${hash}`;

    let data = Object.fromEntries(
      new URLSearchParams(await request.text())
    ) as { long_url: string };

    const record = { ...data, hash, link };

    // Even though there is a very low chance that we're going to have a collision,
    // let's make it a little safer
    let newRecord: Link | undefined;
    let attempts = 20;
    let errors;
    while (!newRecord && attempts > 0) {
      try {
        newRecord = await prisma.link.create({
          data: record,
        });
        session.flash("generateResult", {
          result: newRecord,
          values: record,
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            attempts--;
          } else {
            session.flash("errors", { errors: err, values: record });
            return redirect(`/`);
          }
        } else {
          session.flash("errors", { errors: err, values: record });
          return redirect(`/`);
        }
      }
    }

    if (!newRecord) {
      session.flash("error", { errors, values: record });
    }

    return redirect(`/`);
  });
};

// Just redirect back home!
export let loader: LoaderFunction = async ({ request, context, params }) =>
  redirect("/");

export default function Index() {
  return (
    <div>
      This is weird, you shouldn't be able to read this. Call &#x1F47B; busters!
    </div>
  );
}
