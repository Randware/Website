## The Randware website 🌐

#### The source code for the official Randware website - [randware.org](https://randware.org/)

This website is built using [Svelte](https://svelte.dev/) and [Tailwind](https://tailwindcss.com/).

## Development

#### Required tools
- git
- npm


1. Clone the repository
```bash
git clone https://github.com/Randware/Website.git
```

2. Install dependencies
```bash
npm install
```

3. Running the development server
```bash
npm run dev
```

This runs a local development server with live reloading for easy development.

## Deployment

#### Required tools
- git
- docker

1. Clone the repository
```bash
git clone https://github.com/Randware/Website.git
```

2. Give the `docker-deploy.sh` script execution permissions 
```bash
chmod +x docker-deploy.sh 
```

3. Run the `docker-deploy.sh` script
```bash
./docker-deploy.sh
```

This will do the following:
- Pull newest changes from the git repository
- Remove any existing "randware-website" containers
- Removing built "randware-website" container images
- Cleaning the builder cache in order to rebuild the container image from scratch
- Build the new "randware-website" container image
- And finally, run the container "randware-website" on port 3000

### GitHub data

The production server loads its saved GitHub snapshot or fetches one before accepting requests.
It refreshes the public project list, each project's README and languages, Randware's public member
list, and the organization and member profiles every 30 minutes, even without visitors. When a
token is configured, pins and pronouns refresh in the same batch. All pages use the same snapshot,
which updates when the batch finishes. An open page picks it up on navigation or reload.

During a refresh the site serves the preceding snapshot. If a GitHub request fails, the server can
keep its last successful response for up to seven days. Status and local time disappear after one
hour without newer profile data. GitHub rate-limit pauses apply across the entire refresh.

GitHub makes profile pronouns available to signed-in users. Set `GITHUB_TOKEN` on the website
server to fetch pronouns through GitHub's authenticated GraphQL API. `docker-deploy.sh` forwards
the variable from its environment at container startup.

The snapshot lives in `.cache/github`. The deployment script mounts a named Docker volume there
so the cache survives redeploys. Set `GITHUB_CACHE_DIR` to a writable persistent directory if
you run the app elsewhere. To reset the cache, stop the server, clear the configured directory,
then start the server again.

## Contributing

Contributions are always welcome!

Please make sure you somewhat **adhere to the codebase style** and **document your code**, especially in hard-to-understand areas.

Thanks!

## Feedback

In case you have any **issues** or **feedback**, please [open a GitHub issue](https://github.com/Randware/Website/issues/new).

## License

This project is licensed under a modified version of the [MIT](https://choosealicense.com/licenses/mit/) license.
It includes an additional clause, which prohibits the use of this website to impersonate the Randware organization.
