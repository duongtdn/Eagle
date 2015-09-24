/*------------------------------------------------------------------------------

  ----------------------------------------------------------------------------*/
"use strict";

(function() {

  var FONTSIZE = 20,
      FONTWEIGHT = 'normal',    // bold, normal, 400, 600...
      FONTFAMILY = 'Times New Roman',
      FONTSTYLE = '',
      TEXTFILL = '#aaa',
      TEXTALIGN = 'left top',
      LEFT = 'left',
      TOP = 'top',
      LINEHEIGHT = 1.16,
      PADLEFT = 0,
      PADRIGHT = 0,
      PADTOP = 0,
      PADBOTTOM = 0,
      AUTO = 'auto';


  Eagle.Embed.Text = {

    // public property
    // changing in these items cause redraw

    text : '',

    fontSize : FONTSIZE,

    fontWeight : FONTWEIGHT,

    fontFamily : FONTFAMILY,

    fontStyle : FONTSTYLE,

    textFill : TEXTFILL,

    // textAlign : TEXTALIGN,  // deprecation, use textHAlign and textVAlign

    textHAlign : LEFT,

    textVAlign : TOP,

    lineHeight : LINEHEIGHT,

    padLeft : PADLEFT,

    padRight : PADRIGHT,

    padTop : PADTOP,

    padBottom : PADBOTTOM,

    wrap : AUTO,

    trimSpaceWhenWrap : true,

    // private property

    _reNewline : /\r?\n/,

    _fontSizeMult : 1.13,

    _fontSizeFraction: 0.25,

    // cached value
    _cache : {
      textHeight : 0
    },

    _alignValidate : {
      h : ['left', 'center', 'right'],
      v : ['top', 'middle', 'bottom']
    },

    // mixin methods

    initialize : function(options) {

      options || (options = {});
      // call super constructer
      this.callSuper('initialize',options);

      // private property
      this._textLines = this.text.split(this._reNewline);
      this._padWidth = this.padLeft + this.padRight;

      // deprecation, use textHAlign and textVAlign instead
      /*
      var textAlign = options.textAlign || TEXTALIGN,
          alignHV = this._getAlignment(textAlign);

      this.textHAlign = alignHV.h || 'left';
      this.textVAlign = alignHV.v || 'top';
      */
    },

    toObject : function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        text : this.get('text')
      });
    },

    _render : function(ctx) {
      this.callSuper('_render',ctx);
      // render text
      ctx.save();
      // scale factor should not affect to text
      // so, it need to rescale
      ctx.scale(1/this.scaleX, 1/this.scaleY);
      this._renderText(ctx, this.text);
      ctx.restore();
    },

    _renderText: function(ctx,text) {

      this._setTextStyles(ctx);

      var properWidth = this.getWidth() - this._padWidth;
      var wrapText = this._wrapText (ctx, this._textLines, properWidth);
      this._updateCache( 'textHeight', this._getHeightOfText(wrapText) );

      this._translateForTextAlign(ctx);

      this._renderTextFill(ctx, wrapText);

    },

    _translateForTextAlign: function(ctx) {
      var xOffset = 0,
          yOffset = 0;
      if (this.textHAlign !== 'left' && this.textHAlign !== 'justify') {
        xOffset = this.textHAlign === 'center' ?
            (this.getWidth() / 2) :
            this.getWidth();
      }
      var offsetHeight = this.getHeight() - this._cache.textHeight;
      if (this.textVAlign !== 'top') {
        yOffset = this.textVAlign === 'middle' ?
          offsetHeight / 2:
          offsetHeight;
      }

      ctx.translate (xOffset, yOffset);

    },

    _wrapLine: function(ctx, line, width) {
      if (this.trimSpaceWhenWrap) {
        line = line.trim();
      }
      var splittedLine = [];
      for ( var i = line.length; i > 0; ) {
        var ms = line.substr(0,i);
        if ( this._getLineWidth(ctx,ms) <  width ) {
          var rs = line.substr(i);
          splittedLine.push(ms);
          if (rs !== "") {
            var newWrap = this._wrapLine (ctx, rs, width);
            Array.prototype.push.apply(splittedLine, newWrap);
          } // end if
          return splittedLine;
        } // end if
        // next i depends on wrap option
        // 'auto' and 'word' cause it to sweep line by word
        // while 'char' cause it to sweep line by character
        // if width is smaller than a word, wrap by character automatically
        var n = ms.lastIndexOf(' ');
        i = (this.wrap === 'char' || n <= 0) ? i-1 : n;
      } // end for i
      return splittedLine;
    },

    _sweepStr: function(str,i) {

    },

    _wrapText: function (ctx, text, width) {
      if ( this.wrap !== 'none' ) {
        var wrapText = [];
        for (var i=0, len=text.length; i<len; i++) {
          var wrapLine =   this._wrapLine(ctx, text[i], width);
          // fix issue of multiple newline
          if ( wrapLine.length !== 0 ) {
            Array.prototype.push.apply(wrapText, wrapLine);
          } else {
            wrapText.push('');
          }
        } // end for i
        return wrapText;
      } else {
        return text;
      }
    },

    _renderTextFill: function(ctx, text) {
      // render each line
      var lineHeights = 0;  // point to first line
      for (var i=0, len=text.length; i<len; i++) {
          // calculate height of line
          var heightOfLine = this._getHeightOfLine(),
              maxHeight = heightOfLine / this.lineHeight;
          // call subroutine to render a line
          this._renderTextLine('fillText',
            ctx,
            text[i],
            this._getLeftOffset(),
            this._getTopOffset() + lineHeights + maxHeight,
            i
          );
          // point to next line
          lineHeights += heightOfLine;
      } // end for i
    },

    _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
      // lift the line by quarter of fontSize
      top -= this.fontSize * this._fontSizeFraction;
      ctx.fillStyle = this.textFill;

      ctx[method](line, left, top);

    },

    // supported subroutines
    _getLeftOffset: function() {
      return this.textHAlign === 'right' ?
              -this.getWidth() / 2 - this.padRight :
              this.textHAlign === 'center' ?
                  -this.getWidth() / 2 :
                  -this.getWidth() / 2 + this.padLeft;
    },

    _getTopOffset: function() {
    //  return -this.getHeight() / 2; // haft the current height (even scaled)
      return this.textVAlign === 'bottom' ?
              -this.getHeight() / 2 - this.padBottom :
              this.textVAlign === 'middle' ?
                  -this.getHeight() / 2 :
                  -this.getHeight() / 2 + this.padTop;
    },

    _getHeightOfLine: function() {
      // ISSUE @18Sep2015 : rich text may have different style in each line
      // therefore line height must be count on each line
      return this.fontSize * this._fontSizeMult * this.lineHeight;
    },

    _getLineWidth: function(ctx, line) {
      // low performance solution
      // line width should be cached somehow
      // ISSUE @18Sep2015 : rich text format cause wrong measurement, since each
      // char may have each style. Measure need to accumulate every char ->
      // may produce greate negative impact to performance
      return ctx.measureText(line).width;
    },

    _getCharWidth: function(ctx,c) {
      return ctx.measureText(c).width;
    },

    _getHeightOfText: function(text) {
      // ISSUE @18Sep2015 : rich text may have different style in each line
      // therefore text height must be accumlate of each line
      return this._getHeightOfLine() * text.length;
    },

    // set proper style for ctx to draw
    _setTextStyles: function(ctx) {
      ctx.textBaseline = 'alphabetic';
      if (!this.skipTextAlign) {
        ctx.textAlign = this.textHAlign;
      }
      ctx.font = this._getFontDeclaration();
    },

    // form a font declaration according to user defined fontSize, fontFamily,
    // fontStyle...
    _getFontDeclaration: function() {
      return [
        // node-canvas needs "weight style", while browsers need "style weight"
        (fabric.isLikelyNode ? this.fontWeight : this.fontStyle),
        (fabric.isLikelyNode ? this.fontStyle : this.fontWeight),
        this.fontSize + 'px',
        (fabric.isLikelyNode ? ('"' + this.fontFamily + '"') : this.fontFamily)
      ].join(' ');
    },

    _searchDict : function (dict, list) {
      var item;

      for (var i=0, len=list.length; i < len; i++) {
        if ( dict.indexOf(list[i]) !== -1 ) {
          // found matched
          item = list[i];
        }
      }
      return item;
    },

    // deprecation, use textHAlign and textVAlign instead
    /*
    _getAlignment : function (textAlign) {
      var alignHV = {},
          splitAlign = textAlign.split(/\s+/);  // split by one or more spaces;
      alignHV['h'] = this._searchDict(this._alignValidate.h, splitAlign);
      alignHV['v'] = this._searchDict(this._alignValidate.v, splitAlign);
      return alignHV;
    },
    */

    _updateCache: function (name, val) {
      this._cache[name] = val;
    },

    null: function() {}

  } // end Eagle.EmbedText

})();
