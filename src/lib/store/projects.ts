import { config } from "dotenv";
import NodeCache from 'node-cache';
config();

export interface Project {
  name: string;
  about: string;
  stars: number;
  readme: string;
  url: string;
}

export interface ProjectError {
  code: number;
  message: string;
}

const USERNAME: string = "randware";
const EXLUDED_REPOS: string[] = [".github"];

const CACHE_TTL = 1800; // Cache is valid for 30 minutes
const CHECK_INTERVAL = 10000; // Check if cache is expired every 10 seconds

const projectCache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: CHECK_INTERVAL,
});

export async function checkCache() {
  const cachedProjects = projectCache.get<Project[]>('projects');
  if (!cachedProjects) {
    const projects = await fetchProjects();
    projectCache.set('projects', projects);
  }
}

setInterval(checkCache, CHECK_INTERVAL);

export async function getProjects(): Promise<Project[]> {
  const cachedProjects = projectCache.get<Project[]>('projects');
  if (cachedProjects) {
    return cachedProjects;
  }

  const projects = await fetchProjects();
  projectCache.set('projects', projects);
  return projects;
}

async function fetchProjects(): Promise<Project[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const reposUrl: string = `https://api.github.com/users/${USERNAME}/repos`;
  const reposResponse = await fetch(reposUrl, { headers });
  if (!reposResponse.ok) throw { code: reposResponse.status, message: await reposResponse.text() };

  const repos: any[] = await reposResponse.json();
  return await Promise.all(repos.filter((r: any) => !EXLUDED_REPOS.includes(r.name)).map(async (repo: any) => {
    const readmeUrl = `https://api.github.com/repos/${repo.full_name}/readme`;
    const readmeResponse = await fetch(readmeUrl, { headers });

    let readmeContent = "";
    if (readmeResponse.ok) {
      const readmeJson = await readmeResponse.json();
      const rawReadmeUrl = readmeJson.download_url;
      if (rawReadmeUrl) {
        const rawResponse = await fetch(rawReadmeUrl);
        if (rawResponse.ok) {
          const markdownText = await rawResponse.text();
          const markdownResponse = await fetch('https://api.github.com/markdown', {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: markdownText, mode: 'gfm', context: repo.full_name })
          });
          if (markdownResponse.ok) readmeContent = await markdownResponse.text();
        }
      }
    }

    return {
      name: repo.name,
      about: repo.description || "",
      stars: repo.stargazers_count,
      readme: readmeContent,
      url: repo.html_url,
    };
  }));
}
