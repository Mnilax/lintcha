# Security

## Reporting

If you find a problem in this repository or on lintcha.com, open an issue with
what you found and how to reproduce it. If the problem is one that should not be
public before it is fixed, say so in the issue without the details and we will
find a private channel.

There is no bounty and no promised response time. Reports are read.

## Scope

In scope: the rule engine, the build, the role library, the site itself, and any
figure published on the site that does not match the frozen audit output.

Out of scope: the behaviour of bots that use profiles from the library. The
library publishes text and the verdict of a linter on that text. Whether an agent
obeys the profile it was given is outside anything this project measures.

## What the site does with your input

Nothing leaves the browser. The check page has no server side: no upload, no
account, no analytics, no cookies, and two storage keys for the theme and the
language. If you find a request leaving the page that is not to this domain,
that is a bug worth reporting.
