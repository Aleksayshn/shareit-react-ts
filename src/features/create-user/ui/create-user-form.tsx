"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createUser, userFormSchema, userQueryKeys, type UserFormValues } from "@/src/entities/user";
import { Button, Card, Field, Input, AppErrorPanel } from "@/src/shared/ui";

export function CreateUserForm() {
  const queryClient = useQueryClient();
  const form = useForm<UserFormValues>({
    defaultValues: {
      name: "",
      email: "",
    },
    resolver: zodResolver(userFormSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: UserFormValues) => createUser(values),
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries({
        queryKey: userQueryKeys.all,
      });
    },
  });

  return (
    <Card className="grid gap-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          Create user
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          Add a user from the real API
        </h2>
      </div>

      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <Field
          error={form.formState.errors.name?.message}
          htmlFor="create-user-name"
          label="Name"
        >
          <Input
            id="create-user-name"
            placeholder="Olga Tiankina"
            {...form.register("name")}
          />
        </Field>

        <Field
          error={form.formState.errors.email?.message}
          htmlFor="create-user-email"
          label="Email"
        >
          <Input
            id="create-user-email"
            placeholder="olga@example.com"
            type="email"
            {...form.register("email")}
          />
        </Field>

        {mutation.isError ? (
          <AppErrorPanel
            error={mutation.error}
            fallbackMessage="Unable to create the user right now."
          />
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button disabled={mutation.isPending} type="submit">
            {mutation.isPending ? "Creating..." : "Create user"}
          </Button>
          <Button
            disabled={mutation.isPending}
            type="button"
            variant="ghost"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
