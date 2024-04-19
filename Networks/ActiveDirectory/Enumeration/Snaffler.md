Snaffler is a tool that can help us acquire credentials or other sensitive data in an Active Directory environment. Snaffler works by obtaining a list of hosts within the domain and then enumerating those hosts for shares and readable directories. Once that is done, it iterates through any directories readable by our user and hunts for files that could serve to better our position within the assessment. Snaffler requires that it be run from a domain-joined host or in a domain-user context.

```powershell
Snaffler.exe -s -d inlanefreight.local -o snaffler.log -v data
```

We may find passwords, SSH keys, configuration files, or other data that can be used to further our access. Snaffler color codes the output for us and provides us with a rundown of the file types found in the shares