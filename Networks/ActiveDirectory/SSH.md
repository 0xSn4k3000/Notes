## Connecting with kerberos

```bash
netexec smb frizzdc.frizz.htb -u f.frizzle -p 'Jenni_Luvs_Magic23' -k --generate-krb5-file krb5.conf

cat krb5.conf

[libdefaults]
    dns_lookup_kdc = false
    dns_lookup_realm = false
    default_realm = FRIZZ.HTB

[realms]
    FRIZZ.HTB = {
        kdc = frizzdc.frizz.htb
        admin_server = frizzdc.frizz.htb
        default_domain = frizz.htb
    }

[domain_realm]
    .frizz.htb = FRIZZ.HTB
    frizz.htb = FRIZZ.HTB

sudo cp krb5.conf /etc/krb5.conf
```

```bash
$ kinit f.frizzle
Password for f.frizzle@FRIZZ.HTB:

$ klist
Ticket cache: FILE:/tmp/krb5cc_1000
Default principal: f.frizzle@FRIZZ.HTB

Valid starting       Expires              Service principal
03/08/2025 05:46:41  03/08/2025 15:46:41  krbtgt/FRIZZ.HTB@FRIZZ.HTB
        renew until 03/09/2025 05:46:37
```

And connect over SSH with either the -k or the -o GSSAPIAuthentication=yes option to tell it to use Kerberos:

```bash
ssh -k f.frizzle@frizzdc.frizz.htb
```

I lost a bunch of time with this ssh command failing because my hosts file was:

`10.10.11.60 frizz.htb frizzdc.frizz.htb`

And not:

`10.10.11.60 frizzdc.frizz.htb frizz.htb`
