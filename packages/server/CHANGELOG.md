# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.4.0](https://github.com/hainsdominic/patientprogress/compare/v1.3.0...v1.4.0) (2021-07-21)


### Bug Fixes

* **all:** alert color and http codes ([1e74faa](https://github.com/hainsdominic/patientprogress/commit/1e74faaba420b1d533e7ee497983c35d63060e8b))
* **all:** BPI subscores and other bug/trans fixes ([dffec2f](https://github.com/hainsdominic/patientprogress/commit/dffec2f6d124fe0e9b4863532b7b08f6f9f32033)), closes [#43](https://github.com/hainsdominic/patientprogress/issues/43)
* **all:** login email is now type email ([93fd7ca](https://github.com/hainsdominic/patientprogress/commit/93fd7ca0455a247911b06c77b22393fa7391b88f))
* **all:** questionnaire deleting by _id ([22c99e5](https://github.com/hainsdominic/patientprogress/commit/22c99e51ad8a4e681e8a1ba73cdbb731908ac762))
* **api\:** trusted ips deleter ([9a02f28](https://github.com/hainsdominic/patientprogress/commit/9a02f28d124e96a103438218508488959ade08fb))
* **api:** ip 2fa ([ff55519](https://github.com/hainsdominic/patientprogress/commit/ff555196fe570f271e94430453d46b5207b03e15))
* **api:** professional register added properties ([532a31d](https://github.com/hainsdominic/patientprogress/commit/532a31de50464b1ca143b804397f8bb21ca22461))
* **api:** send questionnaires after intake ([dadcb8f](https://github.com/hainsdominic/patientprogress/commit/dadcb8f319c1d3aada0f0c88b2fac8788b4f0771))
* **client:** captcha reset and initial questionnaire sending ([cad4a8b](https://github.com/hainsdominic/patientprogress/commit/cad4a8b53571af49687a24b8f67dd450348c1fc2))
* **client:** speed limiter ([ebd313f](https://github.com/hainsdominic/patientprogress/commit/ebd313f40ca8caf2239bcbd63e2349d3ac675666)), closes [#54](https://github.com/hainsdominic/patientprogress/issues/54)


### Features

* **all:** calculate score of modified startback ([722d9a8](https://github.com/hainsdominic/patientprogress/commit/722d9a897c9606a73ba71b910cc8aaaa1e42973a))
* **all:** questionnaire score calculator update ([f96fd79](https://github.com/hainsdominic/patientprogress/commit/f96fd79698a28c40210d47be45324b92fb7989bd)), closes [#56](https://github.com/hainsdominic/patientprogress/issues/56)
* **all:** remove mandatory login captcha, ([f8ea09b](https://github.com/hainsdominic/patientprogress/commit/f8ea09b5975c77d15b722fc00b6e04f93b2ced39))
* **all:** token exp and logout ([905aa28](https://github.com/hainsdominic/patientprogress/commit/905aa281addc531a9e6051c78f5b7553e1afcb41))
* **api:** auto-delete saved trusted IPs on 1st of the month ([5ad51b6](https://github.com/hainsdominic/patientprogress/commit/5ad51b6ebec208912c253f16a1b3003b5e3f8d08))
* **client:** 2fa rerouting after login ([6f2bc39](https://github.com/hainsdominic/patientprogress/commit/6f2bc39770fe0e5aa22ab33e0f08e7160704ade7))
* **client:** addition diagnosis report ([796fb3b](https://github.com/hainsdominic/patientprogress/commit/796fb3b0285a66ecdf6f2cea21c1a38f1771f981))
* **client:** base of metrics ([e8e6d1c](https://github.com/hainsdominic/patientprogress/commit/e8e6d1cc625804cd42a5a4a0d288620f82cb2f96))
* **client:** basic email confirmation for new ip (2fa) ([a9e1557](https://github.com/hainsdominic/patientprogress/commit/a9e155769b72e40b6f705b0484a8451e4652d4cd))
* **client:** basic metrics ([c3a302e](https://github.com/hainsdominic/patientprogress/commit/c3a302e0e3b5d7dc6dcb6edfe1e61c40daae1b9c))
* **client:** handle 2fa post-login ([d594603](https://github.com/hainsdominic/patientprogress/commit/d594603c54e0018a04e37d9528597d52632b1de1))
* **client:** populate questionnaires when returning patient obj ([501b3ea](https://github.com/hainsdominic/patientprogress/commit/501b3ea4c1b8003358591fe936227aa7f514ed7d))
* **client:** questionnaireMap field, yarn.lock update, + ([bb4655a](https://github.com/hainsdominic/patientprogress/commit/bb4655a701008c44c56005d2568b7b3138bc4517))
* **client:** time to complete questionnaires ([c6df76d](https://github.com/hainsdominic/patientprogress/commit/c6df76d268290b0e6bf01869a6b745e772820251))


### Performance Improvements

* **api:** changed ip purge date to 13th for the meme ([3a56ba6](https://github.com/hainsdominic/patientprogress/commit/3a56ba6451a7f4c4e9ec4935ce439846224dc624))
* **api:** cron deleter time ([66736f1](https://github.com/hainsdominic/patientprogress/commit/66736f18b08009a8fb3a64f69ec7853f8be575ff))
* **api:** seeding ([7d62a71](https://github.com/hainsdominic/patientprogress/commit/7d62a7154fafdc1c39ab9144e0ce4ea5ac332fc4))
* **api:** seeding ([e2de332](https://github.com/hainsdominic/patientprogress/commit/e2de33238dffa44ce80feac1b06d8e110fa493d0))
* **seeding:** updated scripts ([b1b7255](https://github.com/hainsdominic/patientprogress/commit/b1b7255bdab4def2fd466954ba155a61d8faa854))





# [1.3.0](https://github.com/hainsdominic/patientprogress/compare/v1.2.2...v1.3.0) (2021-06-30)


### Features

* **all:** multiple dates and questionnaires sending ([756567e](https://github.com/hainsdominic/patientprogress/commit/756567e02989da6c83b6e7ad8921531a5475d1cb))
* **all:** scheduled update for questionnaires ([52de24f](https://github.com/hainsdominic/patientprogress/commit/52de24fbe49e18ed9147f2fa39c3243cc30bf92b))
* **api:** score calculator for follow-up ([193dd99](https://github.com/hainsdominic/patientprogress/commit/193dd99e001b197b3dace66dfe8c889f1043262b))


### Performance Improvements

* **client:** remove professional profile when fetching pat../me ([2f20754](https://github.com/hainsdominic/patientprogress/commit/2f20754e63a304494e41b85b588b0d2bea7899ba))





## [1.2.2](https://github.com/hainsdominic/patientprogress/compare/v1.2.1...v1.2.2) (2021-06-28)


### Bug Fixes

* **client:** translations and other fixes ([2d8c0cf](https://github.com/hainsdominic/patientprogress/commit/2d8c0cf5078be772a663b64f153e6042a8c0f627)), closes [#35](https://github.com/hainsdominic/patientprogress/issues/35)





## [1.2.1](https://github.com/hainsdominic/patientprogress/compare/v1.2.0...v1.2.1) (2021-06-26)


### Features

* **api:** rate-limiter and rate-slower ([054bfb9](https://github.com/hainsdominic/patientprogress/commit/054bfb9a9c6c16666bfa078d886bf52910a8d155))
* **client:** initial questionnaire sending ([2ee6df8](https://github.com/hainsdominic/patientprogress/commit/2ee6df82c1043e829df1a3121ddf472cbb2de890))





# [1.2.0](https://github.com/hainsdominic/patientprogress/compare/v1.1.0...v1.2.0) (2021-06-25)


### Bug Fixes

* **client:** score translation ([a49df32](https://github.com/hainsdominic/patientprogress/commit/a49df32cadf11805fca879ec2b670b5bb9d0ae0c)), closes [#21](https://github.com/hainsdominic/patientprogress/issues/21)


### Features

* **all:** reCaptcha ([94a6f65](https://github.com/hainsdominic/patientprogress/commit/94a6f65c009fcfc0d4d53aa2ead1e04c2469bb18))
* **api:** report pushing to db ([136e161](https://github.com/hainsdominic/patientprogress/commit/136e161dfcc880df0951ef3d9d727eeb741cbe47))
* **client:** forgot component and email form ([4d664c6](https://github.com/hainsdominic/patientprogress/commit/4d664c66c487689611ef826d757133d5bbad04c5))
* **client:** password reset ([1110029](https://github.com/hainsdominic/patientprogress/commit/111002955f89ddeb5e60f893065a980278eb20fe))
* **client:** professional profile ([58ecb3c](https://github.com/hainsdominic/patientprogress/commit/58ecb3c145619a851c02b055a4253cf2eaaf5272))
* **client:** questionnaire score calculation and display ([2822e93](https://github.com/hainsdominic/patientprogress/commit/2822e93a6940115e71250f5df9a8a5c3ef2af9b3))
* **client:** report form ([6c3b4b4](https://github.com/hainsdominic/patientprogress/commit/6c3b4b447ecd4fe442c486f14f125fa17a507a93))
* **client:** report viewing ([61b98f2](https://github.com/hainsdominic/patientprogress/commit/61b98f2ca09bd8b2ead71620146bb81d7a157e2d))


### Performance Improvements

* **api:** report model ([df7acd2](https://github.com/hainsdominic/patientprogress/commit/df7acd2ea22a0a9aabbb42d8a25f7f0866255380))
* **api:** split routes ([4069344](https://github.com/hainsdominic/patientprogress/commit/40693440543a565d3f3d5b46e7add84a9223ae15))





# [1.1.0](https://github.com/hainsdominic/patientprogress/compare/v1.0.1...v1.1.0) (2021-06-18)


### Features

* **API:** status route ([76ab0e3](https://github.com/hainsdominic/patientprogress/commit/76ab0e32b914de6d7a4f7f33e206f340f3f0b54d))
* **API:** Telegram bot ([4bb57d0](https://github.com/hainsdominic/patientprogress/commit/4bb57d0533fb89791600b31f3d194a3b3fc9429d))





## [1.0.1](https://github.com/hainsdominic/patientprogress/compare/v1.0.0...v1.0.1) (2021-06-16)


### Features

* **API:** Email Notification ([3eb5635](https://github.com/hainsdominic/patientprogress/commit/3eb563574d784eca8b7daf65fa7b5950436cf514))
* **client:** Questionnaire Deletion ([030d949](https://github.com/hainsdominic/patientprogress/commit/030d94912f14b28546fa9e3e583025789dd900a6))





# [1.0.0](https://github.com/hainsdominic/patientprogress/compare/v0.3.0...v1.0.0) (2021-06-16)


### Features

* **api:** initial intake push ([947f08e](https://github.com/hainsdominic/patientprogress/commit/947f08e805afcbeaf39f8c6aa7e833619c7b25e0))
* **api:** questionnaires answers saving ([3bbb478](https://github.com/hainsdominic/patientprogress/commit/3bbb478f08567a5b993f34b49024bb2cb0a6dce8))
* **client:** questionnaire to fill timed ([8568cf8](https://github.com/hainsdominic/patientprogress/commit/8568cf860b733223dc9da188802c6a1be2564902))





# [0.3.0](https://github.com/hainsdominic/patientprogress/compare/v0.2.0...v0.3.0) (2021-06-08)


### Bug Fixes

* **material-ui:** adaptation done ([72d7e35](https://github.com/hainsdominic/patientprogress/commit/72d7e354ca136f4380dee06ddc0d61edd068603f))


### Features

* **client:** questionnaire pushing and filled questionnaire ([ec127e2](https://github.com/hainsdominic/patientprogress/commit/ec127e2f3971202406b47369d878a5f27bc8ddb4))
* **professional:** questionnaires and patient details ([34986aa](https://github.com/hainsdominic/patientprogress/commit/34986aa60d34bab2ee2a27b63e4d28be52b2c701))





# [0.2.0](https://github.com/hainsdominic/patientprogress/compare/v0.1.2...v0.2.0) (2021-05-24)


### Features

* **professional:** invite ([89d528c](https://github.com/hainsdominic/patientprogress/commit/89d528c1f6ac4c2da76e25be5ac152f15fd494e4))
* **professional:** searchbar ([98a5e99](https://github.com/hainsdominic/patientprogress/commit/98a5e99fd89afebda4ef43405045961287617fb3))





## 0.1.1 (2021-05-18)

**Note:** Version bump only for package @patientprogress/server
