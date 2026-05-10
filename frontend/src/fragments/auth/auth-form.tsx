import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin
              ? "Sign in to continue monitoring and response operations."
              : "Join JogoJagad and start contributing preventive actions."}
          </p>
        </div>
        <form className="space-y-3">
          {!isLogin ? (
            <FormField label="Full Name">
              <Input placeholder="Full name" />
            </FormField>
          ) : null}
          <FormField label="Email">
            <Input type="email" placeholder="Email address" />
          </FormField>
          <FormField label="Password">
            <Input type="password" placeholder="Password" />
          </FormField>
          {!isLogin ? (
            <FormField label="Confirm Password">
              <Input type="password" placeholder="Confirm password" />
            </FormField>
          ) : null}
          <Button className="w-full">{isLogin ? "Sign In" : "Create Account"}</Button>
        </form>
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
