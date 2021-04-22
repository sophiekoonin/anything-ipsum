/**
 *  Ipsum generator
 *  based on code by:
 *  rviscomi@gmail.com Rick Viscomi,
 *	tinsley@tinsology.net Mathew Tinsley
 */

/**
 *	Copyright (c) 2009, Mathew Tinsley (tinsley@tinsology.net)
 *	All rights reserved.
 *
 *	Redistribution and use in source and binary forms, with or without
 *	modification, are permitted provided that the following conditions are met:
 *		* Redistributions of source code must retain the above copyright
 *		  notice, this list of conditions and the following disclaimer.
 *		* Redistributions in binary form must reproduce the above copyright
 *		  notice, this list of conditions and the following disclaimer in the
 *		  documentation and/or other materials provided with the distribution.
 *		* Neither the name of the organization nor the
 *		  names of its contributors may be used to endorse or promote products
 *		  derived from this software without specific prior written permission.
 *
 *	THIS SOFTWARE IS PROVIDED BY MATHEW TINSLEY ''AS IS'' AND ANY
 *	EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *	DISCLAIMED. IN NO EVENT SHALL <copyright holder> BE LIABLE FOR ANY
 *	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *	(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *	LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *	ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *	SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Average number of words per sentence.
 */
const WORDS_PER_SENTENCE_AVG = 24.46;

/**
 * Standard deviation of the number of words per sentence.
 */
const WORDS_PER_SENTENCE_STD = 5.08;

// Generate a random number between 50 and 100, for paragraph length
function randomParaLength() {
  return Math.floor(Math.random() * (100 - 50 + 1) + 50);
}

/**
 * Generate "Lorem ipsum" style words.
 */
function generate(seedWords) {
  if (seedWords.length < 5) return;

  let words, ii, position, word, current, sentences, sentence_length, sentence;

  let numWords = randomParaLength();

  words = [seedWords[0], seedWords[1]];
  numWords -= 2;

  for (ii = 0; ii < numWords; ii++) {
    position = Math.floor(Math.random() * seedWords.length);
    word = seedWords[position];

    if (ii > 0 && words[ii - 1] === word) {
      ii -= 1;
    } else {
      words[ii] = word;
    }
  }

  sentences = [];
  current = 0;

  while (numWords > 0) {
    sentence_length = getRandomSentenceLength();

    if (numWords - sentence_length < 4) {
      sentence_length = numWords;
    }

    numWords -= sentence_length;

    sentence = [];

    for (ii = current; ii < current + sentence_length; ii++) {
      sentence.push(words[ii]);
    }

    sentence = punctuate(sentence);
    current += sentence_length;
    sentences.push(sentence.join(' '));
  }

  return sentences.join(' ');
}

/**
 * Insert commas and periods in the given sentence.
 * @param {Array.string} sentence List of words in the sentence.
 * @return {Array.string} Sentence with punctuation added.
 */
function punctuate(sentence) {
  var word_length, num_commas, ii, position;

  word_length = sentence.length;

  /* End the sentence with a period. */
  sentence[word_length - 1] += '.';

  if (word_length < 4) {
    return sentence;
  }

  num_commas = getRandomCommaCount(word_length);

  for (ii = 0; ii <= num_commas; ii++) {
    position = Math.round((ii * word_length) / (num_commas + 1));

    if (position < word_length - 1 && position > 0) {
      /* Add the comma. */
      sentence[position] += ',';
    }
  }

  /* Capitalize the first word in the sentence. */
  sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);

  return sentence;
}

/**
 * Produces a random number of commas.
 * @param {number} word_length Number of words in the sentence.
 * @return {number} Random number of commas
 */
function getRandomCommaCount(word_length) {
  var base, average, standard_deviation;

  /* Arbitrary. */
  base = 6;

  average = Math.log(word_length) / Math.log(base);
  standard_deviation = average / base;

  return Math.round(gaussMS(average, standard_deviation));
}

/**
 * Produces a random sentence length based on the average word length
 * of an English sentence.
 * @return {number} Random sentence length
 */
function getRandomSentenceLength() {
  return Math.round(gaussMS(WORDS_PER_SENTENCE_AVG, WORDS_PER_SENTENCE_STD));
}

/**
 * Produces a random number.
 * @return {number} Random number
 */
function gauss() {
  return (
    Math.random() * 2 - 1 + (Math.random() * 2 - 1) + (Math.random() * 2 - 1)
  );
}

/**
 * Produces a random number with Gaussian distribution.
 * @param {number} mean
 * @param {number} standard_deviation
 * @return {number} Random number
 */
function gaussMS(mean, standard_deviation) {
  return Math.round(gauss() * standard_deviation + mean);
}

function init() {
  document
    .getElementById('copy-to-clipboard')
    .addEventListener('click', (e) => {
      copyToClipboard(e);
    });
  document.getElementById('form').addEventListener('submit', (e) => {
    document.getElementById('error').textContent = '';
    document.getElementById('confirm').textContent = '';
    document.getElementById('output').value = '';

    e.preventDefault();
    const wordInput = document.getElementById('words').value || '';
    const seedWordArray = wordInput.split('\n').map((w) => w.trim());
    if (seedWordArray.length < 5) {
      document.getElementById('error').textContent =
        'Please enter 5 or more words';
      return;
    }
    const numParas = document.getElementById('paras').value || 1;
    const ipsumArray = [];
    for (let i = 0; i < numParas; i++) {
      ipsumArray.push(generate(seedWordArray));
    }
    document.getElementById('output').value = ipsumArray.join('\n\n');
  });
}
init();

function copyToClipboard() {
  const output = document.getElementById('output');
  output.select();
  document.execCommand('copy');
  document.getElementById(
    'confirm'
  ).innerHTML = `<span class="visually-hidden">Copied to clipboard</span><span aria-hidden="true">✅</span>`;
}
