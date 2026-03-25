"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  register as registerAccount,
  registerFormSchema,
  type RegisterFormValues,
} from "@/src/entities/auth";
import { useAuth } from "@/src/shared/auth";
import {
  AppErrorPanel,
  Button,
  Card,
  Field,
  Input,
  LinkButton,
} from "@/src/shared/ui";

interface RegisterFormProps {
  nextPath?: string | null;
}

export function RegisterForm({ nextPath }: RegisterFormProps) {
  const router = useRouter();
  const { setUser } = useAuth();
  const loginHref = nextPath
    ? `/login?next=${encodeURIComponent(nextPath)}`
    : "/login";
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerFormSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: RegisterFormValues) => registerAccount(values),
    onSuccess: (user) => {
      setUser(user);
      router.push(nextPath || "/");
      router.refresh();
    },
  });

  return (
    <Card className="grid gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          New here
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          Create your ShareIt account
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Join your local sharing network and start lending or borrowing today.
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <Field
          error={form.formState.errors.name?.message}
          htmlFor="register-name"
          label="Full name"
          required
        >
          <Input
            autoComplete="name"
            disabled={mutation.isPending}
            id="register-name"
            placeholder="Alex Johnson"
            {...form.register("name")}
          />
        </Field>

        <Field
          error={form.formState.errors.email?.message}
          htmlFor="register-email"
          label="Email"
          required
        >
          <Input
            autoComplete="email"
            disabled={mutation.isPending}
            id="register-email"
            placeholder="you@example.com"
            type="email"
            {...form.register("email")}
          />
        </Field>

        <Field
          error={form.formState.errors.password?.message}
          htmlFor="register-password"
          label="Password"
          required
        >
          <Input
            autoComplete="new-password"
            disabled={mutation.isPending}
            id="register-password"
            placeholder="Create a password"
            type="password"
            {...form.register("password")}
          />
        </Field>

        {mutation.isError ? (
          <AppErrorPanel
            error={mutation.error}
            fallbackMessage="We couldn't create your account right now."
          />
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={mutation.isPending} type="submit">
            {mutation.isPending ? "Creating..." : "Create account"}
          </Button>
          <LinkButton href={loginHref} size="sm" variant="secondary">
            Sign in instead
          </LinkButton>
        </div>
      </form>
    </Card>
  );
}
