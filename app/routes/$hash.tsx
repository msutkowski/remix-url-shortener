import { Link, redirect } from "remix";
import type { LoaderFunction } from "remix";
import prisma from "../db";

export let loader: LoaderFunction = async ({ params }) => {
  const result = await prisma.link.findUnique({ where: { hash: params.hash } });

  if (result) {
    return redirect(result.long_url);
  }

  // Gotta return something, even if it's not used!
  return {};
};

export default function NotFoundLink() {
  return (
    <div>
      <h2>&#x1F47B; How spooky!</h2>
      <div>
        This link doesn't appear to exist. <Link to="/">Generate one?</Link>
      </div>
    </div>
  );
}
