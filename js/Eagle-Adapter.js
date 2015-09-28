/* -----------------------------------------------------------------------------
   EAGLE ADAPTER

   DONE
   - padding (left + right + top + bottom)
   - align (horizontal[left center right] and vertical[top middle bottom])
   - wrap option (none, auto = word, char)
   - fixed ISSUE empty line is not proceeded
   - fixed ISSUE: left align, wrap text should not reserve white space on left
   - wrap as a mixin & use factory to create

   REMAINING
   - text direction
   - align justify
   - strokeText & strokeTextWidth
   - changelist to be updated (ex: this._padWidth need to update when padLeft
     or padRight changed)
   - performance improvement (using cache...)
   - wapping cause lots of Array creation and deletion -> need check.
   - renderChar function
   - support rich format
   - trim and push.appy x browser support

   ISSUE
   - scale down width to small cause carshed error : spliLine undefined
     * root cause : when width is too small (less than a character), function
       splitLineByWidth() return undefined
     * applied fix: TBD
   - ctx.textHAlign = left or start ???
   - ISSUE @18Sep2015 : rich text format cause wrong measurement, since each
     char may have each style. Measure need to accumulate every char ->
     may produce greate negative impact to performance
   - ISSUE @28Sep2015 : enable trimSpaceWhenWrap cause worng index of character
     in line 

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
