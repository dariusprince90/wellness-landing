(function() {            
  function getCookie(cookieName) {
  const name = cookieName + "=";
  const ca = document.cookie.split(";");
  for(var i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function setCookie(cookieName, cookieValue, daysUntilExpiration) {
  const date = new Date();
  date.setTime(date.getTime() + (daysUntilExpiration * 24 * 60 * 60 * 1000));
  const expires = "expires="+date.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + "SameSite=None;" + expires + ";path=/;secure";
}
  function updateCartAttributes(irclickid) {
  return fetch('/cart/update.js', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      attributes: {
        irclickid
      }
    })
  }).then((response) => console.log(response.status))
  .catch(err => console.error(err))
}
  function updateCart(line, item, irclickid) {
  return fetch('/cart/change.js?i=1', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      line: line,
      quantity: item.quantity,
      properties: Object.assign({}, item.properties, { _irclickid: irclickid, }),
    })
  })
  .then((response) => console.log(response.status))
  .catch(err => console.error(err))
}

function updateLineItemProperty(irclickid) {
  return getCart().then(data => {
    const items = data.items;
    if (items.length == 0) return;

    const index = getIndexOfItemWithClickId(items);
    if (index) {
      const item = items[index];
      const clickId = item.properties['_irclickid'];
      if (clickId == irclickid) return;

      return updateCart(index + 1, item, irclickid);
    } else {
      const item = items[0];
      return updateCart(1, item, irclickid);
    }
  })
}

function getCart() {
  return fetch('/cart.js?i=1').then(response => response.json());
}

function getIndexOfItemWithClickId(items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.properties == null) continue;

    const hasClickId = item.properties['_irclickid'];
    if (hasClickId) return i;
  }
  return null;
}
  (function(ns, fetch) {
  if (typeof fetch !== 'function') return;

  ns.fetch = function() {
    var response = fetch.apply(this, arguments);          
    response.then((res) => {
      var baseUrl = window.location.origin;
      if ([`${baseUrl}/cart/add.js`, `${baseUrl}/cart/update.js`, `${baseUrl}/cart/change.js`, `${baseUrl}/cart/clear.js`, `${baseUrl}/graphql.json`,].includes(res.url)) {
        if (getCookie('irclickid')) {
          updateLineItemProperty(getCookie('irclickid'));
        }
      }
    });
    return response;
  }

}(window, window.fetch));

  XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(value) {
    this.addEventListener("load", function(e) {
      if (["/cart/add.js", "/cart/update.js", "/cart/change.js", "/cart/clear.js", "/graphql.json",].includes(this._url)) {
        if (getCookie('irclickid')) {
          updateLineItemProperty(getCookie('irclickid'));
        }
      }
    }, false);
    this.realSend(value);
  };

  window.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.1',},], error => {
  if (error) {
    (function(a,b,c,d,e,f,g){e['ire_o']=c;e[c]=e[c]||function(){(e[c].a=e[c].a||[]).push(arguments)};f=d.createElement(b);g=d.getElementsByTagName(b)[0];f.async=1;f.src=a;g.parentNode.insertBefore(f,g);})('https://utt.impactcdn.com/A3428257-1157-43ec-9467-2f67830b16af1.js','script','ire',document,window);ire('identify');
ire('generateClickId', function(clickId) {
  setCookie('irclickid', clickId, 30);
  updateCartAttributes(clickId);
});

  }
  if (!window.Shopify.customerPrivacy || window.Shopify.customerPrivacy.userCanBeTracked()) {
    (function(a,b,c,d,e,f,g){e['ire_o']=c;e[c]=e[c]||function(){(e[c].a=e[c].a||[]).push(arguments)};f=d.createElement(b);g=d.getElementsByTagName(b)[0];f.async=1;f.src=a;g.parentNode.insertBefore(f,g);})('https://utt.impactcdn.com/A3428257-1157-43ec-9467-2f67830b16af1.js','script','ire',document,window);ire('identify');
ire('generateClickId', function(clickId) {
  setCookie('irclickid', clickId, 30);
  updateCartAttributes(clickId);
});

  }
});
})();
