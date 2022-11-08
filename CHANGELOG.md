## Unreleased

## 2.4.3 (Nov 8th, 2022)

Improvements:

* bump jest-when from 3.5.1 to 3.5.2 [GH-388](https://github.com/hashicorp/vault-action/pull/388)
* bump semantic-release from 19.0.3 to 19.0.5 [GH-360](https://github.com/hashicorp/vault-action/pull/360)
* bump jsrsasign from 10.5.25 to 10.5.27 [GH-358](https://github.com/hashicorp/vault-action/pull/358)
* bump @actions/core from 1.9.0 to 1.10.0 [GH-371](https://github.com/hashicorp/vault-action/pull/371)
* update runtime to node16 for action [GH-375](https://github.com/hashicorp/vault-action/pull/375)

## 2.4.2 (Aug 15, 2022)

Bugs:

* Errors due to replication delay for tokens will now be retried [GH-333](https://github.com/hashicorp/vault-action/pull/333)

Improvements:
* bump got from 11.5.1 to 11.8.5 [GH-344](https://github.com/hashicorp/vault-action/pull/344)  

## 2.4.1 (April 28th, 2022)

Improvements:
* Make secrets parameter optional [GH-299](https://github.com/hashicorp/vault-action/pull/299)
* auth/jwt: make "role" input optional [GH-291](https://github.com/hashicorp/vault-action/pull/291)
* Write a better error message when secret not found [GH-306](https://github.com/hashicorp/vault-action/pull/306)
* bump jest-when from 2.7.2 to 3.5.1 [GH-294](https://github.com/hashicorp/vault-action/pull/294)  
* bump node-fetch from 2.6.1 to 2.6.7 [GH-308](https://github.com/hashicorp/vault-action/pull/308)  
* bump @types/jest from 26.0.23 to 27.4.1 [GH-297](https://github.com/hashicorp/vault-action/pull/297)  
* bump trim-off-newlines from 1.0.1 to 1.0.3 [GH-309](https://github.com/hashicorp/vault-action/pull/309)  
* bump moment from 2.28.0 to 2.29.2 [GH-304](https://github.com/hashicorp/vault-action/pull/304)  
* bump @types/got from 9.6.11 to 9.6.12 [GH-266](https://github.com/hashicorp/vault-action/pull/266)

## 2.4.0 (October 21st, 2021)

Features:
* GitHub provided JWT auth is now supported [GH-257](https://github.com/hashicorp/vault-action/pull/257)

## 2.3.1 (August 23rd, 2021)

Improvements:
* bump normalize-url from 4.5.0 to 4.5.1 [GH-227](https://github.com/hashicorp/vault-action/pull/227)
* bump path-parse from 1.0.6 to 1.0.7 [GH-239](https://github.com/hashicorp/vault-action/pull/239)

## 2.3.0 (June 23rd, 2021)

Features:
* K8s auth method is now supported [GH-218](https://github.com/hashicorp/vault-action/pull/218)
* Custom auth method mount points is configurable [GH-218](https://github.com/hashicorp/vault-action/pull/218)

## 2.2.0 (May 6th, 2021)

Security:
* multi-line secrets are now properly masked in logs [GH-208](https://github.com/hashicorp/vault-action/pull/208)
  [CVE-2021-32074](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-32074)

Features:
* JWT auth method is now supported [GH-188](https://github.com/hashicorp/vault-action/pull/188)

## 2.1.2 (January 21st, 2021)

Bugs:
* fixed bug where newlines were being rendered for multi-line secrets [GH-173](https://github.com/hashicorp/vault-action/pull/173)

## 2.1.1 (December 15th, 2020)

Improvements:
* bump jest from 26.5.0 to 26.6.3 [GH-150](https://github.com/hashicorp/vault-action/pull/150)
* bump semantic-release from 17.1.2 to 17.3.0 [GH-158](https://github.com/hashicorp/vault-action/pull/158)
* bump got from 11.7.0 to 11.8.1 [GH-163](https://github.com/hashicorp/vault-action/pull/163)
* bump @types/jest from 26.0.14 to 26.0.19 [GH-164](https://github.com/hashicorp/vault-action/pull/164)
* bump ini from 1.3.5 to 1.3.8 [GH-167](https://github.com/hashicorp/vault-action/pull/167)

## 2.1.0 (October 6th, 2020)

Features:
* Added `exportToken` to share the Vault token as an environment variable [GH-127](https://github.com/hashicorp/vault-action/pull/127)

Security:
* `action/core` updated to 1.2.6 to address minor CVE [GH-130](https://github.com/hashicorp/vault-action/pull/130)

## 2.0.1 (September 15th, 2020)

Improvements:
* bump node-fetch from 2.6.0 to 2.6.1 [GH-110](https://github.com/hashicorp/vault-action/pull/110)
* bump lodash from 4.17.15 to 4.17.20 [GH-111](https://github.com/hashicorp/vault-action/pull/111)
* bump npm from 6.14.4 to 6.14.8 [GH-112](https://github.com/hashicorp/vault-action/pull/112)
* bump @types/jest from 25.1.5 to 26.0.13 [GH-114](https://github.com/hashicorp/vault-action/pull/114)
* bump @actions/core from 1.2.3 to 1.2.5 [GH-115](https://github.com/hashicorp/vault-action/pull/115)
* bump jest from 25.2.7 to 26.4.2 [GH-116](https://github.com/hashicorp/vault-action/pull/116)
* bump got from 11.5.1 to 11.6.2 [GH-117](https://github.com/hashicorp/vault-action/pull/117)
* update jsonata to version 1.8.3 [GH-118](https://github.com/hashicorp/vault-action/pull/118)
* update dev dependencies [GH-119](https://github.com/hashicorp/vault-action/pull/119)
* update kind-of to version 6.0.3 [GH-120](https://github.com/hashicorp/vault-action/pull/120)

## 2.0.0 (August 24th, 2020)

Features:

* Added TLS and mTLS support [GH-97](https://github.com/hashicorp/vault-action/pull/97)

Improvements:

* Breaking change: removed KV specific parameters and generalized secret UX [GH-102](https://github.com/hashicorp/vault-action/pull/102)

Bugs:
