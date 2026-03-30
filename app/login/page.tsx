import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const callbackUrl = (searchParams.callbackUrl as string) || "/dashboard";
  const defaultRole = searchParams.role as string || "consumer";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm callbackUrl={callbackUrl} defaultRole={defaultRole} />
    </Suspense>
  );
}
