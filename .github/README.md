# CI/CD Configuration

This directory contains optimized GitHub Actions workflows for the Siteline SDK with enhanced developer experience.

## Workflows Overview

### `ci.yml` - Continuous Integration
**Purpose:** Quality checks and build verification
**Triggers:** PRs, pushes to main, manual dispatch
**Runtime:** 3-5 minutes per PR

**Jobs:**
- **Code Quality & Build** - Complete validation pipeline
  - ESLint with clear error messages
  - TypeScript type checking
  - Package builds with artifact verification
  - Import tests (CJS + ESM)
  - Detailed bundle size reporting
  - Helpful failure messages with fix suggestions

- **PR Title & Changeset Check** - PR validation
  - Validates conventional commit format
  - Checks for changeset presence
  - Auto-posts helpful reminder comments

- **Node.js Compatibility** - Cross-version testing (main only)
  - Tests on Node 18 & 22
  - Only runs after successful quality checks

**Developer Experience Features:**
- Clear step names describing what's happening
- Detailed logging with SUCCESS/ERROR/FOUND prefixes
- Automatic PR comments with changeset guidance
- Build failure summaries with common fixes
- Bundle size reports in PR summaries

### `release.yml` - Release & Publish
**Purpose:** Automated package publishing with OIDC
**Triggers:** Pushes to main (when changesets exist), manual dispatch
**Runtime:** 4-5 minutes per release

**Jobs:**
- **Version & Publish Packages** - Complete release pipeline
  - Checks for pending changesets
  - Builds and verifies packages before publish
  - Creates version PR or publishes to npm
  - Generates GitHub releases with changelogs
  - Comprehensive release summaries

**Developer Experience Features:**
- Clear status messages at each step
- Detailed logging of what's being published
- Automatic changelog extraction
- Helpful failure messages with common fixes
- Links to npm packages in releases
- Provenance verification instructions

**Manual Trigger Options:**
- Dry-run mode for testing (coming soon)

### `pr-automation.yml` - PR Automation
**Purpose:** Automated handling of dependency updates
**Triggers:** Dependabot PRs
**Runtime:** 15 seconds

**Jobs:**
- **Dependabot Auto-Approve & Merge**
  - Shows update details (package, versions, type)
  - Auto-approves patch & minor updates
  - Enables auto-merge when CI passes
  - Adds warning comment for major updates

**Developer Experience Features:**
- Clear logging of update information
- Explains why major updates are skipped
- Helpful comments on major version updates
- Status messages for each action

### `security.yml` - Security Scanning
**Purpose:** Vulnerability and secret scanning
**Triggers:** PRs, pushes to main, weekly (Monday 2am UTC), manual
**Runtime:** 5-8 minutes per PR, 10-15 minutes weekly

**Jobs:**
- **NPM Audit & Secret Scanning**
  - Checks for high/critical vulnerabilities
  - Scans for leaked secrets
  - Provides fix suggestions

- **CodeQL Security Analysis** (PRs & scheduled only)
  - Static analysis for security issues
  - Results in Security tab

**Developer Experience Features:**
- Clear SUCCESS/WARNING/ERROR prefixes
- Helpful fix suggestions in output
- Security summary in PR
- Explains where to find detailed results

## Developer Experience Highlights

### Clear Communication
- **Descriptive step names**: Every step clearly states what it does
- **Status prefixes**: SUCCESS, ERROR, WARNING, FOUND, INFO for easy scanning
- **Detailed logging**: Know exactly what's happening at each stage

### Helpful Error Messages
- **Common fix suggestions**: Failed lint? "Run 'npm run lint:fix' locally"
- **Context-aware guidance**: Different messages for different failure types
- **Links to docs**: Points to relevant setup guides when needed

### Automatic Feedback
- **PR comments**: Automatic changeset reminders
- **Build summaries**: Bundle sizes and check results in PR
- **Release reports**: Detailed summaries with next steps

### Smart Automation
- **Dependabot handling**: Auto-merge safe updates, flag major versions
- **Changeset detection**: Automatic checks with helpful prompts
- **Status checks**: Clear pass/fail with detailed explanations

### Easy Debugging
- **Structured logs**: Consistent format across all workflows
- **Step outputs**: Each step reports its status
- **Summary pages**: GitHub summary tab shows key information

## Cost Optimization

**Key optimizations:**
- Combined multiple jobs into single jobs
- Reduced matrix builds from 9 jobs to 2 jobs
- Removed bundle size comparison (saved double builds)
- Security scans run weekly instead of daily
- Removed stale issue management
- No unnecessary artifact uploads

**Estimated monthly cost:**
- 50 PRs/month: ~150 minutes
- 30 main branch pushes: ~240 minutes
- 10 releases: ~50 minutes
- 4 security scans: ~60 minutes
- **Total: ~500 minutes/month** (GitHub free tier: 2,000 minutes/month)

## Publishing Configuration

### Option 1: OIDC Trusted Publishing (Recommended)

**Most secure:** No long-lived tokens, automatic provenance

Setup: See [NPM_OIDC_SETUP.md](./NPM_OIDC_SETUP.md) for detailed instructions

Quick setup:
1. Go to npm package settings: https://www.npmjs.com/package/@siteline/core/access
2. Configure GitHub Actions as trusted publisher
3. Repository: `siteline/siteline-sdk-js`
4. Workflow: `release.yml`

### Option 2: NPM_TOKEN (Fallback)

Add secret to repository settings:
- `NPM_TOKEN` - npm token with publish access to `@siteline/*` scope

The workflow supports both methods and will use OIDC first, falling back to NPM_TOKEN if needed.

## Removed Files

The following were removed to reduce complexity:
- ❌ `labeler.yml` - Auto-labeling (manual labeling is fine)
- ❌ `CODEOWNERS` - Auto-review requests (not needed for small teams)
- ❌ `PULL_REQUEST_TEMPLATE.md` - Long checklist (unnecessary bureaucracy)
- ❌ `ISSUE_TEMPLATE/` - Issue forms (not needed for internal projects)
- ❌ `stale.yml` - Stale issue management (manual management preferred)
- ❌ `workflow-validation.yml` - Meta-workflow (unnecessary)

## Release Process

See [RELEASE.md](../RELEASE.md) for detailed release instructions.

**TL;DR:**
```bash
npm run changeset  # Add changeset
git commit && git push  # Commit and push
# Merge PR → Version PR created → Merge Version PR → Published!
```
