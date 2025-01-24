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

const projectCache = new NodeCache({
  stdTTL: 600, // 10 minutes 
  checkperiod: 620
});

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
  console.log("ALARM FETCH DETECTED !!!!!!!!!!!!!!!!");

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  const reposUrl: string = `https://api.github.com/users/${USERNAME}/repos`;

  const reposResponse = await fetch(reposUrl, { headers });
  if (!reposResponse.ok) {
    throw {
      code: reposResponse.status,
      message: await reposResponse.text()
    };
  }

  const repos: any[] = await reposResponse.json();

  const projects: Project[] = await Promise.all(
    repos.filter((r: any) => !EXLUDED_REPOS.includes(r.name)).map(async (repo: any) => {
      const readmeUrl: string = `https://api.github.com/repos/${repo.full_name}/readme`;
      const readmeResponse: Response = await fetch(readmeUrl, { headers });

      let readmeContent: string = "";
      if (readmeResponse.ok) {
        const readmeJson = await readmeResponse.json();
        readmeContent = readmeJson.content ? atob(readmeJson.content) : "";
      }

      return {
        name: repo.name,
        about: repo.description || "",
        stars: repo.stargazers_count,
        readme: readmeContent,
        url: repo.html_url,
      };
    })
  );

  return projects;
}
