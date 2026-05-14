import { motion } from "framer-motion";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { DynamicForm } from "../../components/shared/dynamic-form";
import { useMutation } from "../../composables/useMutation";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/ui/toast";
import { buildFormFields } from "../../utils/form";
import type {
  FormFieldConfig,
  LoginPayload,
  RegisterPayload,
  User,
  UserRole,
} from "../../types";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { pushToast } = useToast();
  const [formValues, setFormValues] = useState({
    role: "user" as UserRole,
    name: "",
    email: "",
    password: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kelurahan: "",
  });

  const loginMutation = useMutation<User, LoginPayload>(login);
  const registerMutation = useMutation<User, RegisterPayload>(register);
  const mutation = isLogin ? loginMutation : registerMutation;

  const fields = useMemo<FormFieldConfig[]>(() => {
    if (isLogin) {
      return buildFormFields(
        {
          role: formValues.role,
          email: formValues.email,
          password: formValues.password,
        },
        {
          role: {
            type: "select",
            label: "Role",
            options: [
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" },
            ],
          },
          password: { type: "password", autoComplete: "current-password" },
          email: { type: "email", autoComplete: "email" },
        },
      );
    }

    const basePayload = {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      provinsi: formValues.provinsi,
      kota: formValues.kota,
      kecamatan: formValues.kecamatan,
      kelurahan: formValues.kelurahan,
    };

    const fieldOverrides: Record<string, Partial<FormFieldConfig>> = {
      password: { type: "password", autoComplete: "new-password" },
      email: { type: "email", autoComplete: "email" },
    };

    return buildFormFields(basePayload, fieldOverrides);
  }, [formValues, isLogin]);

  const handleChange = (name: keyof typeof formValues, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let authenticatedUser: User;

      if (isLogin) {
        authenticatedUser = await loginMutation.mutate({
          role: formValues.role,
          email: formValues.email,
          password: formValues.password,
        });
      } else {
        authenticatedUser = await registerMutation.mutate({
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
          provinsi: formValues.provinsi,
          kota: formValues.kota,
          kecamatan: formValues.kecamatan,
          kelurahan: formValues.kelurahan,
        });
      }

      pushToast(
        isLogin ? "Signed in successfully." : "Account created successfully.",
      );
      navigate(authenticatedUser.role === "admin" ? "/admin" : "/dashboard", {
        replace: true,
      });
    } catch {
      pushToast("Please review the form and try again.", "info");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin
              ? "Sign in to continue monitoring and response operations."
              : "Join JogoJagad and start contributing preventive actions."}
          </p>
        </div>
        <DynamicForm
          fields={fields}
          values={formValues}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={mutation.validationErrors}
          disabled={mutation.loading}
          actions={
            <Button
              className="w-full"
              type="submit"
              disabled={mutation.loading}
            >
              {mutation.loading
                ? "Processing..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          }
        />
        <p className="text-sm text-muted-foreground">
          {isLogin ? "New to JogoJagad?" : "Already have an account?"}{" "}
          <Link
            className="font-medium text-primary"
            to={isLogin ? "/register" : "/login"}
          >
            {isLogin ? "Register" : "Sign in"}
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}
