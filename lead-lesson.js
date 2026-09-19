'use strict';
document.querySelectorAll('[data-copy]').forEach(button=>{
 button.addEventListener('click',async()=>{
  const source=document.getElementById(button.dataset.copy),status=document.getElementById('copy-status');
  try{
   if(!navigator.clipboard)throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(source.textContent);
   status.textContent='Script copied. Replace the bracketed details before using it.';
  }catch{
   const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(source);selection.removeAllRanges();selection.addRange(range);
   status.textContent='The script is selected. Use Copy on your device to copy it.';
  }
 });
});
