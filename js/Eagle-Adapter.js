/* -----------------------------------------------------------------------------
   EAGLE ADAPTER

   DONE
   - padding (left + right + top + bottom)
   - align (horizontal[left center right] and vertical[top middle bottom])
   - wrap option (none, auto = word, char)
   - fixed ISSUE empty line is not proceeded
   - fixed ISSUE: left align, wrap text should not reserve white space on left
   - wrap as a mixin & use factory to create
   - fixed ISSUE: enable trimSpaceWhenWrap cause worng index of character
     in line
   - added support to partial text format

   REMAINING
   - text direction
   - align justify
   - strokeText & strokeTextWidth
   - textBackgroundColor
   - changelist to be updated (ex: this._padWidth need to update when padLeft
     or padRight changed)
   - performance improvement (using cache...)
   - wapping cause lots of Array creation and deletion -> need check.
   - renderChar function
   - trim and push.appy x browser support
   - textOverflow support : https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow
   - toObject for seriallizing & fromObject for deseriallizing
   - gradient fill (toLive)
   - analyse performance of recurssive call of _wrapLine vs. normal loop
   - add text effects such as glow, shadow ... (refer power point)
   - symphony (http://www.pearsonified.com/2011/12/golden-ratio-typography.php)

   ISSUE
   - scale down width to small cause carshed error : spliLine undefined
     * root cause : when width is too small (less than a character), function
       splitLineByWidth() return undefined
     * applied fix: TBD
   - ctx.textHAlign = left or start ???
   - ISSUE @18Sep2015 : rich text format cause wrong measurement, since each
     char may have each style. Measure need to accumulate every char ->
     may produce greate negative impact to performance

   ---------------------------------------------------------------------------*/
"use strict";

var Eagle = {};

(function() {
  Eagle = {
    version : '0.0.1',

    Embed : {},

    Util : {}

  };
})();
