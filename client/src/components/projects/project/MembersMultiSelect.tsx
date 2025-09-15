"use client";

import { X } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Member {
  _id: string;
  name: string;
}

export default function MembersMultiSelect({
  members,
  selected,
  setSelected,
  loading,
}: {
  members: Member[];
  selected: string[];
  setSelected: (val: string[]) => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-2">
      {/* Pills */}
      <div className="flex flex-wrap gap-2">
        {selected.map((id) => {
          const member = members.find((m) => m._id === id);
          if (!member) return null;
          return (
            <span
              key={id}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
            >
              {member.name}
              <button
                onClick={() =>
                  setSelected(selected.filter((m) => m !== id))
                }
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
      </div>

      {/* Dropdown */}
      <Command className="border rounded-md">
        <CommandList>
          <CommandGroup heading="Available members">
            {loading ? (
              <CommandItem disabled>Loading...</CommandItem>
            ) : (
              members.map((m) => (
                <CommandItem
                  key={m._id}
                  value={m._id}
                  onSelect={() =>
                    setSelected(
                      selected.includes(m._id)
                        ? selected
                        : [...selected, m._id]
                    )
                  }
                >
                  {m.name}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
