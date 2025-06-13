### Description
<!--- Description of the change. For example: This PR updates ABC resource so that we can XYZ --->


<!--- If your PR fully resolves and should automatically close the linked issue, use Closes. Otherwise, use Relates --->
Relates OR Closes #0000


### Checklist
- [ ] Added [CHANGELOG](https://github.com/hashicorp/vault-action/blob/master/CHANGELOG.md) entry (only for user-facing changes)


### Community Note

* Please vote on this pull request by adding a 👍
  [reaction](https://blog.github.com/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/)
  to the original pull request comment to help the community and maintainers
  prioritize this request
* Please do not leave "+1" comments, they generate extra noise for pull request
  followers and do not help prioritize the request

## PCI review checklist

<!-- heimdall_github_prtemplate:grc-pci_dss-2024-01-05 -->

- [ ] If applicable, I’ve documented a plan to revert these changes if they require more than reverting the pull request.

- [ ] If applicable, I’ve worked with GRC to document the impact of any changes to security controls.

  Examples of changes to controls include access controls, encryption, logging, etc.

- [ ] If applicable, I’ve worked with GRC to ensure compliance due to a significant change to the cardholder data environment.

  Examples include changes to operating systems, ports, protocols, services, cryptography-related components, PII processing code, etc.

If you have any questions, please contact your direct supervisor, GRC (#team-grc), or the PCI working group (#proj-pci-core). You can also find more information at [PCI Compliance](https://hashicorp.atlassian.net/wiki/spaces/SEC/pages/2784559202/PCI+Compliance).