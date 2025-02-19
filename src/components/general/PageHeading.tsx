export default function PageHeading({ heading }: { heading: string }) {
  return (
    <h1 className="mb-5 text-center text-2xl font-semibold lg:ml-6 lg:text-left lg:text-3xl">
      {heading}
    </h1>
  );
}
