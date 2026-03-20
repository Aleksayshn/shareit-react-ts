"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createUser, userFormSchema, userQueryKeys, type UserFormValues } from "@/src/entities/user";
import { Button, Card, Field, Input, AppErrorPanel } from "@/src/shared/ui";

interface CreateUserFormProps {
  framed?: boolean;
}

export function CreateUserForm({ framed = true }: CreateUserFormProps) {
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

  const content = (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          New profile
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          Create a profile
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Profiles let people share items and request to borrow them.
        </p>
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
            fallbackMessage="We couldn't create this profile right now."
          />
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button disabled={mutation.isPending} type="submit">
            {mutation.isPending ? "Creating..." : "Create profile"}
          </Button>
          <Button
            disabled={mutation.isPending}
            type="button"
            variant="ghost"
            onClick={() => form.reset()}
          >
            Clear
          </Button>
        </div>
      </form>
    </>
  );

  if (!framed) {
    return content;
  }

  return <Card className="grid gap-5">{content}</Card>;
}
