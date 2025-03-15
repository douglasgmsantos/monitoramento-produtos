import RegisterForm from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Cadastro</h1>
          <p className="mt-2 text-muted-foreground">Crie sua conta para receber notificações de produtos</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

