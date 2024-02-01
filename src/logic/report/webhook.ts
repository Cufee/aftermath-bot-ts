const webhookUrl = Deno.env.get("ERROR_REPORT_WEBHOOK_URL");

export async function reportError(message: string) {
  if (!webhookUrl) {
    return false;
  }

  const payload = {
    content: message,
    username: "Aftermath Error Report",
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error("Failed to send error report:", res.statusText);
    return false;
  }
  if (res.status > 299) {
    console.error("Failed to send error report:", await res.text());
    return false;
  }

  return true;
}
