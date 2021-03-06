'use strict';

var toast = document.getElementById('toast');
var keys = Object.keys(localStorage).filter(k => k.startsWith('hostname:'));

document.getElementById('whitelist').value = keys.map(key => key.replace('hostname:', '')).join(', ');
chrome.storage.local.get({
  'faqs': true
}, prefs => document.getElementById('faqs').checked = prefs.faqs);

document.getElementById('save').addEventListener('click', () => {
  keys.forEach(key => localStorage.removeItem(key));
  const hostnames = document.getElementById('whitelist').value.split(/\s*,\s*/).filter(s => s);

  hostnames.forEach(hostname => {
    localStorage.setItem('hostname:' + hostname, true);
  });
  chrome.storage.local.set({
    'monitor': hostnames.length > 0,
    'faqs': document.getElementById('faqs').checked
  });
  document.getElementById('whitelist').value = hostnames.join(', ');
  toast.textContent = 'Options saved';
  window.setTimeout(() => toast.textContent = '', 2000);
});

// reset
document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    toast.textContent = 'Double-click to reset!';
    window.setTimeout(() => toast.textContent = '', 750);
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});
// support
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '?rd=donate'
}));
