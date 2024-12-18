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
    value,
    required = false,
}: {
    defaultSelected: string;
    handleChange: CallableFunction;
    selectOptions: { id: string; name: string }[];
    value: string;
    required?: boolean;
}) {
    return (
        <Select onValueChange={(e) => handleChange(e)} required={required} value={value}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={defaultSelected}>
                    <div className={`indicator ${defaultSelected}`}></div>
                    {defaultSelected}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {selectOptions?.map((n: { id: string; name: string }, i: number) => (
                    <SelectItem key={i} value={String(n.id)}>
                        {n.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
