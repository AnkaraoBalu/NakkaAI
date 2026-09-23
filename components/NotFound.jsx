import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-24 text-center">
      <h1 className="font-headline-lg text-headline-lg">Page not found</h1>
      <Link to="/" className="inline-block mt-6 text-primary hover:underline">
        Back to home
      </Link>
    </section>
  );
}
