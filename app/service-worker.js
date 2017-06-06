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

var precacheConfig = [["android-chrome-192x192.png","9f6956c64973ce276b9f4020e417749c"],["android-chrome-512x512.png","19849567e9dcd11efbe535c6037a5272"],["apple-touch-icon-144x144.png","a92779796533f78680eb67cdffb4c05d"],["apple-touch-icon.png","9d10b566af96d1db3bbaa394413b2710"],["favicon-16x16.png","fa5aeeb56378b9004adbdc29072e92bd"],["favicon-32x32.png","947c5bb31c93798e725131de25b868ea"],["favicon-96x96.png","b727d03c6138b44a736d10ab6c92177a"],["favicon.ico","75c4603265a2d4a3480803ce75774695"],["icon.png","bfc826488f7c35068a619ee9561b8964"],["index.html","198116f3b36498a9b97302b2f328f338"],["libs/pwa-englishextra/img/gallery/aids_most_commonly_used_idioms.jpg","c0b4977cf074d63bbc359d8513435f17"],["libs/pwa-englishextra/img/gallery/aids_topics.jpg","879770143fb8575d7efb3dd9770c2278"],["libs/pwa-englishextra/img/gallery/articles_reading_rules_utf.jpg","c8140f357d837dd1ec25c7a7c92e0237"],["libs/pwa-englishextra/img/gallery/grammar_alone_by_myself_and_on_my_own.jpg","7daf184260072a16c818b1c7c4263240"],["libs/pwa-englishextra/img/gallery/grammar_can_could_be_able_to.jpg","2f24e3f698df57dd5bfc89ee822bc41d"],["libs/pwa-englishextra/img/gallery/grammar_conditionals.jpg","23ea2155d51c720b6300f6e56f579bf4"],["libs/pwa-englishextra/img/gallery/grammar_in_at_on.jpg","f4e95d933bf536de970f3dfffa3eb0c4"],["libs/pwa-englishextra/img/gallery/grammar_in_hospital_at_work.jpg","00bd912dd0144e9dd14f4ee7130bedca"],["libs/pwa-englishextra/img/gallery/grammar_irregular_verbs.jpg","ba26dd8661654eb31fcc59b2afe4724c"],["libs/pwa-englishextra/img/gallery/grammar_much_many_little_few.jpg","2b52831db1b22ef1459b36563457e9f1"],["libs/pwa-englishextra/img/gallery/grammar_phrasal_verbs.jpg","198acc2ec150d2e9f1ee7b9d2f4df4b0"],["libs/pwa-englishextra/img/gallery/grammar_too_enough_so_such.jpg","c320fcc4f7c42bee087815648ea7197c"],["libs/pwa-englishextra/img/gallery/grammar_usage_of_articles_a_the.jpg","51ae4e30fc3a6bd761273e39ad360144"],["libs/pwa-englishextra/img/gallery/grammar_usage_of_tenses.png","6ca011d433e6dbd890b2e855668b3ac8"],["libs/pwa-englishextra/img/gallery/reading_russia_ukraine_war_conflict_vocabulary.jpg","c15e946ccd9359b1e6d08db567a6eb3c"],["libs/pwa-englishextra/img/gallery/reading_the_man_with_the_scar.jpg","2978848c36757d236aa4b0aa05976e0f"],["libs/pwa-englishextra/img/gallery/tests_common_mistakes_test_advanced.jpg","c61267fdee22e2ad080222425e25b0bf"],["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_1.jpg","41bc4ff810afceebc6c4aaf0a1cabe3d"],["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_2.jpg","04f54159b4aa0cc9014694bc51c5aa69"],["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_3.jpg","aa1b966bc645d35958cf3ba5aadaf1f8"],["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_4.jpg","325b55b5de24294c97603e30127a2c0c"],["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_5.jpg","f603d0e75064c3566276efc7f3b0158e"],["libs/pwa-englishextra/img/gallery/tests_ege_english_test_sample_speaking_6.jpg","4078a423b3f6a14bd665511312720605"],["libs/pwa-englishextra/img/gallery/tests_ege_essay_sample.jpg","9f56dd8d6967162adb4cf5a0f69e25f3"],["libs/pwa-englishextra/img/gallery/tests_gia_ege_letter_sample.jpg","69fce9f3ec706d3bb475c09bcde57943"],["libs/pwa-englishextra/img/gallery/tests_gia_english_test_sample_speaking_1.jpg","12b734c50812f82355ac6ae7bcc73dcb"],["libs/pwa-englishextra/img/gallery/tests_grammar_tests_with_answers.jpg","cf5ac5314d5a6f61373cb973b7633ea3"],["libs/pwa-englishextra/img/home-1920x1080.jpg","f8a5e7f175173f2ca4df99871643c0a8"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-about-640x336.png","5852ba3c5cbdf9f871ae004f9158b5a3"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-aids-640x336.png","7695ce5670010bd346e89b1e537541cb"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-articles-640x336.png","55dc006c94f90b6820e557494bb86a03"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-contents-640x336.png","93e255f364c29f9c714250d5e0e2b826"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-cup-640x336.png","839632713e086893928f350faec6061e"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-ege-640x336.png","20ca470bc9c586b389e9bf5880069ee0"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-englishgrammartips-640x336.png","4fecbba30217c0b3dff72fbfc28af6c4"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-gg-640x336.png","2738f078186873640548c09ed79a13df"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-gia-640x336.png","c43596e618c2b4f6460fef510436e7d9"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-grammar-640x336.png","eabd502df19d4f3b3a3586ba8315680f"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-home-640x336.png","f8c12cde589f484f5812eb1c93f8d25e"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-languagelink-640x336.png","1a81e0cf71036b38ad47a96ba6d06d7c"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-macmillan-640x336.png","99d64344cb160928fdefe94868bbd6d0"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-more-640x336.png","f907f2973ac08fcf90d4f4c5299d8d69"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-oup-640x336.png","00b78139658949eb7429c92ef42e7fe2"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-reading-640x336.png","7b2e8373730b3cecb971aa0db17dbf1e"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-rosolymp-640x336.png","da69338dacbef9cb3d046632d6936044"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-tests-640x336.png","e12a75ecf6cd0c07f55db45090abdd7c"],["libs/pwa-englishextra/img/sprite-contents-banner/contents-banner-transcripts-640x336.png","a63b7baa7aacc26fca108143cb9d2d1d"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-angryalien-640x480.png","ffea480acca6ab0897ec3caf6ef6a200"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-bbc-640x480.png","9231a37b7fa6f16d8da47fea4dcfe48d"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-cambridge-dictionary-640x480.png","1bef36c18b509e575efd9eee5bd6cee0"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-cambridge-english-640x480.png","92ae7f2a307632adbfa1968a19e99aca"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-duolingo-640x480.png","2ecb86a47502e2a5f033f88f22035ef7"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-ege-640x480.png","b51bae100c9ebf8bc56ed10dd244f57b"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-ege-trener-640x480.png","dbfff43ac2d1d91b9117f689e0009bef"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-egu-640x480.png","13bacfb706d4f5576e5dc4c84d85d32e"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-english-accents-map-640x480.png","7391215b4dba5eeafc94203668b256be"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-gg-640x480.png","cefccacd42b2f309009a789b99630a4f"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-grammargremlins-640x480.png","2215e44fd36d5d89c0b7fd3053a4e053"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-ielts-640x480.png","91bbd65619c9a53263d16ba540a9f272"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-interurok-640x480.png","dc3b0e8c3d3d1f106c1ab3dd511e51cb"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-kino35mm-640x480.png","cc5c04b917932231edaaeffdea85aede"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-languagelink-640x480.png","19eb12b470b159d4f6d6465829412b41"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-linguaspectrum-640x480.png","54d3f22ec02225080f65a6ba21add839"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-multitran-640x480.png","16b9304f0275a1f6747e3d5425f6e386"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-oup-640x480.png","f6c2bdf39501432a10d7b5487475bc45"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-phrasal-verbs-machine-640x480.png","0ea28fea0adf7ea45d13fabcc008d1b9"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-telegraph-640x480.png","1559d8fb1a80805641f8f20af7019805"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-visualdictionary-640x480.png","23b3da545f6850651c6b99449beac73d"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-vv-640x480.png","fad8c00cc1767c8aa17c563337c50e28"],["libs/pwa-englishextra/img/sprite-english4free-banner/english4free-banner-yandex-640x480.png","b79626d0fb3abcf6a0e44744f1f8df2a"],["libs/pwa-englishextra/img/sprite-more-banner/more-banner-english4free-1920x270.png","4f226ca76481c0297bbd0aa2abbfbcb6"],["libs/pwa-englishextra/img/sprite-more-banner/more-banner-englishextra-app-1920x270.png","4c6e3dbcb192f395ae0515a9124babd0"],["libs/pwa-englishextra/img/sprite-more-banner/more-banner-irrverbsscr-1920x270.png","91c9c8f02b579098605b621dce48d9bc"],["manifest.json","77393f3e782b5fdc41ef4c5d3b12393b"],["mstile-150x150.png","9c13a38d01c28b47d0b76798b17d51e3"],["mstile-310x150.png","ed9469c37a0d228098d1a3e885f99678"],["pages/about.html","930504b61e462fd27429e4a7edf90e3f"],["pages/aids/aids_most_commonly_used_idioms.html","9a0694041d3c582963be59a4a906a150"],["pages/aids/aids_topics.html","0bab207a78e5baedb5698e4d1163686b"],["pages/articles/articles_reading_rules_utf.html","81ba9da780463098f8a0ec34e009af3d"],["pages/contents.html","71d3f68840e0e7714db006c132cee9ae"],["pages/grammar/grammar_all_whole_entire.html","a8c96b8948939ebf5b85200213220d27"],["pages/grammar/grammar_alone_by_myself_and_on_my_own.html","f88d6500cbe26a660c2af12ebddc4f0c"],["pages/grammar/grammar_attributes_order.html","79abeb31df9b7a5e10d282494b94a8bc"],["pages/grammar/grammar_can_could_be_able_to.html","38a9f6bbe61f59bdfb9f652bbd169a0b"],["pages/grammar/grammar_capital_letters.html","584fd978ab4151da3f2244d80dfeb0e4"],["pages/grammar/grammar_comma_before_who_which_that.html","5f13361c250ddc31d914e956678ea707"],["pages/grammar/grammar_common_and_proper_nouns.html","fd755c3af912815195f6aac994ea2239"],["pages/grammar/grammar_conditionals.html","d596cd9056b2aa3598fdd8761b95f783"],["pages/grammar/grammar_degrees_of_comparison.html","c0a65d9b5732c90835120bc695935765"],["pages/grammar/grammar_ex_former.html","17d77bdc260e3c47c9a236f493ea1ba9"],["pages/grammar/grammar_foreign_words.html","65bf7a14291c84b040e434b42db74052"],["pages/grammar/grammar_glossary_of_grammatical_terms.html","74eedbdb5cdd46b4f7c82a70eb36e3f2"],["pages/grammar/grammar_grammar_girl_s_quick_and_dirty_grammar_at_a_glance.html","f79e51ece410780f8af6f511396c6cdf"],["pages/grammar/grammar_in_at_on.html","e4c748ce8cdddc1b6eb534d3ef3d6e4c"],["pages/grammar/grammar_in_hospital_at_work.html","f859ea93a334ca389d3fb8bccfb225ac"],["pages/grammar/grammar_irregular_verbs.html","3af86ff2fbf26c92b2ff120fc75d2ae9"],["pages/grammar/grammar_may_might_be_allowed_to.html","5eacb161ff8babb931b574f81703d217"],["pages/grammar/grammar_modal_verbs.html","d724cdb06ef9494e5d1eb78f9c4cb3e2"],["pages/grammar/grammar_much_many_little_few.html","1367bb1a062db70c631720093d19e4ad"],["pages/grammar/grammar_or_nor_neither.html","b8b687d2b5b3d8947ab42da7e3b5af5e"],["pages/grammar/grammar_phrasal_verbs.html","cf45fea4f4c58149627f305c718b5556"],["pages/grammar/grammar_reported_speech.html","190c6f0a9ffd4fc444e5eed1b6237469"],["pages/grammar/grammar_saying_numbers.html","ea7bd82d00f2e025a45873eac05853c9"],["pages/grammar/grammar_stative_and_action_verbs.html","c4e0f9a6193ac9be33d1a2c2d89e1524"],["pages/grammar/grammar_the_listing_comma.html","c8f7d6de9e6d81131ed44952202c7ad8"],["pages/grammar/grammar_to_me_for_me.html","50bd29d6ae11ca31e42cddebe3a6dccd"],["pages/grammar/grammar_too_enough_so_such.html","581b1b7ba57f2f32fe97e3d1a249266d"],["pages/grammar/grammar_translating_participles.html","f8426287caeeefad734f9bb503a39163"],["pages/grammar/grammar_usage_of_articles_a_the.html","4501a50ea9a37dbdee4339e95fca4e7f"],["pages/grammar/grammar_usage_of_hyphens.html","0a2611d01e1b8df893028b1ca4676bbe"],["pages/grammar/grammar_usage_of_tenses.html","0f1201fdc85bfa43a3c0e9e6bc56b34d"],["pages/grammar/grammar_when_must_means_probably.html","83d058311d6acabb3aa3b08caf4967e3"],["pages/grammar/grammar_word_order.html","5558f1e5da136a0288e22bffe06c94e1"],["pages/home.html","b8248e22f9ccf2b8429e4128486ccaf3"],["pages/notfound.html","0acc4a7eb23698d4d2f14ede76405051"],["pages/reading/reading_russia_ukraine_war_conflict_vocabulary.html","4af9a7435be960eb5b8137190d52d8ea"],["pages/reading/reading_the_man_with_the_scar.html","cd3918756ff5e2720bc53565e7fc9c3f"],["pages/tests/tests_advanced_grammar_in_use_level_test.html","348ed5a613962f5ce47b2011df02a511"],["pages/tests/tests_common_mistakes_test_advanced.html","4e761682dad5df075ebe00ab40b5c614"],["pages/tests/tests_ege_english_test_sample.html","78434c796255603b5bbf01cea4b33eb4"],["pages/tests/tests_ege_english_test_sample_speaking.html","eadbc0f660e951806b0a576524bcb740"],["pages/tests/tests_ege_essay_sample.html","7a00a2da1a55056d3d0961685258cc85"],["pages/tests/tests_english_allrussian_olympiad_regional_stage_2013.html","da4897bfdae1ecb8180b8d24e078994a"],["pages/tests/tests_english_grammar_in_use_level_test.html","ea6c95a00b8efcd838bed35ebf31d6f7"],["pages/tests/tests_essential_grammar_in_use_level_test.html","e5629d50b2da9e28a680f24e865ed98c"],["pages/tests/tests_gia_ege_letter_sample.html","3fc0a8a2013d0fb21b947a467eaadcc3"],["pages/tests/tests_gia_english_test_sample.html","770f2fc15eb664b6ecfb9eb16097c6b7"],["pages/tests/tests_gia_english_test_sample_speaking.html","41322f9a6a8598ae59e362c200a359f4"],["pages/tests/tests_grammar_tests_with_answers.html","0833cf3a293cae06b6826c9a30da66e1"],["pages/tests/tests_languagelink_online_test.html","7a47903e790e404a9ce077e146362341"],["pages/transcripts/transcripts_linguaspectrum_essential_british_english_expressions.html","caf1ecc8536aaaabd39489b3c4d0ae43"],["pages/transcripts/transcripts_linguaspectrum_spell.html","19e19b363b85021cb80f1abf58aa260b"],["pages/transcripts/transcripts_video_vocab_transcripts.html","1bfabe6e84255a372c913733d20031e1"],["safari-pinned-tab.svg","440f6c5ffa07ec0cdcdd618c51362ff1"],["yandex-tableau-50x50.png","666b17e38a4d2f8bfb9a1e3e70e77cff"],["yandex-tableau.json","b654829575650ef64885b45d29f584f4"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


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


// *** Start of auto-included sw-toolbox code. ***
/* 
 Copyright 2016 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.toolbox=e()}}(function(){return function e(t,n,r){function o(c,s){if(!n[c]){if(!t[c]){var a="function"==typeof require&&require;if(!s&&a)return a(c,!0);if(i)return i(c,!0);var u=new Error("Cannot find module '"+c+"'");throw u.code="MODULE_NOT_FOUND",u}var f=n[c]={exports:{}};t[c][0].call(f.exports,function(e){var n=t[c][1][e];return o(n?n:e)},f,f.exports,e,t,n,r)}return n[c].exports}for(var i="function"==typeof require&&require,c=0;c<r.length;c++)o(r[c]);return o}({1:[function(e,t,n){"use strict";function r(e,t){t=t||{};var n=t.debug||m.debug;n&&console.log("[sw-toolbox] "+e)}function o(e){var t;return e&&e.cache&&(t=e.cache.name),t=t||m.cache.name,caches.open(t)}function i(e,t){t=t||{};var n=t.successResponses||m.successResponses;return fetch(e.clone()).then(function(r){return"GET"===e.method&&n.test(r.status)&&o(t).then(function(n){n.put(e,r).then(function(){var r=t.cache||m.cache;(r.maxEntries||r.maxAgeSeconds)&&r.name&&c(e,n,r)})}),r.clone()})}function c(e,t,n){var r=s.bind(null,e,t,n);d=d?d.then(r):r()}function s(e,t,n){var o=e.url,i=n.maxAgeSeconds,c=n.maxEntries,s=n.name,a=Date.now();return r("Updating LRU order for "+o+". Max entries is "+c+", max age is "+i),g.getDb(s).then(function(e){return g.setTimestampForUrl(e,o,a)}).then(function(e){return g.expireEntries(e,c,i,a)}).then(function(e){r("Successfully updated IDB.");var n=e.map(function(e){return t.delete(e)});return Promise.all(n).then(function(){r("Done with cache cleanup.")})}).catch(function(e){r(e)})}function a(e,t,n){return r("Renaming cache: ["+e+"] to ["+t+"]",n),caches.delete(t).then(function(){return Promise.all([caches.open(e),caches.open(t)]).then(function(t){var n=t[0],r=t[1];return n.keys().then(function(e){return Promise.all(e.map(function(e){return n.match(e).then(function(t){return r.put(e,t)})}))}).then(function(){return caches.delete(e)})})})}function u(e,t){return o(t).then(function(t){return t.add(e)})}function f(e,t){return o(t).then(function(t){return t.delete(e)})}function h(e){e instanceof Promise||p(e),m.preCacheItems=m.preCacheItems.concat(e)}function p(e){var t=Array.isArray(e);if(t&&e.forEach(function(e){"string"==typeof e||e instanceof Request||(t=!1)}),!t)throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");return e}function l(e,t,n){if(!e)return!1;if(t){var r=e.headers.get("date");if(r){var o=new Date(r);if(o.getTime()+1e3*t<n)return!1}}return!0}var d,m=e("./options"),g=e("./idb-cache-expiration");t.exports={debug:r,fetchAndCache:i,openCache:o,renameCache:a,cache:u,uncache:f,precache:h,validatePrecacheInput:p,isResponseFresh:l}},{"./idb-cache-expiration":2,"./options":4}],2:[function(e,t,n){"use strict";function r(e){return new Promise(function(t,n){var r=indexedDB.open(u+e,f);r.onupgradeneeded=function(){var e=r.result.createObjectStore(h,{keyPath:p});e.createIndex(l,l,{unique:!1})},r.onsuccess=function(){t(r.result)},r.onerror=function(){n(r.error)}})}function o(e){return e in d||(d[e]=r(e)),d[e]}function i(e,t,n){return new Promise(function(r,o){var i=e.transaction(h,"readwrite"),c=i.objectStore(h);c.put({url:t,timestamp:n}),i.oncomplete=function(){r(e)},i.onabort=function(){o(i.error)}})}function c(e,t,n){return t?new Promise(function(r,o){var i=1e3*t,c=[],s=e.transaction(h,"readwrite"),a=s.objectStore(h),u=a.index(l);u.openCursor().onsuccess=function(e){var t=e.target.result;if(t&&n-i>t.value[l]){var r=t.value[p];c.push(r),a.delete(r),t.continue()}},s.oncomplete=function(){r(c)},s.onabort=o}):Promise.resolve([])}function s(e,t){return t?new Promise(function(n,r){var o=[],i=e.transaction(h,"readwrite"),c=i.objectStore(h),s=c.index(l),a=s.count();s.count().onsuccess=function(){var e=a.result;e>t&&(s.openCursor().onsuccess=function(n){var r=n.target.result;if(r){var i=r.value[p];o.push(i),c.delete(i),e-o.length>t&&r.continue()}})},i.oncomplete=function(){n(o)},i.onabort=r}):Promise.resolve([])}function a(e,t,n,r){return c(e,n,r).then(function(n){return s(e,t).then(function(e){return n.concat(e)})})}var u="sw-toolbox-",f=1,h="store",p="url",l="timestamp",d={};t.exports={getDb:o,setTimestampForUrl:i,expireEntries:a}},{}],3:[function(e,t,n){"use strict";function r(e){var t=a.match(e.request);t?e.respondWith(t(e.request)):a.default&&"GET"===e.request.method&&0===e.request.url.indexOf("http")&&e.respondWith(a.default(e.request))}function o(e){s.debug("activate event fired");var t=u.cache.name+"$$$inactive$$$";e.waitUntil(s.renameCache(t,u.cache.name))}function i(e){return e.reduce(function(e,t){return e.concat(t)},[])}function c(e){var t=u.cache.name+"$$$inactive$$$";s.debug("install event fired"),s.debug("creating cache ["+t+"]"),e.waitUntil(s.openCache({cache:{name:t}}).then(function(e){return Promise.all(u.preCacheItems).then(i).then(s.validatePrecacheInput).then(function(t){return s.debug("preCache list: "+(t.join(", ")||"(none)")),e.addAll(t)})}))}e("serviceworker-cache-polyfill");var s=e("./helpers"),a=e("./router"),u=e("./options");t.exports={fetchListener:r,activateListener:o,installListener:c}},{"./helpers":1,"./options":4,"./router":6,"serviceworker-cache-polyfill":16}],4:[function(e,t,n){"use strict";var r;r=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,t.exports={cache:{name:"$$$toolbox-cache$$$"+r+"$$$",maxAgeSeconds:null,maxEntries:null},debug:!1,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/}},{}],5:[function(e,t,n){"use strict";var r=new URL("./",self.location),o=r.pathname,i=e("path-to-regexp"),c=function(e,t,n,r){t instanceof RegExp?this.fullUrlRegExp=t:(0!==t.indexOf("/")&&(t=o+t),this.keys=[],this.regexp=i(t,this.keys)),this.method=e,this.options=r,this.handler=n};c.prototype.makeHandler=function(e){var t;if(this.regexp){var n=this.regexp.exec(e);t={},this.keys.forEach(function(e,r){t[e.name]=n[r+1]})}return function(e){return this.handler(e,t,this.options)}.bind(this)},t.exports=c},{"path-to-regexp":15}],6:[function(e,t,n){"use strict";function r(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}var o=e("./route"),i=e("./helpers"),c=function(e,t){for(var n=e.entries(),r=n.next(),o=[];!r.done;){var i=new RegExp(r.value[0]);i.test(t)&&o.push(r.value[1]),r=n.next()}return o},s=function(){this.routes=new Map,this.routes.set(RegExp,new Map),this.default=null};["get","post","put","delete","head","any"].forEach(function(e){s.prototype[e]=function(t,n,r){return this.add(e,t,n,r)}}),s.prototype.add=function(e,t,n,c){c=c||{};var s;t instanceof RegExp?s=RegExp:(s=c.origin||self.location.origin,s=s instanceof RegExp?s.source:r(s)),e=e.toLowerCase();var a=new o(e,t,n,c);this.routes.has(s)||this.routes.set(s,new Map);var u=this.routes.get(s);u.has(e)||u.set(e,new Map);var f=u.get(e),h=a.regexp||a.fullUrlRegExp;f.has(h.source)&&i.debug('"'+t+'" resolves to same regex as existing route.'),f.set(h.source,a)},s.prototype.matchMethod=function(e,t){var n=new URL(t),r=n.origin,o=n.pathname;return this._match(e,c(this.routes,r),o)||this._match(e,[this.routes.get(RegExp)],t)},s.prototype._match=function(e,t,n){if(0===t.length)return null;for(var r=0;r<t.length;r++){var o=t[r],i=o&&o.get(e.toLowerCase());if(i){var s=c(i,n);if(s.length>0)return s[0].makeHandler(n)}}return null},s.prototype.match=function(e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},t.exports=new s},{"./helpers":1,"./route":5}],7:[function(e,t,n){"use strict";function r(e,t,n){return n=n||{},i.debug("Strategy: cache first ["+e.url+"]",n),i.openCache(n).then(function(t){return t.match(e).then(function(t){var r=n.cache||o.cache,c=Date.now();return i.isResponseFresh(t,r.maxAgeSeconds,c)?t:i.fetchAndCache(e,n)})})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],8:[function(e,t,n){"use strict";function r(e,t,n){return n=n||{},i.debug("Strategy: cache only ["+e.url+"]",n),i.openCache(n).then(function(t){return t.match(e).then(function(e){var t=n.cache||o.cache,r=Date.now();if(i.isResponseFresh(e,t.maxAgeSeconds,r))return e})})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],9:[function(e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: fastest ["+e.url+"]",n),new Promise(function(r,c){var s=!1,a=[],u=function(e){a.push(e.toString()),s?c(new Error('Both cache and network failed: "'+a.join('", "')+'"')):s=!0},f=function(e){e instanceof Response?r(e):u("No result returned")};o.fetchAndCache(e.clone(),n).then(f,u),i(e,t,n).then(f,u)})}var o=e("../helpers"),i=e("./cacheOnly");t.exports=r},{"../helpers":1,"./cacheOnly":8}],10:[function(e,t,n){t.exports={networkOnly:e("./networkOnly"),networkFirst:e("./networkFirst"),cacheOnly:e("./cacheOnly"),cacheFirst:e("./cacheFirst"),fastest:e("./fastest")}},{"./cacheFirst":7,"./cacheOnly":8,"./fastest":9,"./networkFirst":11,"./networkOnly":12}],11:[function(e,t,n){"use strict";function r(e,t,n){n=n||{};var r=n.successResponses||o.successResponses,c=n.networkTimeoutSeconds||o.networkTimeoutSeconds;return i.debug("Strategy: network first ["+e.url+"]",n),i.openCache(n).then(function(t){var s,a,u=[];if(c){var f=new Promise(function(r){s=setTimeout(function(){t.match(e).then(function(e){var t=n.cache||o.cache,c=Date.now(),s=t.maxAgeSeconds;i.isResponseFresh(e,s,c)&&r(e)})},1e3*c)});u.push(f)}var h=i.fetchAndCache(e,n).then(function(e){if(s&&clearTimeout(s),r.test(e.status))return e;throw i.debug("Response was an HTTP error: "+e.statusText,n),a=e,new Error("Bad response")}).catch(function(r){return i.debug("Network or response error, fallback to cache ["+e.url+"]",n),t.match(e).then(function(e){if(e)return e;if(a)return a;throw r})});return u.push(h),Promise.race(u)})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],12:[function(e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: network only ["+e.url+"]",n),fetch(e)}var o=e("../helpers");t.exports=r},{"../helpers":1}],13:[function(e,t,n){"use strict";var r=e("./options"),o=e("./router"),i=e("./helpers"),c=e("./strategies"),s=e("./listeners");i.debug("Service Worker Toolbox is loading"),self.addEventListener("install",s.installListener),self.addEventListener("activate",s.activateListener),self.addEventListener("fetch",s.fetchListener),t.exports={networkOnly:c.networkOnly,networkFirst:c.networkFirst,cacheOnly:c.cacheOnly,cacheFirst:c.cacheFirst,fastest:c.fastest,router:o,options:r,cache:i.cache,uncache:i.uncache,precache:i.precache}},{"./helpers":1,"./listeners":3,"./options":4,"./router":6,"./strategies":10}],14:[function(e,t,n){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],15:[function(e,t,n){function r(e,t){for(var n,r=[],o=0,i=0,c="",s=t&&t.delimiter||"/";null!=(n=x.exec(e));){var f=n[0],h=n[1],p=n.index;if(c+=e.slice(i,p),i=p+f.length,h)c+=h[1];else{var l=e[i],d=n[2],m=n[3],g=n[4],v=n[5],w=n[6],y=n[7];c&&(r.push(c),c="");var b=null!=d&&null!=l&&l!==d,E="+"===w||"*"===w,R="?"===w||"*"===w,k=n[2]||s,$=g||v;r.push({name:m||o++,prefix:d||"",delimiter:k,optional:R,repeat:E,partial:b,asterisk:!!y,pattern:$?u($):y?".*":"[^"+a(k)+"]+?"})}}return i<e.length&&(c+=e.substr(i)),c&&r.push(c),r}function o(e,t){return s(r(e,t))}function i(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function c(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function s(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,r){for(var o="",s=n||{},a=r||{},u=a.pretty?i:encodeURIComponent,f=0;f<e.length;f++){var h=e[f];if("string"!=typeof h){var p,l=s[h.name];if(null==l){if(h.optional){h.partial&&(o+=h.prefix);continue}throw new TypeError('Expected "'+h.name+'" to be defined')}if(v(l)){if(!h.repeat)throw new TypeError('Expected "'+h.name+'" to not repeat, but received `'+JSON.stringify(l)+"`");if(0===l.length){if(h.optional)continue;throw new TypeError('Expected "'+h.name+'" to not be empty')}for(var d=0;d<l.length;d++){if(p=u(l[d]),!t[f].test(p))throw new TypeError('Expected all "'+h.name+'" to match "'+h.pattern+'", but received `'+JSON.stringify(p)+"`");o+=(0===d?h.prefix:h.delimiter)+p}}else{if(p=h.asterisk?c(l):u(l),!t[f].test(p))throw new TypeError('Expected "'+h.name+'" to match "'+h.pattern+'", but received "'+p+'"');o+=h.prefix+p}}else o+=h}return o}}function a(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function u(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function f(e,t){return e.keys=t,e}function h(e){return e.sensitive?"":"i"}function p(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return f(e,t)}function l(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(g(e[o],t,n).source);var i=new RegExp("(?:"+r.join("|")+")",h(n));return f(i,t)}function d(e,t,n){return m(r(e,n),t,n)}function m(e,t,n){v(t)||(n=t||n,t=[]),n=n||{};for(var r=n.strict,o=n.end!==!1,i="",c=0;c<e.length;c++){var s=e[c];if("string"==typeof s)i+=a(s);else{var u=a(s.prefix),p="(?:"+s.pattern+")";t.push(s),s.repeat&&(p+="(?:"+u+p+")*"),p=s.optional?s.partial?u+"("+p+")?":"(?:"+u+"("+p+"))?":u+"("+p+")",i+=p}}var l=a(n.delimiter||"/"),d=i.slice(-l.length)===l;return r||(i=(d?i.slice(0,-l.length):i)+"(?:"+l+"(?=$))?"),i+=o?"$":r&&d?"":"(?="+l+"|$)",f(new RegExp("^"+i,h(n)),t)}function g(e,t,n){return v(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?p(e,t):v(e)?l(e,t,n):d(e,t,n)}var v=e("isarray");t.exports=g,t.exports.parse=r,t.exports.compile=o,t.exports.tokensToFunction=s,t.exports.tokensToRegExp=m;var x=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},{isarray:14}],16:[function(e,t,n){!function(){var e=Cache.prototype.addAll,t=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(t)var n=t[1],r=parseInt(t[2]);e&&(!t||"Firefox"===n&&r>=46||"Chrome"===n&&r>=50)||(Cache.prototype.addAll=function(e){function t(e){this.name="NetworkError",this.code=19,this.message=e}var n=this;return t.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return e=e.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(e.map(function(e){"string"==typeof e&&(e=new Request(e));var n=new URL(e.url).protocol;if("http:"!==n&&"https:"!==n)throw new t("Invalid scheme");return fetch(e.clone())}))}).then(function(r){if(r.some(function(e){return!e.ok}))throw new t("Incorrect response status");return Promise.all(r.map(function(t,r){return n.put(e[r],t)}))}).then(function(){})},Cache.prototype.add=function(e){return this.addAll([e])})}()},{}]},{},[13])(13)});


// *** End of auto-included sw-toolbox code. ***



// Runtime cache configuration, using the sw-toolbox library.

toolbox.router.get(/^https:\/\/yastatic\.net/, toolbox.networkFirst, {"debug":true});
toolbox.router.get(/^https:\/\/vk\.com/, toolbox.networkFirst, {"debug":true});
toolbox.router.get(/^https:\/\/mc\.yandex\.ru/, toolbox.networkFirst, {"debug":true});
toolbox.router.get(/^https:\/\/www\.google-analytics\.com/, toolbox.networkFirst, {"debug":true});
toolbox.router.get(/^https:\/\/ssl\.google-analytics\.com/, toolbox.networkFirst, {"debug":true});
toolbox.router.get(/^https:\/\/(.*?)\.disqus\.com/, toolbox.networkFirst, {"debug":true});
toolbox.router.get(/^https:\/\/w\.soundcloud\.com/, toolbox.networkOnly, {"debug":true});
toolbox.router.get(/^https:\/\/player\.vimeo\.com/, toolbox.networkOnly, {"debug":true});
toolbox.router.get(/^https:\/\/www\.youtube\.com/, toolbox.networkOnly, {"debug":true});
toolbox.router.get(/^https:\/\/(.*?)\.staticflickr\.com/, toolbox.networkFirst, {"debug":true});
toolbox.router.get(/\/cdn\/(.*?)/, toolbox.networkFirst, {"debug":true});
toolbox.router.get(/\/libs\/(.*?)\/css\//, toolbox.networkFirst, {"debug":true});
toolbox.router.get(/\/libs\/(.*?)\/js\//, toolbox.networkFirst, {"debug":true});
toolbox.router.get(/\/libs\/(.*?)\/json\//, toolbox.networkFirst, {"debug":true});




