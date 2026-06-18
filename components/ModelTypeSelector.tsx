import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaFemale, FaMale } from "react-icons/fa";

interface ModelTypeSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function ModelTypeSelector({ value, onValueChange }: ModelTypeSelectorProps) {
  return (
    <RadioGroup
      className="grid grid-cols-2 gap-4"
      value={value || undefined}
      onValueChange={onValueChange}
    >
      <div>
        <RadioGroupItem
          value="man"
          id="model-type-man"
          className="peer sr-only"
          aria-label="Man"
        />
        <Label
          htmlFor="model-type-man"
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-6 transition-all hover:border-primary/60 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10"
        >
          <FaMale className="mb-3 h-8 w-8 text-primary" />
          <span className="text-lg font-bold tracking-wide">Man</span>
        </Label>
      </div>

      <div>
        <RadioGroupItem
          value="woman"
          id="model-type-woman"
          className="peer sr-only"
          aria-label="Woman"
        />
        <Label
          htmlFor="model-type-woman"
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-6 transition-all hover:border-primary/60 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10"
        >
          <FaFemale className="mb-3 h-8 w-8 text-primary" />
          <span className="text-lg font-bold tracking-wide">Woman</span>
        </Label>
      </div>
    </RadioGroup>
  );
}
