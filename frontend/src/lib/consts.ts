export const apiUrlServer =
  process.env.NEXT_PUBLIC_API_URL || "http://goapp:8000";
export const apiUrlClient =
  process.env.NODE_ENV == "production"
    ? "https://api.databeis.zevross.dev"
    : "http://localhost:8000";

export const delimiter = ";";

export const languages = ["english", "hebrew", "aramaic"];
