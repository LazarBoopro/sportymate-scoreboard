"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectInput({
  handleChange,
  defaultSelected,
  selectOptions,
}: {
  defaultSelected: string;
  handleChange: CallableFunction;
  selectOptions: any;
}) {
  return (
    <Select onValueChange={(e) => handleChange(e)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={defaultSelected}>
          <div className={`indicator ${defaultSelected}`}></div>
          {defaultSelected}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {selectOptions.map((n: any, i: number) => (
          <SelectItem key={i} value={String(n.id)}>
            {n.id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
