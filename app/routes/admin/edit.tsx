import {
  redirect,
  Form,
  useActionData,
  useTransition,
  LoaderFunction,
  useLoaderData,
} from "remix";
import type { ActionFunction } from "remix";
import { createPost, getPost } from "~/post";
import invariant from "tiny-invariant";

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};
type NewPost = {
  title: string;
  slug: string;
  markdown: string;
  body: string;
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");

  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export let loader: LoaderFunction = ({ request }) => {
  let url = new URL(request.url);
  let post_slug = url.searchParams.get("post_slug");

  if (post_slug) return getPost(post_slug);
};

export default function EditPost() {
  const post = useLoaderData();
  const transition = useTransition();
  const errors = useActionData();

  return (
    <Form method="post">
      <p>
        <label>
          Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
          <input type="text" name="title" defaultValue={post?.title} />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
          <input type="text" name="slug" defaultValue={post?.slug} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea rows={20} name="markdown" defaultValue={post?.body} />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Editing.." : "Edit Post"}
        </button>
      </p>
    </Form>
  );
}
