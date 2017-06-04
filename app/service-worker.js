/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["android-chrome-192x192.png","9f6956c64973ce276b9f4020e417749c"],
["android-chrome-512x512.png","19849567e9dcd11efbe535c6037a5272"],
["apple-touch-icon-144x144.png","a92779796533f78680eb67cdffb4c05d"],
["apple-touch-icon.png","9d10b566af96d1db3bbaa394413b2710"],
["cdn/ManUp.js/0.7/js/manup.fixed.min.js","a28e7043c294e0a5b9c5692ac4c47c93"],
["cdn/kamil/0.1.1/js/kamil.fixed.min.js","793c0ed2545ca20ff43b095219c9032b"],
["cdn/packery/2.1.1/js/packery.pkgd.fixed.min.js","63d0a94240867df08a4a377782eb8c2c"],
["cdn/polyfills/js/polyfills.js","801a93b1f22276a781e275367801fd4f"],
["cdn/polyfills/js/polyfills.min.js","7534fe1078132e6c033d81a54e8e4a3f"],
["cdn/qrjs2/0.1.2/js/qrjs2.fixed.min.js","146a4f7d5d4096481e033012b564a135"],
["cdn/sw-toolbox/3.6.1/js/companion.fixed.min.js","e486dceafd56188a5dc1de867d0ddf47"],
["cdn/sw-toolbox/3.6.1/js/sw-toolbox.fixed.min.js","a1fa75f796038fe792cdd2e9c1f23e95"],
["cdn/tablesort/4.0.1/js/tablesort.fixed.min.js","b2f3a237e3c1e1b65a639265261a5dd7"],
["cdn/zoomwall.js/1.1.1/css/zoomwall.css","c0f9866557e74f3306fbca3fccd1574b"],
["cdn/zoomwall.js/1.1.1/demo.html","1c4695eb4ef23642484ac3f170c38ae0"],
["cdn/zoomwall.js/1.1.1/js/zoomwall.js","5605f21d2fa1d76813ffc824b4811cde"],
["favicon-16x16.png","fa5aeeb56378b9004adbdc29072e92bd"],
["favicon-32x32.png","947c5bb31c93798e725131de25b868ea"],
["favicon-96x96.png","b727d03c6138b44a736d10ab6c92177a"],
["favicon.ico","75c4603265a2d4a3480803ce75774695"],
["icon.png","bfc826488f7c35068a619ee9561b8964"],
["index.html","c6b4fe269dc3d1faa106beae279c632e"],
["libs/pwa-englishextra/css/bundle.css","4595177bb5a532827b025fd7a6747f6b"],
["libs/pwa-englishextra/css/bundle.min.css","a8054c35216c09e73d9bec06e9822cb8"],
["libs/pwa-englishextra/css/grid/grid.css","fafa5ae285a7665e17f93ef7951388e1"],
["libs/pwa-englishextra/css/grid/grid.html","db5172df0f1f870e7c09cf1c23ac327b"],
["libs/pwa-englishextra/img/gallery/aids_most_commonly_used_idioms.jpg","c0b4977cf074d63bbc359d8513435f17"],
["libs/pwa-englishextra/img/gallery/aids_topics.jpg","879770143fb8575d7efb3dd9770c2278"],
["libs/pwa-englishextra/img/gallery/articles_reading_rules_utf.jpg","c8140f357d837dd1ec25c7a7c92e0237"],
["libs/pwa-englishextra/img/gallery/grammar_alone_by_myself_and_on_my_own.jpg","7daf184260072a16c818b1c7c4263240"],
["libs/pwa-englishextra/img/gallery/grammar_can_could_be_able_to.jpg","2f24e3f698df57dd5bfc89ee822bc41d"],
["libs/pwa-englishextra/img/gallery/grammar_conditionals.jpg","23ea2155d51c720b6300f6e56f579bf4"],
["libs/pwa-englishextra/img/gallery/grammar_in_at_on.jpg","f4e95d933bf536de970f3dfffa3eb0c4"],
["libs/pwa-englishextra/img/gallery/grammar_in_hospital_at_work.jpg","00bd912dd0144e9dd14f4ee7130bedca"],
["libs/pwa-englishextra/img/gallery/grammar_irregular_verbs.jpg","ba26dd8661654eb31fcc59b2afe4724c"],
["libs/pwa-englishextra/img/gallery/grammar_much_many_little_few.jpg","2b52831db1b22ef1459b36563457e9f1"],
["libs/pwa-englishextra/img/gallery/grammar_phrasal_verbs.jpg","198acc2ec150d2e9f1ee7b9d2f4df4b0"],
["libs/pwa-englishextra/img/gallery/grammar_too_enough_so_such.jpg","c320fcc4f7c42bee087815648ea7197c"],
["libs/pwa-englishextra/img/gallery/grammar_usage_of_articles_a_the.jpg","51ae4e30fc3a6bd761273e39ad360144"],
["libs/pwa-englishextra/img/gallery/grammar_usage_of_tenses.png","6ca011d433e6dbd890b2e855668b3ac8"],
["libs/pwa-englishextra/img/gallery/reading_russia_ukraine_war_conflict_vocabulary.jpg","c15e946ccd9359b1e6d08db567a6eb3c"],
["libs/pwa-englishextra/img/gallery/reading_the_man_with_the_scar.jpg","2978848c36757d236aa4b0aa05976e0f"],
["libs/pwa-englishextra/img/gallery/tests_common_mistakes_test_advanced.jpg","c61267fdee22e2ad080222425e25b0bf"],
["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_1.jpg","41bc4ff810afceebc6c4aaf0a1cabe3d"],
["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_2.jpg","04f54159b4aa0cc9014694bc51c5aa69"],
["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_3.jpg","aa1b966bc645d35958cf3ba5aadaf1f8"],
["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_4.jpg","325b55b5de24294c97603e30127a2c0c"],
["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_5.jpg","f603d0e75064c3566276efc7f3b0158e"],
["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_6.jpg","4078a423b3f6a14bd665511312720605"],
["libs/pwa-englishextra/img/gallery/tests_ege_essay_sample.jpg","9f56dd8d6967162adb4cf5a0f69e25f3"],
["libs/pwa-englishextra/img/gallery/tests_gia_ege_letter_sample.jpg","69fce9f3ec706d3bb475c09bcde57943"],
["libs/pwa-englishextra/img/gallery/tests_gia_english_test_sample_speaking_1.jpg","12b734c50812f82355ac6ae7bcc73dcb"],
["libs/pwa-englishextra/img/gallery/tests_grammar_tests_with_answers.jpg","cf5ac5314d5a6f61373cb973b7633ea3"],
["libs/pwa-englishextra/img/hero-1920x1080.jpg","41bd949773091e7951f30653d277a0e6"],
["libs/pwa-englishextra/img/home-1920x1080.jpg","f8a5e7f175173f2ca4df99871643c0a8"],
["libs/pwa-englishextra/img/icomoon/demo-external-svg.html","a7bda4f26ce358ffc6584527736fd6d9"],
["libs/pwa-englishextra/img/icomoon/demo-files/demo.css","9e68a66d590e7e4ddebd63b835064abe"],
["libs/pwa-englishextra/img/icomoon/demo.html","2efc0cb715f73a3b5e51a976ff268c77"],
["libs/pwa-englishextra/img/icomoon/selection.json","b23e3effc6e39e648a038ff73f01caec"],
["libs/pwa-englishextra/img/icomoon/style.css","e131d5e42e9d0108eeaa772a6db94116"],
["libs/pwa-englishextra/img/icomoon/svgxuse.js","fa903da8f1f8382fd700bed061c24781"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-about-640x336.png","5852ba3c5cbdf9f871ae004f9158b5a3"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-aids-640x336.png","7695ce5670010bd346e89b1e537541cb"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-articles-640x336.png","55dc006c94f90b6820e557494bb86a03"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-contents-640x336.png","93e255f364c29f9c714250d5e0e2b826"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-cup-640x336.png","839632713e086893928f350faec6061e"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-ege-640x336.png","20ca470bc9c586b389e9bf5880069ee0"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-englishgrammartips-640x336.png","4fecbba30217c0b3dff72fbfc28af6c4"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-gg-640x336.png","2738f078186873640548c09ed79a13df"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-gia-640x336.png","c43596e618c2b4f6460fef510436e7d9"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-grammar-640x336.png","eabd502df19d4f3b3a3586ba8315680f"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-home-640x336.png","f8c12cde589f484f5812eb1c93f8d25e"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-languagelink-640x336.png","1a81e0cf71036b38ad47a96ba6d06d7c"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-macmillan-640x336.png","99d64344cb160928fdefe94868bbd6d0"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-more-640x336.png","f907f2973ac08fcf90d4f4c5299d8d69"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-oup-640x336.png","00b78139658949eb7429c92ef42e7fe2"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-reading-640x336.png","7b2e8373730b3cecb971aa0db17dbf1e"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-rosolymp-640x336.png","da69338dacbef9cb3d046632d6936044"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-tests-640x336.png","e12a75ecf6cd0c07f55db45090abdd7c"],
["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-transcripts-640x336.png","a63b7baa7aacc26fca108143cb9d2d1d"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-angryalien-640x480.png","ffea480acca6ab0897ec3caf6ef6a200"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-bbc-640x480.png","9231a37b7fa6f16d8da47fea4dcfe48d"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-cambridge-dictionary-640x480.png","1bef36c18b509e575efd9eee5bd6cee0"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-cambridge-english-640x480.png","92ae7f2a307632adbfa1968a19e99aca"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-duolingo-640x480.png","2ecb86a47502e2a5f033f88f22035ef7"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-ege-640x480.png","b51bae100c9ebf8bc56ed10dd244f57b"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-ege-trener-640x480.png","dbfff43ac2d1d91b9117f689e0009bef"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-egu-640x480.png","13bacfb706d4f5576e5dc4c84d85d32e"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-english-accents-map-640x480.png","7391215b4dba5eeafc94203668b256be"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-gg-640x480.png","cefccacd42b2f309009a789b99630a4f"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-grammargremlins-640x480.png","2215e44fd36d5d89c0b7fd3053a4e053"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-ielts-640x480.png","91bbd65619c9a53263d16ba540a9f272"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-interurok-640x480.png","dc3b0e8c3d3d1f106c1ab3dd511e51cb"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-kino35mm-640x480.png","cc5c04b917932231edaaeffdea85aede"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-languagelink-640x480.png","19eb12b470b159d4f6d6465829412b41"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-linguaspectrum-640x480.png","54d3f22ec02225080f65a6ba21add839"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-multitran-640x480.png","16b9304f0275a1f6747e3d5425f6e386"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-oup-640x480.png","f6c2bdf39501432a10d7b5487475bc45"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-phrasal-verbs-machine-640x480.png","0ea28fea0adf7ea45d13fabcc008d1b9"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-telegraph-640x480.png","1559d8fb1a80805641f8f20af7019805"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-visualdictionary-640x480.png","23b3da545f6850651c6b99449beac73d"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-vv-640x480.png","fad8c00cc1767c8aa17c563337c50e28"],
["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-yandex-640x480.png","b79626d0fb3abcf6a0e44744f1f8df2a"],
["libs/pwa-englishextra/img/sprite-more-banner/more-banner-english4free-1920x270.png","4f226ca76481c0297bbd0aa2abbfbcb6"],
["libs/pwa-englishextra/img/sprite-more-banner/more-banner-englishextra-app-1920x270.png","4c6e3dbcb192f395ae0515a9124babd0"],
["libs/pwa-englishextra/img/sprite-more-banner/more-banner-irrverbsscr-1920x270.png","91c9c8f02b579098605b621dce48d9bc"],
["libs/pwa-englishextra/js/bundle.js","037bdd22692b3ba6e9e8e23da864504e"],
["libs/pwa-englishextra/js/bundle.min.js","682b07059701b0f4579df4f1dc3c1158"],
["libs/pwa-englishextra/json/english4free.json","4d86e4c17b8daf3ef819dd8757c89983"],
["libs/pwa-englishextra/json/navigation.json","bbc6f9d595e1c19f2f68988eee5262b6"],
["libs/pwa-englishextra/json/routes.json","02e50009d1cbf5fa4ee34a941eed0667"],
["manifest.json","77393f3e782b5fdc41ef4c5d3b12393b"],
["mstile-150x150.png","9c13a38d01c28b47d0b76798b17d51e3"],
["mstile-310x150.png","ed9469c37a0d228098d1a3e885f99678"],
["pages/about.html","930504b61e462fd27429e4a7edf90e3f"],
["pages/aids/aids_most_commonly_used_idioms.html","c995fbc7137c81fee35aa9e7f32b8b8f"],
["pages/aids/aids_topics.html","a456da29e3713f226a079d6d1f63dadf"],
["pages/articles/articles_reading_rules_utf.html","4b1d5a6b93882e1b1a7045b4d5c2eac4"],
["pages/contents.html","71d3f68840e0e7714db006c132cee9ae"],
["pages/grammar/grammar_all_whole_entire.html","d0f54c2bfba55ecd27fe890d0f3e259a"],
["pages/grammar/grammar_alone_by_myself_and_on_my_own.html","85a2723bb48d49c57dbd90bb7afea8d0"],
["pages/grammar/grammar_attributes_order.html","2443e6bc5252c1f19c7e13c8b07f3ad1"],
["pages/grammar/grammar_can_could_be_able_to.html","a8f893ba38f1876b408014bcfa9fc673"],
["pages/grammar/grammar_capital_letters.html","29b35f8ec568f52bbda4cfaca2f073ca"],
["pages/grammar/grammar_comma_before_who_which_that.html","5d8a8d94e5e85644c1798c8b2b5d5b48"],
["pages/grammar/grammar_common_and_proper_nouns.html","e8b15c56eb84d6e81c415fdf4160e5a6"],
["pages/grammar/grammar_conditionals.html","09550991a3324d33e281e9a1f32697ad"],
["pages/grammar/grammar_degrees_of_comparison.html","a9470140314ccfd9290d262975acd3af"],
["pages/grammar/grammar_ex_former.html","dc70c18071558c5942f3f39f314c68d5"],
["pages/grammar/grammar_foreign_words.html","663d0051bc9fe15b07666ada826cd627"],
["pages/grammar/grammar_glossary_of_grammatical_terms.html","f23e069d88a8839e7b49ab4eb76c3a85"],
["pages/grammar/grammar_grammar_girl_s_quick_and_dirty_grammar_at_a_glance.html","ddd1b3fafb148186e2ade9292e316138"],
["pages/grammar/grammar_in_at_on.html","a8996169ee954727a4a21b6bd86270c9"],
["pages/grammar/grammar_in_hospital_at_work.html","21b1731f834a2f3f676658a3cc7204ae"],
["pages/grammar/grammar_irregular_verbs.html","a3026181c6057ba9f14f6669c7c0d2da"],
["pages/grammar/grammar_may_might_be_allowed_to.html","a98303da34f4c145492c25a11fa20d66"],
["pages/grammar/grammar_modal_verbs.html","6fb6179930ab7dce49d206b00420c3cc"],
["pages/grammar/grammar_much_many_little_few.html","09ae0d7fd64f03b1149f46aaec06d0a3"],
["pages/grammar/grammar_or_nor_neither.html","f4631bf83f3b2d1942965dc5c471e40a"],
["pages/grammar/grammar_phrasal_verbs.html","565b1249ca4d1b8d47e669d2507c7979"],
["pages/grammar/grammar_reported_speech.html","95cc7504823b7753ce75b3ff796be1a8"],
["pages/grammar/grammar_saying_numbers.html","a1fa63dbf8fd7eebe4b3425696918d77"],
["pages/grammar/grammar_stative_and_action_verbs.html","4d04da6a3890ec242593811211daa0ab"],
["pages/grammar/grammar_the_listing_comma.html","e29c78e093a765a26850ef1089b3881b"],
["pages/grammar/grammar_to_me_for_me.html","c8d4146987042d814c64c67d26d3404e"],
["pages/grammar/grammar_too_enough_so_such.html","e3d306a38da02e89e6931bf9fd93c1bc"],
["pages/grammar/grammar_translating_participles.html","0baf228ee2e8455b4232462eb4ac3d44"],
["pages/grammar/grammar_usage_of_articles_a_the.html","252af3d6728991eec6f3ab888b759bfe"],
["pages/grammar/grammar_usage_of_hyphens.html","8e81251440bc1c452ee040f2639c1a55"],
["pages/grammar/grammar_usage_of_tenses.html","c2ef553e21c74f1ca3f18df6c84c3c32"],
["pages/grammar/grammar_when_must_means_probably.html","2aca18682d5a5d5e10b1af966ddb2ee3"],
["pages/grammar/grammar_word_order.html","d93b7d0a605c432181955c542ef09d6f"],
["pages/home.html","b8248e22f9ccf2b8429e4128486ccaf3"],
["pages/notfound.html","0acc4a7eb23698d4d2f14ede76405051"],
["pages/reading/reading_russia_ukraine_war_conflict_vocabulary.html","15458ce3ed6f4e88ea55588a61efd43e"],
["pages/reading/reading_the_man_with_the_scar.html","043a1b3e34d9973f2a9d1443a71c11a2"],
["pages/tests/tests_advanced_grammar_in_use_level_test.html","46d1ba1c79b3a12e32019fd3d299c6ed"],
["pages/tests/tests_common_mistakes_test_advanced.html","c1b5add3ff33c003502ebaeb2e78b03e"],
["pages/tests/tests_ege_english_test_sample.html","6ea4dabe35748d01e70150a5b76df50d"],
["pages/tests/tests_ege_english_test_sample_speaking.html","41cef613ae6e42657f7586666110b989"],
["pages/tests/tests_ege_essay_sample.html","163dd72a9f91ec46596f4f97219acee2"],
["pages/tests/tests_english_allrussian_olympiad_regional_stage_2013.html","46b5a406aa929001b9274cb3692b4cdb"],
["pages/tests/tests_english_grammar_in_use_level_test.html","14ccf9f05927dca0c7b509fe51c8d7fe"],
["pages/tests/tests_essential_grammar_in_use_level_test.html","956ca5f68bd52c6ff87631207e742af6"],
["pages/tests/tests_gia_ege_letter_sample.html","f664267707db554fdfef45dcc7a9e299"],
["pages/tests/tests_gia_english_test_sample.html","19c2ee708eef2cbec35f4b36b660e281"],
["pages/tests/tests_gia_english_test_sample_speaking.html","7824925850bcf241c440cb030a0e598f"],
["pages/tests/tests_grammar_tests_with_answers.html","961ff6fdd5f781c1d3a5bc1e6dc0204f"],
["pages/tests/tests_languagelink_online_test.html","24dfc509cf689730344b0a66fbcfd8b4"],
["pages/transcripts/transcripts_linguaspectrum_essential_british_english_expressions.html","c9a0a735716127136ac6cadcc3f18e70"],
["pages/transcripts/transcripts_linguaspectrum_spell.html","e4b164f4c7fd120379b7a651ad9a36ef"],
["pages/transcripts/transcripts_video_vocab_transcripts.html","ea4abe020799f6e388e6573b5b9f8196"],
["safari-pinned-tab.svg","440f6c5ffa07ec0cdcdd618c51362ff1"],
["yandex-tableau-50x50.png","666b17e38a4d2f8bfb9a1e3e70e77cff"],
["yandex-tableau.json","b654829575650ef64885b45d29f584f4"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







