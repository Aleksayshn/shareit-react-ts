import { Field, Input, Select, Textarea } from "@/src/shared/ui";
import type { ItemDraft } from "../model";

interface ItemEditorFieldsProps {
  draft: ItemDraft;
  disabled?: boolean;
  idPrefix: string;
  onChange: (draft: ItemDraft) => void;
}

export function ItemEditorFields({
  draft,
  disabled = false,
  idPrefix,
  onChange,
}: ItemEditorFieldsProps) {
  return (
    <div className="grid gap-4">
      <Field htmlFor={`${idPrefix}-name`} label="Name" required>
        <Input
          disabled={disabled}
          id={`${idPrefix}-name`}
          maxLength={120}
          placeholder="Mountain bike"
          value={draft.name}
          onChange={(event) =>
            onChange({
              ...draft,
              name: event.target.value,
            })
          }
        />
      </Field>

      <Field htmlFor={`${idPrefix}-description`} label="Description" required>
        <Textarea
          disabled={disabled}
          id={`${idPrefix}-description`}
          placeholder="Describe what makes this item useful to other sharers."
          rows={4}
          value={draft.description}
          onChange={(event) =>
            onChange({
              ...draft,
              description: event.target.value,
            })
          }
        />
      </Field>

      <Field htmlFor={`${idPrefix}-available`} label="Availability" required>
        <Select
          disabled={disabled}
          id={`${idPrefix}-available`}
          value={draft.available ? "true" : "false"}
          onChange={(event) =>
            onChange({
              ...draft,
              available: event.target.value === "true",
            })
          }
        >
          <option value="true">Available for booking</option>
          <option value="false">Unavailable</option>
        </Select>
      </Field>
    </div>
  );
}
