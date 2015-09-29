/*------------------------------------------------------------------------------

  ----------------------------------------------------------------------------*/


(function() {

  "use strict";

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


    var stateProperties = fabric.Object.prototype.stateProperties.concat();
    stateProperties.push(
      'fontFamily',
      'fontWeight',
      'fontSize',
      'text',
      'textDecoration',
      'textAlign',
      'fontStyle',
      'lineHeight',
      'textBackgroundColor'
    );


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

    stateProperties : stateProperties,

    // private property

    _reNewline : /\r?\n/,

    _fontSizeMult : 1.13,

    _fontSizeFraction: 0.25,

    _wrappedText : '',

    _textHeight : 0,

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

      //this._setTextStyles(ctx);

      var properWidth = this.getWidth() - this.getPadWidth();

      // only wrap text if cache is dirty
      // i.e. catch this one for performance improve
      this._wrappedText = this._wrapText (
        ctx,
        this._textLines,
        properWidth
      );

// console.log ('TEXT -----------------');
// console.log (this._wrappedText);
// for (var i=0; i < this._wrappedText.length; i++) {
//   var line = this._wrappedText[i];
//   console.log (line.index + ' : ');
//   for (var j = 0; j < line.text.length; j++) {
//       console.log ('    ' + line.text[j].str + ' /' + line.text[j].style.textFill);
//   }
// }

      this._textHeight = this._getHeightOfText(this._wrappedText);

      this._translateForTextAlign(ctx);
      this._renderTextFill(ctx, this._wrappedText);

    },

    _translateForTextAlign: function(ctx) {
      var xOffset = 0,
          yOffset = 0;
      /* will manually align left/right/center when rendering each line
      if (this.textHAlign !== 'left' && this.textHAlign !== 'justify') {
        xOffset = this.textHAlign === 'center' ?
            (this.getWidth() / 2) :
            this.getWidth();
      }
      */
      var offsetHeight = this.getHeight() - this._textHeight;
      if (this.textVAlign !== 'top') {
        yOffset = this.textVAlign === 'middle' ?
          offsetHeight / 2:
          offsetHeight;
      }

      ctx.translate (xOffset, yOffset);

    },

    _breakLineByStyle: function(ctx, line, lineIndex, subIndex) {
      var txt = [],
          chars = line[0],
          prevStyle = this.getCharStyle(lineIndex, subIndex, 0);
      if (this.styles && this.styles !== null) {
        for (var i = 1, len = line.length; i <= len; i++) {
          var thisStyle = this.getCharStyle(lineIndex, subIndex, i);
          if ( this._hasStyleChanged (prevStyle,thisStyle) || i===len ) {
            // break line
            txt.push({
              str : chars,
              style: prevStyle,
              height : this._getHeightOfChars(ctx, chars, prevStyle),
              width: this._getWidthOfChars(ctx, chars, prevStyle)
            });
            chars = '';
            prevStyle = thisStyle;
          }
          chars += line[i];
        } // end for i
      } else {
        txt.push({
          str : line,
          style: prevStyle,
          height : this._getHeightOfChars(ctx, line, prevStyle),
          width: this._getWidthOfChars(ctx, line, prevStyle)
        });
      }
      return txt;
    },

    getCharStyle: function (lineIndex, subIndex, charIndex) {
      var absIndex = subIndex + charIndex,
          style = this.styles &&
                  this.styles[lineIndex] && this.styles[lineIndex][absIndex];

      return {
        fontSize: style && style.fontSize || this.fontSize,
        textFill: style && style.textFill || this.textFill,
        textBackgroundColor: style && style.textBackgroundColor || this.textBackgroundColor,
        textDecoration: style && style.textDecoration || this.textDecoration,
        fontFamily: style && style.fontFamily || this.fontFamily,
        fontWeight: style && style.fontWeight || this.fontWeight,
        fontStyle: style && style.fontStyle || this.fontStyle,
        textStroke: style && style.textStroke || this.textStroke,
        textStrokeWidth: style && style.textStrokeWidth || this.textStrokeWidth
      };

    },

    _hasStyleChanged: function(prevStyle, thisStyle) {
      return (prevStyle.textFill !== thisStyle.textFill ||
              prevStyle.fontSize !== thisStyle.fontSize ||
              prevStyle.textBackgroundColor !== thisStyle.textBackgroundColor ||
              prevStyle.textDecoration !== thisStyle.textDecoration ||
              prevStyle.fontFamily !== thisStyle.fontFamily ||
              prevStyle.fontWeight !== thisStyle.fontWeight ||
              prevStyle.fontStyle !== thisStyle.fontStyle ||
              prevStyle.textStroke !== thisStyle.textStroke ||
              prevStyle.textStrokeWidth !== thisStyle.textStrokeWidth
      );
    },

    _wrapLine: function(ctx, line, width, lineIndex, subIndex) {

      if (this.trimSpaceWhenWrap) {
        // count number of whitespace before string and adjust subindex before
        // trim left space
        subIndex += line.replace(/^(\s*).*$/,"$1").length;
        line = line.trim();
      }

      var wrappedLine = [];

      for ( var i = line.length; i > 0; ) {

        var wline = line.substr(0,i),
            ms = this._breakLineByStyle(
              ctx,
              wline,
              lineIndex,
              subIndex
            ),
            msWidth = this._getWidthOfLine(ctx,ms);
        if ( msWidth <  width ) {
          var msHeight = this._getHeightOfLine(ctx,ms),
              index = lineIndex + '.' + subIndex,
              rs = line.substr(i);
          wrappedLine.push ({
            height: msHeight,
            width : msWidth,
            index : index,
            text : ms
          });
          if (rs !== "") {
            subIndex += i;
            var newWrap = this._wrapLine (ctx, rs, width, lineIndex, subIndex);
            Array.prototype.push.apply(wrappedLine, newWrap);
          } // end if
          return wrappedLine;
        } // end if

        // next i depends on wrap option
        // 'auto' and 'word' cause it to sweep line by word
        // while 'char' cause it to sweep line by character
        // if width is smaller than a word, wrap by character automatically
        var n = wline.lastIndexOf(' ');
        i = (this.wrap === 'char' || n <= 0) ? i-1 : n;

      } // end for i

      return wrappedLine;
    },

    _wrapText: function (ctx, text, width) {
      var wrapText = [];
      if ( this.wrap !== 'none' ) {
        for (var i=0, len=text.length; i<len; i++) {
          var wrapLine =   this._wrapLine(ctx, text[i], width, i, 0);
          // fix issue of multiple newline
          if ( wrapLine.length !== 0 ) {
            Array.prototype.push.apply(wrapText, wrapLine);
          } else {
            var height = this._heighOfEmptyLine()
            wrapText.push({
              height: height,
              width : 0,
              index : i + '.0',
              text : {
                str : '',
                style : null,
                height : height,
                width : 0
              }
            });
          } // end if
        } // end for i
      } else {
        // no wrap
        for (var i=0, len=text.length; i<len; i++) {
          var text = this._breakLineByStyle(ctx, text[i], i, 0);
          wrapText.push({
            height : this._getHeightOfLine(ctx,text[i]),
            width : this._getWidthOfLine(ctx,text[i]),
            index : i + '.0',
            text : text
          });
        }
      }
      return wrapText;
    },

    _renderTextFill: function(ctx, text) {
      // render each line
      var lineHeights = 0;  // point to first line
      for (var i=0, len=text.length; i<len; i++) {
          // calculate height of line
          var heightOfLine = text[i].height,
              maxHeight = heightOfLine / this.lineHeight;
          // call subroutine to render a line
          this._renderTextLine('fillText',
            ctx,
            text[i],
            this._getLeftOffset(),
            this._getTopOffset() + lineHeights + maxHeight
          );
          // point to next line
          lineHeights += heightOfLine;
      } // end for i
    },

    _renderTextLine: function(method, ctx, line, left, top) {
      // lift the line by quarter of fontSize
      top -= this.fontSize * this._fontSizeFraction;
      var text = line.text;
      if ( (!this.styles || this.styles === null) &&
           (this.textHAlign != 'justify') ) {
        // align
        if (this.textHAlign !== 'left' && this.textHAlign !== 'justify') {
          left += this.textHAlign === 'center' ?
            (this.getWidth() / 2) :
            this.getWidth();
       }
        // not rich text format or align justify, draw a text line directly
        ctx[method](text[0].str, left, top);
      } else {
        // rich text format or align justify requires draw each line
        // calculate the position of char
        if (this.textHAlign !== 'left' && this.textHAlign !== 'justify') {
          left += this.textHAlign === 'center' ?
                      (this.getWidth() - line.width) / 2 :
                      (this.getWidth() - line.width);
        }
        this.skipTextAlign = true;
        for (var i = 0, len = text.length; i < len; i++) {
          var char = text[i],
              width = text[i].width;

          // render char (ctx will be translated automatically after renderring)
          this._renderTextChars (
            method,
            ctx,
            char,
            left,
            top
          );

          left += width;
        }   // end for i
      } // end if

    },

    _renderTextChars: function(method, ctx, char, left, top, index) {
      // apply style
      this._setTextStyles(ctx,char.style);
      // render
      ctx[method](char.str, left, top);
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

    _getHeightOfLine: function(ctx, line) {
      // ISSUE @18Sep2015 : rich text may have different style in each line
      // therefore line height must be count on each line
      return this.fontSize * this._fontSizeMult * this.lineHeight;
    },

    _heighOfEmptyLine: function() {
      // ISSUE @18Sep2015 : rich text may have different style in each line
      // therefore line height must be count on each line
      return this.fontSize * this._fontSizeMult * this.lineHeight;
    },

    _getHeightOfChars: function(ctx, chars, style) {
      return this.fontSize * this._fontSizeMult * this.lineHeight;
    },

    _getWidthOfChars: function(ctx, chars, style) {
      this._setTextStyles(ctx, style);
      return ctx.measureText(chars).width;
    },

    _getWidthOfLine: function(ctx, line) {
      // low performance solution
      // line width should be cached somehow
      // ISSUE @18Sep2015 : rich text format cause wrong measurement, since each
      // char may have each style. Measure need to accumulate every char ->
      // may produce greate negative impact to performance
      if ( Array.isArray(line) ) {
        var width = 0;
        for (var i = 0, len = line.length; i < len; i++) {
          width += line[i].width;
        }
      } else {
        width = ctx.measureText(line).width;
      }

      return width;

    },

    // return the height of full text (accumulated of all lines height)
    _getHeightOfText: function(text) {
      // ISSUE @18Sep2015 : rich text may have different style in each line
      // therefore text height must be accumlate of each line
      return this._getHeightOfLine() * text.length;
    },

    getPadWidth: function() {
      return this.padLeft + this.padRight;
    },

    // set proper style for ctx to draw
    _setTextStyles: function(ctx, style) {
      ctx.textBaseline = 'alphabetic';
      if (!this.skipTextAlign) {
        ctx.textAlign = this.textHAlign;
      }
      ctx.font = this._getFontDeclaration(style);
      ctx.fillStyle = style.textFill;
    },

    // form a font declaration according to user defined fontSize, fontFamily,
    // fontStyle...
    _getFontDeclaration: function(style) {
      return [
        // node-canvas needs "weight style", while browsers need "style weight"
        (fabric.isLikelyNode? style.fontWeight : style.fontStyle),
        (fabric.isLikelyNode? style.fontStyle : style.fontWeight),
        style.fontSize + 'px',
        (fabric.isLikelyNode? ('"' + style.fontFamily + '"') : style.fontFamily)
      ].join(' ');
    },

    // deprecation, function used for all text align processing method
    /*
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
    */
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

    null: function() {}

  } // end Eagle.EmbedText

})();
