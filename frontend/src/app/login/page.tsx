import Login from "@/components/header/Login";

export default function LoginPage() {
  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <div className="mt-10">
        <h3 className="text-xl font-bold">
          You need to log in to access this page.
        </h3>
        <p className="text-foreground/60">
          Create an account or log in in order to save sfarim, adjust your
          settings, and more.
        </p>
        <Login large className="mt-6" />
      </div>
    </div>
  );
}
