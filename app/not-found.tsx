import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-32">
      <p className="label">404</p>
      <h1 className="section-title mt-5 max-w-3xl">This page was never written.</h1>
      <Link href="/" className="arrow-link mt-8">
        <span>Return home</span>
        <span className="arrow">→</span>
      </Link>
    </div>
  );
}
