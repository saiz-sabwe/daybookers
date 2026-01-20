import { SignUpForm } from "@/components/sign-up";
import { authIsNotRequired } from "@/lib/auth-utils";

export default async function SignInPage() {
  await authIsNotRequired();

  return <SignUpForm />;
}
