(function () {
  'use strict';

  var CURRENCIES = {
    CO: { code: 'COP', locale: 'es-CO', rate: 1000, compact: true },
  };

  function detectCountry() { return 'CO'; }

  function format(usdAbs, cfg) {
    var val  = Math.round(usdAbs * cfg.rate);
    var opts = { style: 'currency', currency: cfg.code, maximumFractionDigits: 0 };
    if (cfg.compact && val >= 1000000) {
      opts.notation = 'compact';
      opts.compactDisplay = 'short';
      opts.maximumSignificantDigits = 3;
    }
    return new Intl.NumberFormat(cfg.locale, opts).format(val);
  }

  function applyCurrency(cfg) {
    if (cfg.code === 'USD' && cfg.rate === 1) return;
    document.querySelectorAll('[data-usd]').forEach(function (el) {
      var raw = parseFloat(el.dataset.usd);
      if (isNaN(raw)) return;
      var sign = raw < 0 ? '−' : (el.dataset.sign === '+' ? '+' : '');
      el.textContent = sign + format(Math.abs(raw), cfg);
    });
  }

  var country = detectCountry();
  var cfg     = CURRENCIES[country] || CURRENCIES['CO'];
  window.MONEDITO_CURRENCY = { country: country, config: cfg };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyCurrency(cfg); });
  } else {
    applyCurrency(cfg);
  }
})();
