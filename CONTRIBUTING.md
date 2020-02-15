# How to Contribute

We'd love to accept your patches and contributions to this project. There are
just a few small guidelines you need to follow.

## Contributor License Agreement

Contributions to this project must be accompanied by a Contributor License
Agreement. You (or your employer) retain the copyright to your contribution;
this simply gives us permission to use and redistribute your contributions as
part of the project. Head over to <https://cla.developers.google.com/> to see
your current agreements on file or to sign a new one.

You generally only need to submit a CLA once, so if you've already submitted one
(even if it was for a different project), you probably don't need to do it
again.

## Code reviews

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.

## Community Guidelines

This project follows
[Google's Open Source Community Guidelines](https://opensource.google.com/conduct/).

## Known Issues

* Test each spoken language
* Convert FAQ to intents, to tweak the translations
* light matches is translated to "wedstrijden" - competitions.
  * Work with Glosseries https://cloud.google.com/translate/docs/advanced/glossary
* When switching to another language, the Question is not translated on screen.
* The help interface needs to be translated.
* All the button labels will need to be translated.
* Need more intents, such as an airport map.
* More languages?
    - Download the svg flag from: https://hjnilsson.github.io/country-flags/ and add it to **client/assets**
    - Find the BCP 47 Code for the language: https://appmakers.dev/bcp-47-language-codes-list/
    - Add the button with a BCP 47 Language Code, in **client/app/app.component.html**