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

var precacheConfig = [["android-chrome-192x192.png","9f6956c64973ce276b9f4020e417749c"],["android-chrome-512x512.png","19849567e9dcd11efbe535c6037a5272"],["apple-touch-icon-144x144.png","a92779796533f78680eb67cdffb4c05d"],["apple-touch-icon.png","9d10b566af96d1db3bbaa394413b2710"],["cdn/ManUp.js/0.7/js/manup.fixed.min.js","a28e7043c294e0a5b9c5692ac4c47c93"],["cdn/doSlide/1.1.4/js/do-slide.fixed.min.js","fdddf239a51e1078cc84d69259a9019a"],["cdn/google-code-prettify/0.1/js/prettify.lang-css.fixed.min.js","6d97b0d386eae2227535b183b759dafa"],["cdn/isotope/3.0.1/js/isotope.imagesloaded.pkgd.fixed.min.js","0657928237250c2361f0674441d94256"],["cdn/kamil/0.1.1/js/kamil.fixed.min.js","793c0ed2545ca20ff43b095219c9032b"],["cdn/lazyload/3.2.2/js/lazyload.fixed.min.js","d20eb874806ae71dd7f41822df558876"],["cdn/packery/2.1.1/js/packery.imagesloaded.pkgd.fixed.min.js","9f15e072fdb1960a8942dd751abd5909"],["cdn/packery/2.1.1/js/packery.pkgd.fixed.min.js","63d0a94240867df08a4a377782eb8c2c"],["cdn/parallax/2.1.3/js/parallax.fixed.min.js","4c50b880cb736945c69d8c3d1422a289"],["cdn/photoswipe/4.1.0/js/photoswipe.photoswipe-ui-default.fixed.min.js","a08bb45e8e930568629d0006c0c4c0d3"],["cdn/polyfills/js/polyfills.js","801a93b1f22276a781e275367801fd4f"],["cdn/polyfills/js/polyfills.min.js","7534fe1078132e6c033d81a54e8e4a3f"],["cdn/qrjs2/0.1.2/js/qrjs2.fixed.min.js","146a4f7d5d4096481e033012b564a135"],["cdn/shower/1.0.1/js/shower.fixed.min.js","e85ded970eb7fe20ad6d593785597cf5"],["cdn/sw-toolbox/3.6.1/js/companion.fixed.min.js","e486dceafd56188a5dc1de867d0ddf47"],["cdn/sw-toolbox/3.6.1/js/sw-toolbox.fixed.min.js","a1fa75f796038fe792cdd2e9c1f23e95"],["cdn/tablesort/4.0.1/js/tablesort.fixed.min.js","b2f3a237e3c1e1b65a639265261a5dd7"],["favicon-16x16.png","fa5aeeb56378b9004adbdc29072e92bd"],["favicon-32x32.png","947c5bb31c93798e725131de25b868ea"],["favicon-96x96.png","b727d03c6138b44a736d10ab6c92177a"],["favicon.ico","75c4603265a2d4a3480803ce75774695"],["fonts/eaststreet-fontfacekit/everythingfonts/eaststreet.woff2","80b3fa22cf8658d16e843bdc44e4ecc6"],["fonts/eaststreet-fontfacekit/icomoon/fonts/eaststreet.eot","0620ee4e60632c7bd0c084a983ea1a69"],["fonts/eaststreet-fontfacekit/icomoon/fonts/eaststreet.ttf","b7cc966649befeafae6261d6b36247d6"],["fonts/eaststreet-fontfacekit/icomoon/fonts/eaststreet.woff","09e6981fea3b27777cc3de4b066ec92e"],["fonts/englishextra-ui-icons-fontfacekit/englishextra-ui-icons.ttf","81f52461c68b77e68e9f657bedc30b44"],["fonts/englishextra-ui-icons-fontfacekit/englishextra-ui-icons.woff","8243d49c08ff533ee364b5aee7285a57"],["fonts/englishextra-ui-icons-fontfacekit/englishextra-ui-icons.woff2","55459ec7fc45f660158276a4e96bc99c"],["fonts/exo2-fontfacekit/Exo2Bold.ttf","a7f36c21660634f7acfa0e040384e178"],["fonts/exo2-fontfacekit/Exo2Bold.woff","6fb576db403d6dc4a42c58c8734d3e97"],["fonts/exo2-fontfacekit/Exo2Bold.woff2","fee2aaec75877e565c3ea16fd041e6ce"],["fonts/exo2-fontfacekit/Exo2Italic.ttf","cf21dabaf9747c97f94a3c0f878d27ad"],["fonts/exo2-fontfacekit/Exo2Italic.woff","c4f030f7db45282dbecb1de5975c2264"],["fonts/exo2-fontfacekit/Exo2Italic.woff2","46a7c7ed5953cca908c550d1d0e7954a"],["fonts/exo2-fontfacekit/Exo2Light.ttf","2466870d7d21461f3b8dc5d4541f7e41"],["fonts/exo2-fontfacekit/Exo2Light.woff","3ff2dff93c5ca8408a71ab8065315ace"],["fonts/exo2-fontfacekit/Exo2Light.woff2","8dbc3f8ec1bc805c57e9993971cccd4c"],["fonts/exo2-fontfacekit/Exo2Regular.ttf","8e7aaf2547eef06f9b6779ac6f1ecdc3"],["fonts/exo2-fontfacekit/Exo2Regular.woff","7041d2bbe3a21e53ff2fe9bb8e868243"],["fonts/exo2-fontfacekit/Exo2Regular.woff2","be48c42b5b35445a96c756455a087ca5"],["fonts/fira-sans-fontfacekit/FiraSansBold.ttf","100d72f690df01b5cc4080d4777e1de9"],["fonts/fira-sans-fontfacekit/FiraSansBold.woff","02c6b5946e9ae21c407c008555dd0440"],["fonts/fira-sans-fontfacekit/FiraSansBold.woff2","7f7ccc8830b463be3562499e4eb97405"],["fonts/fira-sans-fontfacekit/FiraSansBoldItalic.ttf","e05ba50702e5aabe2f8ac6fa71bd1279"],["fonts/fira-sans-fontfacekit/FiraSansBoldItalic.woff","92125846d29d6b7a980efdff31ed5029"],["fonts/fira-sans-fontfacekit/FiraSansBoldItalic.woff2","06a7beb8bc42d76ae29f543e2de19d83"],["fonts/fira-sans-fontfacekit/FiraSansItalic.ttf","8b8131acabaee3555cb53d89f1a7b1d2"],["fonts/fira-sans-fontfacekit/FiraSansItalic.woff","3367233506db30f4a869b2bae06c2503"],["fonts/fira-sans-fontfacekit/FiraSansItalic.woff2","dc516fb2a7977d3e13c56f9e7446e0d7"],["fonts/fira-sans-fontfacekit/FiraSansLight.ttf","9249fece8060d1e3295e87dea2ea1214"],["fonts/fira-sans-fontfacekit/FiraSansLight.woff","187f4004e2f4dd2b0730bf19507886f0"],["fonts/fira-sans-fontfacekit/FiraSansLight.woff2","ecb6cb0cafd13916c56bc2e98b0d90b9"],["fonts/fira-sans-fontfacekit/FiraSansRegular.ttf","d49b922dac25b97c34a10d7fefaaef63"],["fonts/fira-sans-fontfacekit/FiraSansRegular.woff","e3d706931c23f2d7a6343bc65181346e"],["fonts/fira-sans-fontfacekit/FiraSansRegular.woff2","79ed19eb90d9eb6355a219db23a3411b"],["fonts/font-awesome-fontfacekit/fontawesome-webfont.eot","674f50d287a8c48dc19ba404d20fe713"],["fonts/font-awesome-fontfacekit/fontawesome-webfont.ttf","b06871f281fee6b241d60582ae9369b9"],["fonts/font-awesome-fontfacekit/fontawesome-webfont.woff","fee66e712a8a08eef5805a46892932ad"],["fonts/font-awesome-fontfacekit/fontawesome-webfont.woff2","af7ae505a9eed503f8b8e6982036873e"],["fonts/font-awesome-fontfacekit/fontello/font/fontawesome.eot","c2cd0c9b146be3cc9ab38db566b4c825"],["fonts/font-awesome-fontfacekit/fontello/font/fontawesome.ttf","2c9db5a451ca39e7ff7c02e6e079bbf0"],["fonts/font-awesome-fontfacekit/fontello/font/fontawesome.woff","3f7b31903565d37ef8596275bf190972"],["fonts/font-awesome-fontfacekit/fontello/font/fontawesome.woff2","c5f152d2a61b2e675732792e74138580"],["fonts/micon-with-webbrand-fontfacekit/fontello/font/micon.eot","b0d04bbf4a4cca8b31ae1ebed6e409cb"],["fonts/micon-with-webbrand-fontfacekit/fontello/font/micon.ttf","b9e935519e8ec4bfb003a0faa185c325"],["fonts/micon-with-webbrand-fontfacekit/fontello/font/micon.woff","5999d38e50f5ba2ec8096e428cd052b4"],["fonts/micon-with-webbrand-fontfacekit/fontello/font/micon.woff2","1bb00a6a2fe2ecd36c71187f4e8706be"],["fonts/micon-with-webbrand-fontfacekit/micon.eot","4771f41616c4aea9cdcba1dcb6820e8a"],["fonts/micon-with-webbrand-fontfacekit/micon.ttf","add321c58f295ec52fac292b805eae61"],["fonts/micon-with-webbrand-fontfacekit/micon.woff","719353eda6e057c8da2663148415a44d"],["fonts/micon-with-webbrand-fontfacekit/micon.woff2","a31013ede8691af640dbc424b6ec2a9c"],["fonts/source-code-pro-fontfacekit/SourceCodePro-Bold.otf.woff","c78ec902161e20ce8e85bfb23ef00e46"],["fonts/source-code-pro-fontfacekit/SourceCodePro-Bold.otf.woff2","5dbc52f0e9a3078f2b2bea0b33c0139d"],["fonts/source-code-pro-fontfacekit/SourceCodePro-Bold.ttf","a3c3082872743102af82207d10076209"],["fonts/source-code-pro-fontfacekit/SourceCodePro-It.otf.woff","bd9af36ed4710820c7c76c895c2a5f7f"],["fonts/source-code-pro-fontfacekit/SourceCodePro-It.otf.woff2","c5c2fa0510e65c146214a48a274d6ab5"],["fonts/source-code-pro-fontfacekit/SourceCodePro-It.ttf","4f22015ae8668226a7f7e8413fe93a81"],["fonts/source-code-pro-fontfacekit/SourceCodePro-Regular.otf.woff","13ecee9da9892b550e5960d65158f356"],["fonts/source-code-pro-fontfacekit/SourceCodePro-Regular.otf.woff2","e48cfaf910eb4e556049567b3017f90e"],["fonts/source-code-pro-fontfacekit/SourceCodePro-Regular.ttf","1066e54d79f902a2ff4d864c9a38a183"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-Bold.otf.woff","86dae8227f7c148070652cd9f37e4eae"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-Bold.otf.woff2","0d3b9a43eda8c6ebe926cd9740ec78a4"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-Bold.ttf","1e9b84fcbc477139e16061c80f0d873d"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-BoldIt.otf.woff","f49ab603c2bb4dc2334434191163cfc7"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-BoldIt.otf.woff2","7fed55fd4d78abda7b37fc5aacaf8d7a"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-BoldIt.ttf","7edeabe69cf9fd9b8d6310c3b9a027b1"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-It.otf.woff","e242c0963b781c2170587faab7507420"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-It.otf.woff2","dc350a1320c8c455fce22a68938ce05b"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-It.ttf","61403c3297a48cfeaf13071038a555cd"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-Light.otf.woff","7d901d6001e12e3fd36572daa796e9cc"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-Light.otf.woff2","ccd558990012aadae0602552f4c63140"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-Light.ttf","a663a1ba5f49629a86f7486aaf0f5359"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-Regular.otf.woff","bbd955e1383a2ab663298511a163d3dc"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-Regular.otf.woff2","0448fda3606e6dc571f763223e78861a"],["fonts/source-sans-pro-fontfacekit/SourceSansPro-Regular.ttf","d165cf1a72ee7db500ecfc9d7672a834"],["icon.png","bfc826488f7c35068a619ee9561b8964"],["index.html","669a81cf6404a806e7e50b6654a44e86"],["libs/branding/img/640x360.png","f940cab1456d1bc3c2313c16bbf3ec22"],["libs/branding/img/big_buck_bunny_640x360.jpg","6cbd50d4e22ebc784d898cd46cbad8a3"],["libs/branding/img/big_buck_bunny_640x360.png","1973edce6e2833969020d69c8baa9aa5"],["libs/contents/img/sprite.fw.png","b8c5fd14648459ca39a473043bd205c8"],["libs/contents/img/sprite.png","6a577885e5ddbd0c6f2606a74514f14a"],["libs/english_for_free/img/sprite.fw.png","43fdfc3a312fe962161f26cb13770009"],["libs/english_for_free/img/sprite.png","7dfdc3ced415df57702810732b08e12f"],["libs/forbidden/img/header.jpg","963183a975a739f7b786ac1b28abd8c7"],["libs/forbidden/img/sitelogo-rounded-333333-72x72.png","1ef6cf433a57ede12c5aa909a5a3afd0"],["libs/index/img/header.jpg","5941143b7644d3a2c7bebf0ef8ba3559"],["libs/index/img/sitelogo-rounded-F03B4C-200x200.png","b40696aa1860c94b5a00151d8ee96d16"],["libs/index/img/sitelogo-rounded-F03B4C-72x72.png","969c4006e77bed42e895b66808366cec"],["libs/irregular_verbs_with_shower/img/progress-1034x10.png","746f1b73a0d44a646128bfe311649df3"],["libs/irregular_verbs_with_shower/img/sitelogo-with-text-ru-FFFFFF-D54848-210x46.png","e24c10c40bf0bad7fa3be3953247a069"],["libs/irregular_verbs_with_shower/img/slide-50x100.png","088ffac01d51f73a378f80900bd98971"],["libs/notfound/img/bg-417x417.png","688d29b939aaa81db1ef6789b281147c"],["libs/notfound/img/sitelogo-72x72.png","666fb90a990ea03a31443a2468a731c5"],["libs/notfound/img/siteltitle-270x40.png","9bedbc586dd18ae9baaeb9c69e93e468"],["libs/notfound/img/smartphone-469x625.png","efed089deff07b4052a6d93a2906bb4c"],["libs/notfound/img/smartphone2-646x496.png","32d34e359cc50e194b9d789bda4a7a93"],["libs/notfound/img/stripe-top-480x60.png","5c06f1febe5aa2913cd8dd872842cd70"],["libs/paper/img/sprite.fw.png","49de7446e4523222a52a859ee1112a9b"],["libs/paper/img/sprite.png","00708ca37ba1ebbe287f4e51401f8e98"],["libs/portfolio/img/sprite.fw.png","750f5e8b3e652871cad1e9aeed07cf66"],["libs/portfolio/img/sprite.png","417cfe834b1be128eef3756bce841374"],["libs/products/img/bg-img-1.png","f257e113738e0267e792a678dc23c797"],["libs/products/img/bg-img-2.png","be7687c955730f969e9254bd6460633d"],["libs/products/img/bg-img-3.png","f6ba361326493bba4119f147c549eb8a"],["libs/products/img/download_android_app_144x52.png","2582e9353f8aad9877a0dab9e87d997d"],["libs/products/img/download_linux_app_144x52.png","9e84aa18b8be286f796f8ad521830e7d"],["libs/products/img/download_windows_app_144x52.png","e4d91f37367ed726faa4a0b041e0e9d1"],["libs/products/img/download_wp_app_144x52.png","2217fa28a74827a63e5815b0bd779c75"],["libs/serguei-eaststreet/img/logo-96x96.png","94715e52e0fe34ec68a14f497740fea0"],["libs/serguei-eaststreet/img/sprite-books/books-collins-cobuild-english-grammar-512x680.fw.png","eb8868e1e7fcbcf5676d5bcd2f0fdfbb"],["libs/serguei-eaststreet/img/sprite-books/books-collins-cobuild-english-grammar-512x680.jpg","8d8413603bb2115ca668fac2089d113e"],["libs/serguei-eaststreet/img/sprite-books/books-essential-grammar-in-use-512x680.fw.png","587d54f542d0eba01388e01e7d874949"],["libs/serguei-eaststreet/img/sprite-books/books-essential-grammar-in-use-512x680.jpg","a568f0c1c2297c75c33c5aed49dd8ea0"],["libs/serguei-eaststreet/img/sprite-books/books-golitsynsky-exercises-512x680.fw.png","dc3019b076610405520884f1656c3f01"],["libs/serguei-eaststreet/img/sprite-books/books-golitsynsky-exercises-512x680.jpg","45e9b86fff8f9a52c55cfd7725d37007"],["libs/serguei-eaststreet/img/sprite-books/books-macmillan-exam-skills-for-russia-grammar-and-vocabulary-512x680.fw.png","35c3e5d26e247a4486930b8b1be2342c"],["libs/serguei-eaststreet/img/sprite-books/books-macmillan-exam-skills-for-russia-grammar-and-vocabulary-512x680.jpg","3c69ccb3a36c5b1aac875a272e1c3f0f"],["libs/serguei-eaststreet/img/sprite-contacts-desktop/tile-mailto-512x512.png","5177e8c739ed47a2923aad2f434933c6"],["libs/serguei-eaststreet/img/sprite-contacts-desktop/tile-odnoklassniki-512x512.png","106183973a7bfac416ce551c09055aff"],["libs/serguei-eaststreet/img/sprite-contacts-desktop/tile-tel-512x512.png","e1eb39150d1c0ae4c9cf8c2eaff9f37d"],["libs/serguei-eaststreet/img/sprite-contacts-desktop/tile-vkontakte-512x512.png","8319609894b656f82cd0618ccd51f6f5"],["libs/serguei-eaststreet/img/sprite-contacts-mobile/tile-mailto-512x512.png","87bad52d585506de5aa944ab4d9cbdca"],["libs/serguei-eaststreet/img/sprite-contacts-mobile/tile-odnoklassniki-512x512.png","55f702b594a2d98b49e0887419627343"],["libs/serguei-eaststreet/img/sprite-contacts-mobile/tile-tel-512x512.png","721bb479d17fc58aa02509d33c10e900"],["libs/serguei-eaststreet/img/sprite-contacts-mobile/tile-vkontakte-512x512.png","2c2f5cfd3848bacec8cc97e0ffe692a7"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-at-desktop-1440x810.jpg","f3a1d6f712372b9c7e4012c4ea96b20c"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-at-desktop-640x360.jpg","ed844c6fd326d7111bb0c5956218ec8f"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-demo-ege-1440x810.jpg","1cc056dfe003f6228a1f8483f42d55e8"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-demo-ege-640x360.jpg","201f8a932c82076c7e854bda3fd990d3"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-demo-ege-speaking-1440x810.jpg","215be0b8e16cf641b3ac363dc4e7643b"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-demo-ege-speaking-640x360.jpg","4bb4ed7074786eefbfa8a4687a61efef"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-in-front-of-salyut-1440x810.jpg","217eb1428c06f5c0923a1724413a00ea"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-in-front-of-salyut-640x360.jpg","7eb55e35bcfb662ef531b1cc90546239"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-previous-ege-analysis-1440x810.jpg","fd5c10ca4291cafc4dae40402160ba89"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-previous-ege-analysis-640x360.jpg","a0d0268d1254b2efdde39e6f9411ab9e"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-watch-movies-1024x1024.jpg","220a7ee972e38e0bf7b38c7ce362a490"],["libs/serguei-eaststreet/img/sprite-serguei/serguei-watch-movies-512x512.jpg","97075eb212d29146f931fd0ac06bd605"],["libs/serguei-webslides/img/logo-256x96.png","508db5e63ad79bd1a2dcaee491a88c03"],["libs/serguei-webslides/img/logo-96x96.png","b43916271fc231030caa9f8e6c9ec1ee"],["libs/serguei-webslides/img/sprite-books.jpg","d416f8b634a2cbaef6c0edf2521d7fa9"],["libs/serguei-webslides/img/sprite-books/books-collins-cobuild-english-grammar-512x680.fw.png","2eab608d7b29e040cedb7f976dcfc7c1"],["libs/serguei-webslides/img/sprite-books/books-collins-cobuild-english-grammar-512x680.jpg","ea2e0ff81e5121ff35348ca080015d05"],["libs/serguei-webslides/img/sprite-books/books-essential-grammar-in-use-512x680.fw.png","bac5fa76d9ae2ab2896f424b9ef46e81"],["libs/serguei-webslides/img/sprite-books/books-essential-grammar-in-use-512x680.jpg","9b3c6bb6ed35cf936204c93b366cee1c"],["libs/serguei-webslides/img/sprite-books/books-golitsynsky-exercises-512x680.fw.png","7413bfc6665a0cadde57da4be10777d3"],["libs/serguei-webslides/img/sprite-books/books-golitsynsky-exercises-512x680.jpg","5b99c3ae469953afc0710219e3b8e9eb"],["libs/serguei-webslides/img/sprite-books/books-macmillan-exam-skills-for-russia-grammar-and-vocabulary-512x680.fw.png","3642fa24bd48f34a3b80e12753582518"],["libs/serguei-webslides/img/sprite-books/books-macmillan-exam-skills-for-russia-grammar-and-vocabulary-512x680.jpg","ca7d91531ffb1f24c8900e37e1acdda3"],["libs/serguei-webslides/img/sprite-contacts-desktop.fw.png","7554d1fbea3136bb22d0a577b529adc6"],["libs/serguei-webslides/img/sprite-contacts-desktop.png","069b49f96d39b47e2ebb5a4b123529d5"],["libs/serguei-webslides/img/sprite-contacts-desktop/tile-mailto-512x512.png","1f71138009e76aa668e9c2b5f3faf52a"],["libs/serguei-webslides/img/sprite-contacts-desktop/tile-odnoklassniki-512x512.png","4e8697ea2de813630dfb8ed61b7462ef"],["libs/serguei-webslides/img/sprite-contacts-desktop/tile-tel-512x512.png","1f71138009e76aa668e9c2b5f3faf52a"],["libs/serguei-webslides/img/sprite-contacts-desktop/tile-vkontakte-512x512.png","0e1e8cfc6ae46087a740d82a9b64fa3e"],["libs/serguei-webslides/img/sprite-contacts-mobile.fw.png","c56ada3efada3ae51301dabf5b4dabb1"],["libs/serguei-webslides/img/sprite-contacts-mobile.png","7448e0d62ef960ebd0a6525aa0f6f9b0"],["libs/serguei-webslides/img/sprite-contacts-mobile/tile-mailto-512x512.png","ba427261648e1d6b12d132fbfa9d7029"],["libs/serguei-webslides/img/sprite-contacts-mobile/tile-odnoklassniki-512x512.png","ff99fe58f06d3c69a6c7b87bc7cf469f"],["libs/serguei-webslides/img/sprite-contacts-mobile/tile-tel-512x512.png","c2bf2f9491eb0fd2c1c3920274b34fbc"],["libs/serguei-webslides/img/sprite-contacts-mobile/tile-vkontakte-512x512.png","7c5c97ce3904eff0d3d0de4d2cbb944b"],["libs/serguei-webslides/img/sprite-serguei/serguei-at-desktop-1440x810.jpg","f3a1d6f712372b9c7e4012c4ea96b20c"],["libs/serguei-webslides/img/sprite-serguei/serguei-in-front-of-salyut-1440x1080.jpg","3a4c92d47f6d7b062b246343acf0651b"],["libs/serguei-webslides/img/swipe-96x96.png","5147b968b6b49e794b0debd449a3f459"],["libs/sitemap/img/sprite.png","534fa3b91f40265048a9044677fc5c0a"],["manifest.json","5f5f230e63fd6e577c42416e0b3b48dd"],["mstile-150x150.png","9c13a38d01c28b47d0b76798b17d51e3"],["mstile-310x150.png","ed9469c37a0d228098d1a3e885f99678"],["pages/aids/aids_most_commonly_used_idioms.html","8bbec3f57d6f8f853f962ae9d10256e2"],["pages/aids/aids_teaching_pronunciation.html","7e147cb10dcdcd53c72fedc78c3a47ff"],["pages/aids/aids_topics.html","5b41dc5f7a67ce5c5354f571ce4767ee"],["pages/articles/articles_reading_rules_utf.html","ca775c1eac7f8a58f29ff31d353811c2"],["pages/contents.html","2bcd0c406c707e74f330f3d39e1f37ad"],["pages/grammar/grammar_all_whole_entire.html","5456c982c460c18c5cd9f6786519d2ae"],["pages/grammar/grammar_alone_by_myself_and_on_my_own.html","f3a0a5120c0735bf845e5cc626391fbd"],["pages/grammar/grammar_attributes_order.html","1de91660529a00cf2859fc6ea485d70e"],["pages/grammar/grammar_can_could_be_able_to.html","b6fe7e3d833f8db674b95dae0af32fc0"],["pages/grammar/grammar_capital_letters.html","844e4b5fa6e7598de9fcc42792156e06"],["pages/grammar/grammar_comma_before_who_which_that.html","3b1f0c2c798504f4b4fe3affd87f424c"],["pages/grammar/grammar_common_and_proper_nouns.html","608e6a52dc3dcabf46409e9aa4f4c384"],["pages/grammar/grammar_conditionals.html","c0d5127727ac567c6d408d7b090975c8"],["pages/grammar/grammar_degrees_of_comparison.html","105f6a524822c504b25d4d5abb667fe3"],["pages/grammar/grammar_ex_former.html","4c472ac5588c4ad0da05a8a9f937d746"],["pages/grammar/grammar_foreign_words.html","58c2daa044e79b332b239ba6cd322cfa"],["pages/grammar/grammar_glossary_of_grammatical_terms.html","56d4ae7687e6e3d0ff907a9f9baec73f"],["pages/grammar/grammar_grammar_girl_s_quick_and_dirty_grammar_at_a_glance.html","3b449d7a82293f8153ca5d2092c803e2"],["pages/grammar/grammar_in_at_on.html","60a64bb505028210091c974fc9e4332b"],["pages/grammar/grammar_in_hospital_at_work.html","afe1622600cda2ce0d7c4abb3f16ca30"],["pages/grammar/grammar_irregular_verbs.html","871f2395c8678bffa15c145d1238d0db"],["pages/grammar/grammar_may_might_be_allowed_to.html","b87c1f8040da6ae42007a6efb5431ec5"],["pages/grammar/grammar_modal_verbs.html","df577c2aa61f7218d974060dd2927eba"],["pages/grammar/grammar_much_many_little_few.html","f3fbbf6434c2b04bb19a9797f0507ae2"],["pages/grammar/grammar_or_nor_neither.html","7238ae5929bb0a3953d86699b51cc0ea"],["pages/grammar/grammar_phrasal_verbs.html","b85645ef0fedf8b19486c580e4971be8"],["pages/grammar/grammar_reported_speech.html","7c57de70212d5edca9fcc26d910354b9"],["pages/grammar/grammar_saying_numbers.html","d43d35467516e99bd04a34dfab2c0d70"],["pages/grammar/grammar_stative_and_action_verbs.html","e9fb5f35509ac537643a790920b0778c"],["pages/grammar/grammar_the_listing_comma.html","08a4f97be1fa61930d4ba252528cb79e"],["pages/grammar/grammar_to_me_for_me.html","459d468374241287140d487d4bccdd84"],["pages/grammar/grammar_too_enough_so_such.html","27a9a6142f372000a456f15825f50940"],["pages/grammar/grammar_translating_participles.html","647ed36c4f4a557cc35cabbbc03f3c19"],["pages/grammar/grammar_usage_of_articles_a_the.html","0209b943cfc2d1615da9b986d8c58476"],["pages/grammar/grammar_usage_of_hyphens.html","6bf38818b279c67d9b3d6f78306e6763"],["pages/grammar/grammar_usage_of_tenses.html","e1859cddbb44b1b8a99937574aca69ad"],["pages/grammar/grammar_when_must_means_probably.html","e45ef520bfb09d3f9a42a0efe24ac75f"],["pages/grammar/grammar_word_order.html","1221888a93df1c87e6f1029912628dce"],["pages/more/more_irregular_verbs.html","1a320e4ea027bc646ce01386d8d64cff"],["pages/more/more_irregular_verbs_with_shower.html","611c00261128929ceba940cd42ce0fb4"],["pages/more/more_newsletter_can_get_english_for_free.html","3bd22b75791ff8879ea63834a9bb6185"],["pages/more/more_products.html","fbf257b81994f8bde4f48e4fc8f17cd3"],["pages/reading/reading_country_language_person_capital.html","650c1cb6f3d8e33bb82ea68e2230f5f1"],["pages/reading/reading_russia_ukraine_war_conflict_vocabulary.html","284db42a91bce43e4176955905338f69"],["pages/reading/reading_the_man_with_the_scar.html","a513b110aa17b833d1c710de245bd3d2"],["pages/tests/tests_advanced_grammar_in_use_level_test.html","d32052946c546ecab1a0a8f2ace4d1a4"],["pages/tests/tests_common_mistakes_test_advanced.html","8f4eef8bc8c18b5ad213e6a4724f0e16"],["pages/tests/tests_ege_english_test_sample.html","fdd0ab83f276dd35ff05e47d2f5534d4"],["pages/tests/tests_ege_english_test_sample_speaking.html","2d6b4b5ad625818818842eb7be121c36"],["pages/tests/tests_ege_essay_sample.html","7543aa6b5b84608f549bb6dcfa8a89e0"],["pages/tests/tests_english_allrussian_olympiad_regional_stage_2013.html","03c4a24bcce56bd0a5c0a9e93ff7ceaf"],["pages/tests/tests_english_grammar_in_use_level_test.html","daa2d4098f3e6edccf97e52d0bff90c6"],["pages/tests/tests_essential_grammar_in_use_level_test.html","a45e55d631f783129ed5c8468c2fa179"],["pages/tests/tests_gia_ege_letter_sample.html","b2e04977e6ce62fd230e3d8996664960"],["pages/tests/tests_gia_english_test_sample.html","2d2c0b69a30049eec316dd62981b6fbc"],["pages/tests/tests_gia_english_test_sample_speaking.html","bc9d9ec5c04019b3223233a1915fff17"],["pages/tests/tests_grammar_tests_with_answers.html","30bb53a8a16170bd6ed99231dcabadff"],["pages/tests/tests_languagelink_online_test.html","7f729559b62fd10d2f5ab56f93a35eae"],["pages/tests/tests_macmillan_practice_tests_for_the_russian_state_exam_2nd_test_20.html","6f756ea64c30674a61bba92bf680aa4d"],["pages/tests/tests_macmillan_practice_tests_for_the_russian_state_exam_keys.html","dc4389849febb1f78b5ba687634b10f6"],["pages/tests/tests_macmillan_practice_tests_for_the_russian_state_exam_keys_2nd.html","312fc0e48addacf22f6a826150d3658b"],["pages/tests/tests_previous_ege_analysis.html","59ed93a54eb41f0a7cbd92d2d87afeaa"],["pages/transcripts/transcripts_episode_all_train_compartments_smell_vaguely_of_shit.html","0af0ff4479c542d61edec12105dc8562"],["pages/transcripts/transcripts_episode_cousins_question_mark.html","bf70c9d2aedb2f14b876a093884988fd"],["pages/transcripts/transcripts_episode_stop_swinging_the_bat.html","5e22bbcb6981dc04d6bdd3bac56e6bcc"],["pages/transcripts/transcripts_linguaspectrum_essential_british_english_expressions.html","dacec9c30c29149de249228e757a1c3f"],["pages/transcripts/transcripts_linguaspectrum_spell.html","4cdc40bb99485b013c4ed0d7f4bb5faf"],["pages/transcripts/transcripts_video_vocab_transcripts.html","f2b0fc843d953f99afe24fb1cb403819"],["pages/webdev/webdev_about.html","9dcdb53d4944ee163845ac16573e6474"],["pages/webdev/webdev_brief_for_website.html","ebe681522be2f9391a7a45a30bb79269"],["pages/webdev/webdev_styleguide.html","14e8f75e696d7ba82a410a6e79578d88"],["safari-pinned-tab.svg","440f6c5ffa07ec0cdcdd618c51362ff1"],["yandex-tableau-50x50.png","666b17e38a4d2f8bfb9a1e3e70e77cff"],["yandex-tableau.json","d837569b1f5633430047b97a8b565977"]];
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

toolbox.router.get(/^https:\/\/mc\.yandex\.ru/, toolbox.networkOnly, {});
toolbox.router.get(/^https:\/\/www\.google-analytics\.com/, toolbox.networkOnly, {});
toolbox.router.get(/^https:\/\/ssl\.google-analytics\.com/, toolbox.networkOnly, {});
toolbox.router.get(/^https:\/\/(.*?)\.disqus\.com/, toolbox.networkOnly, {});
toolbox.router.get(/^https:\/\/w\.soundcloud\.com/, toolbox.networkOnly, {});
toolbox.router.get(/^https:\/\/player\.vimeo\.com/, toolbox.networkOnly, {});
toolbox.router.get(/^https:\/\/www\.youtube\.com/, toolbox.networkOnly, {});
toolbox.router.get(/\/libs\/(.*?)\/css\//, toolbox.fastest, {});
toolbox.router.get(/\/libs\/(.*?)\/js\//, toolbox.fastest, {});
toolbox.router.get(/\/libs\/(.*?)\/json\//, toolbox.fastest, {});




