export function hasPermission(
  _permissions: Record<string, string[]>,
  _feature?: string,
  _action?: string
) {
  // For the static frontend showcase, we bypass permissions to show all pages
  return true;
}
