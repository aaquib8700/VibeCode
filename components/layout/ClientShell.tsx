"use client";

import CommandPalette, {
  useCommandPalette,
} from "@/components/ui/CommandPalette";

export default function ClientShell() {
  const palette = useCommandPalette();

  return (
    <CommandPalette isOpen={palette.isOpen} onClose={palette.close} />
  );
}
