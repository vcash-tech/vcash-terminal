const BASE_URL = "https://api.example.com"; // Replace with your actual API base

type RequestOptions = RequestInit & {
  params?: Record<string, string | number>;
};

function buildUrl(path: string, params?: Record<string, string | number>) {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, String(value))
    );
  }
  return url.toString();
}

export async function fetchClient<T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  const res = await fetch(buildUrl(path, params), {
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Fetch error");
  }

  return res.json();
}
