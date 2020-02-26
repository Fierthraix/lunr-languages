/*!
 * Lunr languages, `Esperanto` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory)
    } else if (typeof exports === 'object') {
        /**
         * Node. Does not work with strict CommonJS, but
         * only CommonJS-like environments that support module.exports,
         * like Node.
         */
        module.exports = factory()
    } else {
        // Browser globals (root is window)
        factory()(root.lunr);
    }
}(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return function(lunr) {
        /* throw error if lunr is not yet included */
        if ('undefined' === typeof lunr) {
            throw new Error('Lunr is not present. Please include / require Lunr before this script.');
        }

        /* throw error if lunr stemmer support is not yet included */
        if ('undefined' === typeof lunr.stemmerSupport) {
            throw new Error('Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.');
        }{{consoleWarning}}

        /* register specific locale function */
        lunr.eo = function () {
            this.pipeline.reset();
            this.pipeline.add(
                lunr.eo.trimmer,
                lunr.eo.stopWordFilter,
                lunr.eo.stemmer
            );

            // for lunr version 2
            // this is necessary so that every searched word is also stemmed before
            // in lunr <= 1 this is not needed, as it is done using the normal pipeline
            if (this.searchPipeline) {
                this.searchPipeline.reset();
                this.searchPipeline.add(lunr.eo.stemmer)
            }
        };

        /* lunr trimmer function */
        lunr.eo.wordCharacters = "ABCDEFGĜHĤIJĴKLMNOPRSŜTUŬVXZabcdefgĝhĥijĵklmnoprsŝtuŭvxz";
        lunr.eo.trimmer = lunr.trimmerSupport.generateTrimmer(lunr.eo.wordCharacters);

        lunr.Pipeline.registerFunction(lunr.eo.trimmer, 'trimmer-eo');

        /* lunr stemmer function */
        //XXX
        lunr.eo.stemmer = (function() {
            /* create the wrapped stemmer object */
            var Among = lunr.stemmerSupport.Among,
                SnowballProgram = lunr.stemmerSupport.SnowballProgram,
                st = new function EsperantoStemmer() {
                    var word = null;

                    this.setCurrent = function(word) {
                        this.word = word;
                    };
                    this.getCurrent = function() {
                        return this.word;
                    };
                    this.stem = function() {
                        // Every word at this point is guaranteed to have 3 letters
                        var endings = [ "is", "as", "os", "us", "u", "e", "en",
                            "a", "an" "aj", "ajn", "o", "on", "oj", "ojn" ];

                        if (this.word.length == 1) {
                            return;
                        } else if (this.word.length == 2) {
                            if (this.word.charAt(-1) == "o") {
                                this.word = this.word.charAt(0);
                            }
                            return;
                        // The word has at least 3 letters
                        } else {
                            for (var i = 0; i < endings.length; i++) {
                                var ending = endings[i];
                                if (word.endsWith(ending)) {
                                    this.word = this.word.slice(-ending.length);
                                    return;
                                }
                            }
                        }
                    }
                };

            /* and return a function that stems a word for the current locale */
            return function(token) {
                // for lunr version 2
                if (typeof token.update === "function") {
                    return token.update(function (word) {
                        st.setCurrent(word);
                        st.stem();
                        return st.getCurrent();
                    })
                } else { // for lunr version <= 1
                    st.setCurrent(token);
                    st.stem();
                    return st.getCurrent();
                }
            }
        })();

        lunr.Pipeline.registerFunction(lunr.eo.stemmer, 'stemmer-eo');

      /*
la ĉi ĉu afero jes ne ho ve
al anstataŭ antaŭ apud da de dum ekde eskter el en inter je kontraŭ krom kun laŭ per por post pri pro sen sub super sur tra trans ĉe ĉirkaŭ ĝis
aŭ kaj ke kvankam nek ol se sed ĉar
almenaŭ ambaŭ ankaŭ ankoraŭ apenaŭ baldaŭ hieraŭ hodiaŭ kvazaŭ morgaŭ preskaŭ 
for jam ĵus nun nur plej malplej pli malpli plu tre tro tuj

esti estu estas estis estos estus
povi pove povas povis povos povus
devi devu devas devis devos devus
fari faru faras faris faros farus
fariĝi fariĝu fariĝas fariĝis fariĝos fariĝus
okazi okazas okazis okzasos okazus

plej pli malplej malpli plu tre tro 
eble verŝajne

kio kioj kion kiojn
kiu kiuj kiun kiujn
kia kiaj kian kiajn
kiam kie kiel kiom kioma kial kies

tio tioj tion tiojn
tiu tiuj tiun tiujn
tia tiaj tian tiajn
tiam tie tiel tiom tioma tial ties

io ion iu iuj iun iujn
ia iaj ian iajn
iam ie iel iom ioma ial ies
iomete

ĉio ĉion ĉiu ĉiuj ĉiun ĉiujn
ĉia ĉiaj ĉian ĉiajn
ĉiam ĉie ĉiel ĉiom ĉioma ĉial ĉies

nenio nenion neniu neniuj neniun neniujn
nenia neniaj nenian neniajn
neniam nenie neniel neniom nenioma nenial nenies

oni onin
alia aliaj alian aliajn
mi mia miaj mian miajn
vi via viaj vian viajn
li lia liaj lian liajn
ŝi ŝia ŝiaj ŝian ŝiajn
gi gia giaj gian giajn
ni nia niaj nian niajn
ili ilia iliaj ilian iliajn
       */

        lunr.eo.stopWordFilter = lunr.generateStopWordFilter(''.split(' '));

        lunr.Pipeline.registerFunction(lunr.eo.stopWordFilter, 'stopWordFilter-eo');
    };
}))
