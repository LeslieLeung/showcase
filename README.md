# GitHub Showcase

A sleek showcase of your GitHub repositories that automatically updates via GitHub Actions.

## Features

- 🚀 Automatically fetches public repositories from GitHub API
- 📚 Beautiful bookshelf-style display with React + Tailwind CSS
- 🔄 Automatic updates via GitHub Actions
- 📄 Static site deployment via GitHub Pages
- ⭐ Shows repository stats (stars, forks, language)

## Quick Start (Fork & Customize)

### 1. Fork this Repository
- Click the "Fork" button at the top right of this page
- Clone your forked repository:
  ```bash
  git clone https://github.com/YOUR_USERNAME/showcase.git
  cd showcase
  ```

### 2. Basic Configuration

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Update configuration**
   - Edit `config.yaml` to set your GitHub username and customize display options:
     ```yaml
     github_username: "YOUR_GITHUB_USERNAME"
     ```

3. **Enable GitHub Pages**
   - Go to your repository Settings > Pages
   - Set Source to "GitHub Actions"

4. **Deploy**
   - Push any change to trigger the automatic deployment
   - Your showcase will be available at `https://YOUR_USERNAME.github.io/showcase/`

That's it! Your showcase will automatically update daily with your latest repositories.

## Detailed Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure username**
   - Edit `config.yaml` and set your GitHub username:
     ```yaml
     github_username: "YOUR_GITHUB_USERNAME"
     ```

3. **Set up GitHub token** (for local development)
   - Create a personal access token on GitHub with `public_repo` scope
   - Copy `.env.example` to `.env` and add your token:
     ```bash
     cp .env.example .env
     # Edit .env and add your GITHUB_TOKEN
     ```

4. **Development**
   ```bash
   # Fetch repositories and start dev server
   npm run fetch-repos
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build-complete
   ```

## GitHub Pages Deployment

1. **Enable GitHub Pages**
   - Go to your repository Settings > Pages
   - Set Source to "GitHub Actions"

2. **Add repository secret**
   - Go to Settings > Secrets and variables > Actions
   - The workflow uses the default `GITHUB_TOKEN` which is automatically provided

3. **Deploy**
   - Push to main branch or trigger the workflow manually
   - The site will be available at `https://yourusername.github.io/showcase/`

## Advanced Customization

### Repository Filtering
- **Username**: Set your GitHub username in `config.yaml` under `github_username`
- **Configuration**: Edit `config.yaml` to set repository filters, sorting, and display options
- **Fetch Parameters**: Modify `scripts/fetch-repos.ts` to change API parameters

### Personal Information
- **Bio & Links**: Customize your profile section in the main component

### Deployment Settings
- **Base URL**: Modify `vite.config.ts` if deploying to a custom domain
- **GitHub Actions**: Customize `.github/workflows/deploy.yml` for different deployment schedules

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run fetch-repos` - Fetch repositories from GitHub API
- `npm run build-complete` - Fetch repos and build (used by CI)

## Project Structure

```
├── src/
│   ├── components/          # React components
│   ├── data/               # Generated repository data
│   ├── types.ts            # TypeScript types
│   └── App.tsx             # Main app component
├── scripts/
│   ├── fetch-repos.ts      # GitHub API client
│   └── build.ts            # Build script
├── .github/workflows/      # GitHub Actions
└── dist/                   # Built files
```