import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { homeMessages } from "@/features/home/messages";
import { buildResolver } from "@/lib/zod";

const homeSchema = z.object({
  name: z.string().trim().min(2, homeMessages.nameMinLength),
});

type HomeFormValues = z.infer<typeof homeSchema>;

export function HomePage(): JSX.Element {
  const form = useForm<HomeFormValues>({
    resolver: buildResolver(homeSchema),
    defaultValues: {
      name: "",
    },
  });

  function handleSubmit(values: HomeFormValues) {
    toast.success(homeMessages.readyToast(values.name));
  }

  return (
    <section className="space-y-6" aria-labelledby="home-title">
      <header className="space-y-2">
        <h1 id="home-title" className="text-3xl font-bold tracking-tight">
          Bienvenido a Chronicle
        </h1>
        <p className="text-muted-foreground text-base">
          Ya vamos a arrancar con las observaciones en tiempo real para armar crónicas claras.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Chequeo rápido del formulario</CardTitle>
          <CardDescription>
            Este formulario valida React Hook Form + Zod para confirmar que el setup está listo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Cómo te llamás?</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" placeholder="Ej: Emilia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Guardar prueba</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
