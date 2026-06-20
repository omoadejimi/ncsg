import { redirect } from "next/navigation";

/** /docs has no index of its own — send readers to the first page. */
export default function DocsIndex() {
  redirect("/docs/foundations/principles");
}
