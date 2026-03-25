"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { login, loginFormSchema, type LoginFormValues } from "@/src/entities/auth";
import { useAuth } from "@/src/shared/auth";
import {
  AppErrorPanel,
  Button,
  Card,
  Field,
  Input,
  LinkButton,
} from "@/src/shared/ui";

interface LoginFormProps {
  nextPath?: string | null;
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const { setUser } = useAuth();
  const registerHref = nextPath
    ? `/register?next=${encodeURIComponent(nextPath)}`
    : "/register";
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) => login(values),
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
          Welcome back
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">Sign in to ShareIt</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Pick up where you left off, manage your listings, or send a new borrow
          request.
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <Field
          error={form.formState.errors.email?.message}
          htmlFor="login-email"
          label="Email"
          required
        >
          <Input
            autoComplete="email"
            disabled={mutation.isPending}
            id="login-email"
            placeholder="you@example.com"
            type="email"
            {...form.register("email")}
          />
        </Field>

        <Field
          error={form.formState.errors.password?.message}
          htmlFor="login-password"
          label="Password"
          required
        >
          <Input
            autoComplete="current-password"
            disabled={mutation.isPending}
            id="login-password"
            placeholder="Your password"
            type="password"
            {...form.register("password")}
          />
        </Field>

        {mutation.isError ? (
          <AppErrorPanel
            error={mutation.error}
            fallbackMessage="We couldn't sign you in right now."
          />
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={mutation.isPending} type="submit">
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
          <LinkButton href={registerHref} size="sm" variant="secondary">
            Create account
          </LinkButton>
        </div>
      </form>
    </Card>
  );
}
