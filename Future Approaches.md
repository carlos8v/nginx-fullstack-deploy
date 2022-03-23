## Future approaches
By having a `post-receive` hook from git on the server is possible to configure custom `CI/CD`'s workflows to automate the test and deploy stages of the application.

#### Example code for a simple service update with pm2:

`/repos/git-cd-test.git/hooks/post-receive`
```bash
#!/bin/bash
TARGET="/var/www/git-cd-test"
GIT_DIR="/repos/git-cd-test.git"

APP="app"

# Colors
red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
no_color='\033[0m'

# If using `asdf`. See more at: https://asdf-vm.com/
export PATH=$PATH:/home/git/.asdf/shims

# If using `NVM`. See more at: https://github.com/nvm-sh/nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

while read oldrev newrev ref
do
	# Get branch name
	BRANCH=$(echo "$ref" | cut -d/ -f3)
	# Checkout the deploy branch
	echo -e "\n${green}Ref $ref received. Deploying ${BRANCH} branch to production...${no_color}\n"
	if git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f "$BRANCH"; then
		# Go to work-tree
		echo -e "\n${green}Installing dependencies${no_color}"
		cd "${TARGET}" && npm ci
		# Restart pm2
		echo -e "\n${green}Restarting pm2${no_color}\n"
		pm2 restart "${APP}"
		echo -e "\n${green}Latest files deployed${no_color}"
	else
		echo -e "\n${red}Some error occored. Exiting${no_color}"
		exit 1
	fi
done
exit 0
```

```bash
> ls -la /repos/git-cd-test.git/hooks
drwxr-xr-x 2 git git 4096 Mar 23 22:04 .
drwxr-xr-x 8 git git 4096 Mar 23 00:31 ..
-rwxr-xr-x 1 git git  845 Mar 23 00:32 post-receive
```

```bash
> git remote -v
...
production  git@server:/repos/git-cd-test.git (fetch)
production  git@server:/repos/git-cd-test.git (push)
```

```bash
> git push production
Enumerating objects: 10, done.
Counting objects: 100% (10/10), done.
Delta compression using up to 8 threads
Compressing objects: 100% (5/5), done.
Writing objects: 100% (6/6), 766 bytes | 766.00 KiB/s, done.
Total 6 (delta 3), reused 2 (delta 0)
remote: 
remote: Ref refs/heads/master received. Deploying master branch to production...
remote: 
remote: Already on 'master'
remote: 
remote: Installing dependencies
remote: 
remote: added 53 packages, and audited 54 packages in 2s
remote: 
remote: 2 packages are looking for funding
remote:   run `npm fund` for details
remote: 
remote: found 0 vulnerabilities
remote: 
remote: Restarting pm2
remote: 
remote: Use --update-env to update environment variables
remote: [PM2] Applying action restartProcessId on app [app](ids: [ 0 ])
remote: [PM2] [app](0) ✓
remote: ┌─────┬────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
remote: │ id  │ name   │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
remote: ├─────┼────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
remote: │ 0   │ app    │ default     │ 1.0.0   │ fork    │ 565      │ 0s     │ 1    │ online    │ 0%       │ 19.0mb   │ git      │ disabled │
remote: └─────┴────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
remote: 
remote: Latest files deployed
To git-server:/var/www/git-cd-test.git
 + 724bbbf...75b401b master -> master
```
