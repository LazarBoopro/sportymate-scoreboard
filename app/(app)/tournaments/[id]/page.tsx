export default function SingleTournament({
  params,
}: {
  params: { id: string };
}) {
  return <h1>{params.id}</h1>;
}
