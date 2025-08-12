// This file is now a stub. The logic for downloading and extracting a repo is handled entirely on the backend.
// To download and extract a repo, call the backend API endpoint `/api/download-repo` from the frontend.

// Example (frontend usage):
// await fetch('/api/download-repo', { method: 'POST', body: JSON.stringify({ owner, repo, branch, workspaceDir }) });

export default async function downloadAndExtractRepo(
  owner: string,
  repo: string,
  branch: string,
  workspaceDir: string
): Promise<void> {
  throw new Error('This function is now a stub. Use the backend API to download and extract repos.');
}