const TECHNICAL_PATTERNS = [
  /unique constraint/i,
  /integrityerror/i,
  /runtimeerror/i,
  /traceback/i,
  /impossible de créer/i,
  /sql/i,
  /django\./i,
  /\[Errno/i,
];

export function toUserMessage(
  error: string | undefined,
  fallback: string,
): string {
  if (!error?.trim()) {
    return fallback;
  }

  const message = error.trim();

  if (TECHNICAL_PATTERNS.some((pattern) => pattern.test(message))) {
    if (/unique constraint|déjà|already/i.test(message)) {
      return "Cet hôtel est déjà dans vos favoris.";
    }
    return fallback;
  }

  if (message.length > 200) {
    return fallback;
  }

  return message;
}
