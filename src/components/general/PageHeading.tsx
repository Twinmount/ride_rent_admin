export default function PageHeading({ heading }: { heading: string }) {
  return (
    <h1 className="mb-4 mt-4 text-center text-2xl font-semibold lg:text-left lg:text-3xl">
      {heading}
    </h1>
  );
}
