"use client";

import { useFieldArray, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  variantIndex: number;
}

export function VariantAttributes({ control, variantIndex }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.attributes`, // array olacak
  });

  return (
    <div className="space-y-2">
      {fields.map((attr, idx) => (
        <div key={attr.id} className="flex items-center gap-2">
          <Input
            placeholder="Özellik Adı (örn: Renk)"
            {...control.register(
              `variants.${variantIndex}.attributes.${idx}.key`
            )}
          />
          <Input
            placeholder="Değer (örn: Kırmızı)"
            {...control.register(
              `variants.${variantIndex}.attributes.${idx}.value`
            )}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(idx)}
          >
            ✕
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ key: "", value: "" })}
      >
        + Özellik Ekle
      </Button>
    </div>
  );
}
