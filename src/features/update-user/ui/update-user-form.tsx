"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateUser } from "@/src/entities/user";
import {
  userFormSchema,
  userQueryKeys,
  type User,
  type UserFormValues,
} from "@/src/entities/user";
import { AppErrorPanel, Button, Card, Field, Input } from "@/src/shared/ui";

interface UpdateUserFormProps {
  user: User;
}

export function UpdateUserForm({ user }: UpdateUserFormProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<UserFormValues>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: zodResolver(userFormSchema),
  });

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
    });
  }, [form, user.email, user.name]);

  const mutation = useMutation({
    mutationFn: (values: UserFormValues) => updateUser(user.id, values),
    onSuccess: async () => {
      setIsEditing(false);
      await queryClient.invalidateQueries({
        queryKey: userQueryKeys.all,
      });
    },
  });

  if (!isEditing) {
    return (
      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
        Edit user
      </Button>
    );
  }

  return (
    <Card className="grid gap-4">
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <Field
          error={form.formState.errors.name?.message}
          htmlFor={`update-user-name-${user.id}`}
          label="Name"
        >
          <Input
            id={`update-user-name-${user.id}`}
            {...form.register("name")}
          />
        </Field>

        <Field
          error={form.formState.errors.email?.message}
          htmlFor={`update-user-email-${user.id}`}
          label="Email"
        >
          <Input
            id={`update-user-email-${user.id}`}
            type="email"
            {...form.register("email")}
          />
        </Field>

        {mutation.isError ? (
          <AppErrorPanel
            error={mutation.error}
            fallbackMessage="Unable to save the user right now."
          />
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button disabled={mutation.isPending} size="sm" type="submit">
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            disabled={mutation.isPending}
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => {
              form.reset({
                name: user.name,
                email: user.email,
              });
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
