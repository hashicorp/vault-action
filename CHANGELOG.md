## 3.3.0 (March 3, 2025)

Features:
* Wildcard secret imports can use `**` to retain case of exported env keys [GH-545](https://github.com/hashicorp/vault-action/pull/545)

## 3.2.0 (March 3, 2025)

Improvements:

* Add retry for jwt auth login to fix intermittent login failures [GH-574](https://github.com/hashicorp/vault-action/pull/574)

## 3.1.0 (January 9, 2025)

Improvements:

* fix wildcard handling when field contains dot [GH-542](https://github.com/hashicorp/vault-action/pull/542)
* bump body-parser from 1.20.0 to 1.20.3
* bump braces from 3.0.2 to 3.0.3
* bump cross-spawn from 7.0.3 to 7.0.6
* bump micromatch from 4.0.5 to 4.0.8

Features:

* `secretId` is no longer required for approle to support advanced use cases like machine login when `bind_secret_id` is false. [GH-522](https://github.com/hashicorp/vault-action/pull/522)
* Use `pki` configuration to generate certificates from Vault [GH-564](https://github.com/hashicorp/vault-action/pull/564)

## 3.0.0 (February 15, 2024)

Improvements:

* Bump node runtime from node16 to node20 [GH-529](https://github.com/hashicorp/vault-action/pull/529)

## 2.8.1 (February 15, 2024)

Bugs:

* Revert [GH-509](https://github.com/hashicorp/vault-action/pull/509) which made a backwards incompatible bump of the node runtime from node16 to node20 [GH-527](https://github.com/hashicorp/vault-action/pull/527)

## 2.8.0 (February 1, 2024)

Features:

* Add `ignoreNotFound` input (default: false) to prevent the action from failing when a secret does not exist [GH-518](https://github.com/hashicorp/vault-action/pull/518)

Improvements:

* bump jsrsasign from 10.8.6 to 11.0.0 [GH-513](https://github.com/hashicorp/vault-action/pull/513)
* bump @actions/core from 1.10.0 to 1.10.1 [GH-489](https://github.com/hashicorp/vault-action/pull/489)
* bump jest-when from 3.5.2 to 3.6.0 [GH-484](https://github.com/hashicorp/vault-action/pull/484)
* bump jest from 29.5.0 to 29.7.0 [GH-490](https://github.com/hashicorp/vault-action/pull/490)
* bump @vercel/ncc from 0.36.1 to 0.38.1 [GH-503](https://github.com/hashicorp/vault-action/pull/503)

## 2.7.5 (January 30, 2024)

Improvements:

* Bump node runtime from node16 to node20 [GH-509](https://github.com/hashicorp/vault-action/pull/509)
* Bump got from 11.8.5 to 11.8.6 [GH-492](https://github.com/hashicorp/vault-action/pull/492)

## 2.7.4 (October 26, 2023)

Features:

* Add ability to specify a wildcard for the key name to get all keys in the path [GH-488](https://github.com/hashicorp/vault-action/pull/488)

## 2.7.3 (July 13, 2023)

Bugs:

* Revert to the handling of secrets in JSON format since v2.1.2 [GH-478](https://github.com/hashicorp/vault-action/pull/478)

## 2.7.2 (July 6, 2023)

Bugs:

* Fix a regression that broke support for secrets in JSON format [GH-473](https://github.com/hashicorp/vault-action/pull/473)

## 2.7.1 (July 3, 2023)

Bugs:

* Revert [GH-466](https://github.com/hashicorp/vault-action/pull/466) which caused a regression in secrets stored as JSON strings [GH-471](https://github.com/hashicorp/vault-action/pull/471)

## 2.7.0 (June 21, 2023)

Bugs:

* Fix a regression that broke support for secrets in JSON format [GH-466](https://github.com/hashicorp/vault-action/pull/466)

Improvements:

* Fix a warning about outputToken being an unexpected input [GH-461](https://github.com/hashicorp/vault-action/pull/461)

## 2.6.0 (June 7, 2023)

Features:

* Add ability to set the `vault_token` output to contain the Vault token after authentication [GH-441](https://github.com/hashicorp/vault-action/pull/441)
* Add support for userpass and ldap authentication methods [GH-440](https://github.com/hashicorp/vault-action/pull/440)
* Define an output, `errorMessage`, for vault-action's error messages so subsequent steps can read the errors [GH-446](https://github.com/hashicorp/vault-action/pull/446)

Bugs:

* Handle undefined response in getSecrets error handler [GH-431](https://github.com/hashicorp/vault-action/pull/431)

## 2.5.0 (Jan 26th, 2023)

Features:

* Adds ability to automatically decode secrets from base64, hex, and utf8 encodings. [GH-408](https://github.com/hashicorp/vault-action/pull/408)

Improvements:

* Improves error messages for Vault authentication failures [GH-409](https://github.com/hashicorp/vault-action/pull/409)
* bump jest from 28.1.1 to 29.3.1 [GH-397](https://github.com/hashicorp/vault-action/pull/397)
* bump @types/jest from 28.1.3 to 29.2.6 [GH-397](https://github.com/hashicorp/vault-action/pull/397), [GH-413](https://github.com/hashicorp/vault-action/pull/413)
* bump jsrsasign from 10.5.27 to 10.6.1 [GH-401](https://github.com/hashicorp/vault-action/pull/401)
* bump json5 from 2.2.1 to 2.2.3 [GH-404](https://github.com/hashicorp/vault-action/pull/404)
* bump minimatch from 3.0.4 to 3.1.2 [GH-410](https://github.com/hashicorp/vault-action/pull/410)

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
