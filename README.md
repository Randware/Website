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

Public projects load without a token. The server caches the project list for one hour and project
READMEs and languages for six hours. It serves the last successful response for up to seven days
while refreshing in the background, and pauses requests when GitHub reports a rate limit.

The cache lives in `.cache/github`. The deployment script mounts a named Docker volume there so
the cache survives redeploys. Set `GITHUB_CACHE_DIR` to a writable persistent directory if you run
the app elsewhere.

## Contributing

Contributions are always welcome!

Please make sure you somewhat **adhere to the codebase style** and **document your code**, especially in hard-to-understand areas.

Thanks!

## Feedback

In case you have any **issues** or **feedback**, please [open a GitHub issue](https://github.com/Randware/Website/issues/new).

## License

This project is licensed under a modified version of the [MIT](https://choosealicense.com/licenses/mit/) license.
It includes an additional clause, which prohibits the use of this website to impersonate the Randware organization.
