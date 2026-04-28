import { useForm } from "react-hook-form";
import { useLoginrMutation } from "../auth.hooks";
import { loginSchema } from "../auth.schema";
import type z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
function LoginForm() {
  const { mutate, isPending, error } = useLoginrMutation();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate(values, {
      onSuccess: () => {
        navigate("/", { replace: true });
      },
    });
  };

  const serverErrorMessage = (error as any)?.response?.data?.message;

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Вход в аккаунт</h2>
      {serverErrorMessage && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 border border-destructive/20 text-sm">
          {serverErrorMessage}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ivan@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {isPending ? "Вход" : "Войти"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default LoginForm;
