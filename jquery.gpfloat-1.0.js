;(function($) {
    try {
        if (window.com.ginpen.gpFloat) { return; }
    } catch (e) {}

    if (!window.com) { window.com = {}; }
    if (!com.ginpen) { com.ginpen = {}; }
    var gpFloat = com.ginpen.gpFloat = {
        targets: [],

        init: function() {
            // bind
            $(window).scroll($.proxy(this.onscroll, this));
        },

        onscroll: function(event) {
            var targets = this.targets;
            for (var i = 0, l = targets.length; i < l; i++) {
                this.updatePosition(targets[i]);
            }
        },

        /**
         * Update target's position.
         * @param {Object} target The object containing elements and settings.
         */
        updatePosition: function(target) {
            var $els = target.$el;
            var settings = target.settings;
            var scrollTop = this._getScrollTop();
            var scrollLeft = this._getScrollLeft();

            for (var i = 0, l = $els.length; i < l; i++) {
                var $el = $els.eq(i);
                $el.css({
                    left: this._getLeft($el, scrollLeft, settings),
                    top: this._getTop($el, scrollTop, settings)
                });
            }
        },

        _getScrollTop: function() {
            return document.documentElement.scrollTop
                || document.body.scrollTop;
        },

        _getScrollLeft: function() {
            return document.documentElement.scrollLeft
                || document.body.scrollLeft;
        },

        /**
         * Calclate element X position.
         * @param {HtmlElement} $el
         * @param {Number} scrollLeft
         * @param {Object} settings
         */
        _getLeft: function($el, scrollLeft, settings) {
            var left = null;

            if (settings.direction.indexOf('x') >= 0) {
                if ($.isFunction(settings.getLeft)) {
                    left = settings.getLeft($el.data('gpFloat.originalX'), scrollLeft, $el);
                }
                else {
                    left = this._getLeftDefault($el, scrollLeft);
                }
            }

            return left;
        },

        /**
         * Default calclation for element X position.
         * @param {HtmlElement} $el
         * @param {Number} scrollLeft
         */
        _getLeftDefault: function($el, scrollLeft) {
            return $el.data('gpFloat.originalX') - scrollLeft;
        },

        /**
         * Calclate element Y position.
         * @param {HtmlElement} $el
         * @param {Number} scrollTop
         * @param {Object} settings
         */
        _getTop: function($el, scrollTop, settings) {
            var top = null;

            if (settings.direction.indexOf('y') >= 0) {
                if ($.isFunction(settings.getTop)) {
                    top = settings.getTop($el.data('gpFloat.originalY'), scrollTop, $el);
                }
                else {
                    top = this._getTopDefault($el, scrollTop);
                }
            }

            return top;
        },

        /**
         * Default calclation for element Y position.
         * @param {HtmlElement} $el
         * @param {Number} scrollTop
         */
        _getTopDefault: function($el, scrollTop) {
            return $el.data('gpFloat.originalY') - scrollTop;
        },

        /**
         * Add observe item(s).
         * @param {HtmlElement} $el HTML elements to be observed.
         * @param {Object} settings Settings for $el.
         */
        push: function($els, settings) {
            for (var i = 0, l = $els.length; i < l; i++) {
                this._initTarget($els.eq(i), settings);
            }

            this.targets.push({ $el: $els, settings: settings });
        },

        /**
         * @param {HtmlElement} $el
         * @param {Object} settings
         */
        _initTarget: function($el, settings) {
            var offset = $el.offset();
            var originalX = offset.left;
            var originalY = offset.top;

            // normalize settings
            settings = settings || {};
            if (settings.direction && $.isFunction(settings.direction.toLowerCase)) {
                settings.direction = settings.direction.toLowerCase();
            }
            else {
                settings.direction = '';
            }

            // remember original position
            $el.data('gpFloat.originalX', originalX);
            $el.data('gpFloat.originalY', originalY);

            // add fixed style
            $el.css({
                left: originalX,
                position: 'fixed',
                top: originalY
            });
        }
    };

    // init
    $(function() { gpFloat.init(); });

    // jQuery method interface
    $.fn.gpFloat = function(settings) {
        gpFloat.push(this, settings);
    };

    // Shortcut interface
    $.fn.gpFloatX = function(settings) {
        settings = settings || {};
        settings.direction = 'x';
        this.gpFloat(settings);
    };
    $.fn.gpFloatY = function(settings) {
        settings = settings || {};
        settings.direction = 'y';
        this.gpFloat(settings);
    };
}(jQuery));
