import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateMatchStatus } from "@/infrastructure/mutations/matches";
import { selectOptions } from "@/lib/constants/match";
import { checkStatusMessage } from "@/lib/helpers/messages";
import { useParams, useSearchParams } from "next/navigation";

export default function SelectFieldStatus({
  defaultSelected,
}: {
  defaultSelected: string;
}) {
  const { mutate: updateStatus } = useUpdateMatchStatus();
  const params = useParams();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const [selectedStatus] = selectOptions.filter(
      (n) => n.id === Number(value)
    );

    // @ts-ignore
    updateStatus({
      id: String(params.id),
      status: {
        id: selectedStatus.id,
        status: selectedStatus.status,
      },
      tournament: searchParams.get("tournamentId")
        ? {
            tournamentId: searchParams.get("tournamentId") ?? "",
            groupId: searchParams.get("groupId") ?? "",
            phase: searchParams.get("phase") ?? "",
          }
        : undefined,
    });
  };

  return (
    <Select onValueChange={(e) => handleChange(e)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue
          placeholder={checkStatusMessage(defaultSelected) || "Match status"}
        >
          <div className={`indicator ${defaultSelected}`}></div>
          {checkStatusMessage(defaultSelected)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {selectOptions.map((n, i) => (
          <SelectItem key={i} value={String(n.id)}>
            {checkStatusMessage(n.status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
