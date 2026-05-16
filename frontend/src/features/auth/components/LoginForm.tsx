import { useForm } from "react-hook-form";
import { useLoginMutation } from "../auth.hooks";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
function LoginForm() {
  const { mutate, isPending, error } = useLoginMutation();
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
    <Card>
      <CardHeader>
        <CardTitle>Вход в аккаунт</CardTitle>

        {serverErrorMessage && (
          <CardDescription className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 border border-destructive/20 text-sm">
            {serverErrorMessage}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
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
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
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
      </CardContent>
    </Card>
  );
}

export default LoginForm;
