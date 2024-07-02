import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateMatchStatus } from "@/infrastructure/mutations/tournaments";
import { checkStatusMessage } from "@/lib/helpers/messages";
import { useParams } from "next/navigation";

export default function SelectField({
  defaultSelected,
}: {
  defaultSelected: string;
}) {
  const { mutate: updateStatus } = useUpdateMatchStatus();
  const params = useParams();

  const handleChange = (value: string) => {
    const [selectedStatus] = selectOptions.filter(
      (n) => n.id === Number(value)
    );

    updateStatus({
      id: String(params.id),
      status: {
        id: selectedStatus.id,
        status: selectedStatus.status,
      },
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

const selectOptions = [
  {
    id: 0,
    status: "Completed",
  },
  {
    id: 1,
    status: "In progress",
  },
  {
    id: 2,
    status: "Paused",
  },
  {
    id: 3,
    status: "Canceled",
  },
  {
    id: 4,
    status: "Warm up",
  },
  {
    id: 5,
    status: "Break",
  },
  {
    id: 6,
    status: "Interrupted",
  },
  {
    id: 7,
    status: "Delayed",
  },
  {
    id: 8,
    status: "Match point",
  },
  {
    id: 9,
    status: "Tie Break",
  },
  {
    id: 10,
    status: "Suspended",
  },
  {
    id: 11,
    status: "Forfeited",
  },
  {
    id: 12,
    status: "Idle",
  },
];
