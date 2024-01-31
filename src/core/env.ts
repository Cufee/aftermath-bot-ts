const mustGetEnv = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Env var ${name} not found`);
  }
  return value;
};

export { mustGetEnv };
