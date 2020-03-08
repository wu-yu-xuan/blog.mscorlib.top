# Watch Out for Zero-Length Matches

A zero-width or zero-length match is a regular expression match that does not match any characters. It matches only a position in the string. E.g. the regex `\b` matches between the `1` and `,` in `1,2`.

Zero-lenght matches are often an unintended result of mistakenly making everything optional in a regular expression. Such a regular expression will in fact find a zero-length match at every position in the string. [My floating point example](http://www.regular-expressions.info/floatingpoint.html) has long shown this.

Apparently, JavaScript developers have it particularly tough. Different browsers handle zero-length matches differently. Steven Levithan argues that [IE has a bug because it increments lastIndex](http://blog.stevenlevithan.com/archives/exec-bugs). Steven’s observation is correct. When iterating over `/\b/g.exec()`, `regex.lastIndex = match.index + 1` in Internet Explorer, while in other browsers they’re equal. So who’s got it wrong?

The ECMA-262 v3 standard defines the **lastIndex** property in 15.10.7.5 as:

> The value of the lastIndex property is an integer that specifies the string position at which to start the next match.

It’s easy enough to understand this in the context where the developer sets **lastIndex** prior to calling `exec()` to make the match attempt start at a certain position. But how should the `exec()` method set **lastIndex** after a successful match?

For `String.match()` the standard says in 15.5.4.10:

> If there is a match with an empty string (in other words, if the value of regexp.lastIndex is left unchanged), increment regexp.lastIndex by 1.

For `String.replace()` the standard says in 15.5.4.11:

> Do the search in the same manner as in String.match(), including the update of searchValue.lastIndex.

But for `RegExp.exec()` the standard says in 15.10.6.2:

> Let e be r’s endIndex value [i.e. the end of the match]. If the global property is true, set lastIndex to e.

The standard contradicts itself. 15.10.6.2 is inconsistent with the three other definitions, in that it omits the +1 in case of a zero-width match.

My opinion though is that, Internet Explorer got it right, and that browsers who implement 15.10.6.2 as written while ignoring the definition in 15.10.7.5 got it wrong. The omission of the `lastIndex++` for `regex.exec()` looks to me as an oversight by the standards writers rather than something they did intentionally. The reason is that every regex engine that I know of works the way Internet Explorer. It’s the only way to avoid an **infinite loop**, like Firefox does.

If a zero-width match is found, the next match attempt begins one character further ahead in the string. After `\b` matches between the `1` and `,` in `1,2`, the next match attempt will begin at the position between the , and the 2 (and match there), rather than staying stuck forever.

I do understand where the confusion comes from. The property is called lastIndex, but the standard defines it as something that should be called nextAttempt. **lastIndex is not the end of the previous match.** The ECMA-262 standard does not provide a property for that. To get that you have to add up match.index and match[0].length yourself.

Here’s my solution to the browser compatibility problem:

```javascript
while ((match = regex.exec(subject))) {
  // Prevent browsers like Firefox from getting stuck in an infinite loop
  if (match.index == regex.lastIndex) regex.lastIndex++;
  // Do whatever you want with the match
  start_of_match = match.index;
  length_of_match = match[0].length;
  first_character_after_match = start_of_match + length_of_match;
}
```

This code is easy to understand, and only uses one extra line (plus a comment) to work around the browser problems.

## Reference From

[Watch Out for Zero-Length Matches – Regex Guru](http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/)
