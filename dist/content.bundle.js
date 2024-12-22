/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles/floating-button.css":
/*!****************************************!*\
  !*** ./src/styles/floating-button.css ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/modal.css":
/*!******************************!*\
  !*** ./src/styles/modal.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/panel.css":
/*!******************************!*\
  !*** ./src/styles/panel.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/styles/toast.css":
/*!******************************!*\
  !*** ./src/styles/toast.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/drag.js":
/*!*********************!*\
  !*** ./src/drag.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   enableDragging: () => (/* binding */ enableDragging)
/* harmony export */ });
function enableDragging(floatingBtn) {
  var isDragging = false;
  var startY, initialY;
  var animationFrameId = null;
  var onMove = function onMove(clientY) {
    if (isDragging) {
      var dy = clientY - startY;

      // Use requestAnimationFrame to update position
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(function () {
          var clampedY = Math.max(0, Math.min(window.innerHeight - floatingBtn.offsetHeight, initialY + dy));
          floatingBtn.style.top = "".concat(clampedY, "px");
          animationFrameId = null; // Reset for the next frame
        });
      }
    }
  };
  var onMouseMove = function onMouseMove(e) {
    onMove(e.clientY);
  };
  var onTouchMove = function onTouchMove(e) {
    onMove(e.touches[0].clientY);
  };
  var onStart = function onStart(clientY) {
    floatingBtn.classList.add('dragging');
    isDragging = true;
    startY = clientY;
    initialY = floatingBtn.getBoundingClientRect().top;
    document.body.style.userSelect = 'none'; // Prevent text selection
  };
  floatingBtn.addEventListener('mousedown', function (e) {
    onStart(e.clientY);
  });
  floatingBtn.addEventListener('touchstart', function (e) {
    onStart(e.touches[0].clientY);
  });
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('touchmove', onTouchMove);
  var onEnd = function onEnd() {
    if (isDragging) {
      isDragging = false;
      floatingBtn.classList.remove('dragging');
      document.body.style.userSelect = ''; // Re-enable text selection
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Clean up if dragging ends
        animationFrameId = null;
      }
    }
  };
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);
}

/***/ }),

/***/ "./src/events.js":
/*!***********************!*\
  !*** ./src/events.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindEvents: () => (/* binding */ bindEvents),
/* harmony export */   closeModal: () => (/* binding */ closeModal),
/* harmony export */   showToast: () => (/* binding */ showToast)
/* harmony export */ });
/* harmony import */ var _state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state.js */ "./src/state.js");

function bindEvents(floatingBtn, panel, modal, modalOverlay, toast) {
  floatingBtn.addEventListener('click', function () {
    panel.classList.toggle('active');
  });
  document.querySelector('.add-btn').addEventListener('click', function () {
    modal.classList.add('active');
    modalOverlay.classList.add('active');
    document.querySelector('.modal-textarea').focus();
  });
  document.querySelector('.cancel-btn').addEventListener('click', function () {
    closeModal(modal, modalOverlay);
  });
  modalOverlay.addEventListener('click', function () {
    closeModal(modal, modalOverlay);
  });
  document.addEventListener('click', function (event) {
    var isClickInside = panel.contains(event.target) || floatingBtn.contains(event.target) || modal.contains(event.target);
    if (!isClickInside) {
      panel.classList.remove('active');
    }
  });
  document.querySelector('.save-btn').addEventListener('click', function () {
    var text = document.querySelector('.modal-textarea').value.trim();
    if (text) {
      (0,_state_js__WEBPACK_IMPORTED_MODULE_0__.addClip)(text, function () {
        return (0,_state_js__WEBPACK_IMPORTED_MODULE_0__.renderClips)(toast);
      });
      closeModal(modal, modalOverlay);
      showToast(toast, 'Clip saved successfully!');
    }
  });
  document.querySelector('.modal-textarea').addEventListener('keydown', function (event) {
    var text = document.querySelector('.modal-textarea').value.trim();
    if (event.key === 'Enter' && !event.shiftKey && text) {
      event.preventDefault(); // Prevent newline in textarea
      closeModal(modal, modalOverlay);
      (0,_state_js__WEBPACK_IMPORTED_MODULE_0__.addClip)(text, function () {
        return (0,_state_js__WEBPACK_IMPORTED_MODULE_0__.renderClips)(toast);
      });
      showToast(toast, 'Clip saved successfully!');
    } else if (event.key === 'Escape') {
      closeModal(modal, modalOverlay);
    }
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && panel.classList.contains('active')) {
      panel.classList.remove('active');
    }
  });
}
function closeModal(modal, modalOverlay) {
  modal.classList.remove('active');
  modalOverlay.classList.remove('active');
  document.querySelector('.modal-textarea').value = '';
}
function showToast(toast, message) {
  toast.textContent = message;
  toast.classList.add('active');
  setTimeout(function () {
    toast.classList.remove('active');
  }, 3000);
}

/***/ }),

/***/ "./src/state.js":
/*!**********************!*\
  !*** ./src/state.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addClip: () => (/* binding */ addClip),
/* harmony export */   clips: () => (/* binding */ clips),
/* harmony export */   loadClips: () => (/* binding */ loadClips),
/* harmony export */   renderClips: () => (/* binding */ renderClips)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/events.js");

var clips = [];
function loadClips(callback) {
  chrome.storage.local.get(['clips'], function (result) {
    if (result.clips) {
      clips = result.clips;
      callback();
    }
  });
}
function addClip(text, callback) {
  clips.unshift({
    id: Date.now(),
    text: text
  });
  chrome.storage.local.set({
    clips: clips
  }, callback);
}
function renderClips(toast) {
  var container = document.querySelector('.clips-container');
  container.innerHTML = clips.map(function (clip) {
    return "\n        <div class=\"clip-item\" data-id=\"".concat(clip.id, "\">\n            <div class=\"clip-text\">").concat(clip.text, "</div>\n            <button class=\"delete-btn\" data-id=\"").concat(clip.id, "\">x</button>\n        </div>\n    ");
  }).join('');
  document.querySelectorAll('.clip-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (!e.target.classList.contains('delete-btn')) {
        item.classList.add('active');
        var text = item.querySelector('.clip-text').textContent;
        navigator.clipboard.writeText(text).then(function () {
          (0,_events__WEBPACK_IMPORTED_MODULE_0__.showToast)(toast, 'Copied to clipboard!');
        });
      }
    });
  });
  document.querySelectorAll('.delete-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var id = parseInt(btn.dataset.id);
      clips = clips.filter(function (clip) {
        return clip.id !== id;
      });
      chrome.storage.local.set({
        clips: clips
      }, function () {
        return renderClips(toast);
      });
    });
  });
}

/***/ }),

/***/ "./src/ui.js":
/*!*******************!*\
  !*** ./src/ui.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFloatingButton: () => (/* binding */ createFloatingButton),
/* harmony export */   createModal: () => (/* binding */ createModal),
/* harmony export */   createModalOverlay: () => (/* binding */ createModalOverlay),
/* harmony export */   createPanel: () => (/* binding */ createPanel),
/* harmony export */   createToast: () => (/* binding */ createToast)
/* harmony export */ });
function createFloatingButton() {
  var floatingBtn = document.createElement('div');
  floatingBtn.className = 'clipboard-floating-btn';
  floatingBtn.innerHTML = "\n     <svg  xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"28\" viewBox=\"0 0 512 512\" fill=\"none\">\n<path d=\"M0 0 C8.34947239 6.30552155 15.30619365 13.54358094 18.6875 23.6875 C19.533125 23.78546875 20.37875 23.8834375 21.25 23.984375 C32.24317754 25.43347568 40.21244334 28.2999339 47.5625 36.875 C48.6875 38.6875 48.6875 38.6875 48.6875 40.6875 C49.23714417 40.67861755 49.78678833 40.66973511 50.35308838 40.6605835 C56.1291655 40.57135409 61.90504352 40.51145611 67.68164062 40.46777344 C69.83081021 40.44779016 71.97992636 40.42059406 74.12890625 40.38574219 C93.00305662 40.08754464 106.06341026 41.66386423 120.4375 55 C130.6232714 65.7623245 133.14589997 77.71444774 133.07518005 92.10958862 C133.0793601 93.44610672 133.08484129 94.78262126 133.09149987 96.1191293 C133.10588536 99.76755002 133.10173154 103.41574352 133.09433305 107.06417632 C133.08958648 111.0083918 133.10212437 114.95255917 133.11235046 118.89675903 C133.12951483 126.61445284 133.13038337 134.33206515 133.12513756 142.04977308 C133.12109014 148.3251839 133.1225462 154.6005707 133.12788582 160.87598038 C133.12863424 161.77037784 133.12938266 162.66477531 133.13015376 163.58627573 C133.1316853 165.40345962 133.13322365 167.22064351 133.13476873 169.03782739 C133.14848528 186.06523868 133.14306208 203.09260397 133.13158352 220.12001421 C133.1216525 235.68271313 133.13459104 251.24529314 133.15851771 266.80797373 C133.18292575 282.80481617 133.19251236 298.80160326 133.18586498 314.79846394 C133.18237649 323.77264879 133.18458035 332.74674221 133.20211601 341.72091293 C133.21685933 349.36053749 133.21744568 357.00000623 133.2000451 364.6396278 C133.19155012 368.53384391 133.18934845 372.42778194 133.20469666 376.32198334 C133.21859908 379.89370991 133.21371035 383.46492163 133.19445742 387.03661884 C133.188954 388.92610594 133.20292255 390.81561962 133.21781152 392.70505607 C133.09432799 407.12839414 128.11259508 417.94202606 118.375 428.4375 C108.70852723 437.58612601 97.39066463 441.16142309 84.30252075 441.07518005 C83.30605652 441.08056559 82.30959228 441.08595113 81.28293216 441.09149987 C77.9699057 441.10571826 74.65728225 441.09869076 71.34423828 441.09155273 C68.95831991 441.0972595 66.57240428 441.10422495 64.18649292 441.11235046 C58.39386328 441.12840568 52.60135835 441.13038928 46.80871119 441.12513756 C42.09698969 441.12108477 37.38530015 441.12255254 32.67358017 441.12788582 C32.0012116 441.12863424 31.32884303 441.12938266 30.63609966 441.13015376 C29.26987577 441.13168535 27.90365188 441.1332237 26.53742801 441.13476873 C13.74482138 441.14847514 0.95227602 441.14306929 -11.84032919 441.13158352 C-23.52312745 441.12165407 -35.20576726 441.13459008 -46.88854109 441.15851771 C-58.90774396 441.18294739 -70.92687316 441.19250704 -82.94610035 441.18586498 C-89.6846427 441.18238121 -96.42306329 441.18454886 -103.16158676 441.20211601 C-109.49989219 441.21761504 -115.83789579 441.21359636 -122.17618942 441.19481087 C-124.49646447 441.19113318 -126.81676203 441.19420939 -129.1370163 441.20469666 C-147.79442967 441.28255902 -160.85060142 439.56065645 -175.0625 426.375 C-185.2482714 415.6126755 -187.77089997 403.66055226 -187.70018005 389.26541138 C-187.7043601 387.92889328 -187.70984129 386.59237874 -187.71649987 385.2558707 C-187.73088536 381.60744998 -187.72673154 377.95925648 -187.71933305 374.31082368 C-187.71458648 370.3666082 -187.72712437 366.42244083 -187.73735046 362.47824097 C-187.75451483 354.76054716 -187.75538337 347.04293485 -187.75013756 339.32522692 C-187.74609014 333.0498161 -187.7475462 326.7744293 -187.75288582 320.49901962 C-187.75363424 319.60462216 -187.75438266 318.71022469 -187.75515376 317.78872427 C-187.7566853 315.97154038 -187.75822365 314.15435649 -187.75976873 312.33717261 C-187.77348528 295.30976132 -187.76806208 278.28239603 -187.75658352 261.25498579 C-187.7466525 245.69228687 -187.75959104 230.12970686 -187.78351771 214.56702627 C-187.80792575 198.57018383 -187.81751236 182.57339674 -187.81086498 166.57653606 C-187.80737649 157.60235121 -187.80958035 148.62825779 -187.82711601 139.65408707 C-187.84185933 132.01446251 -187.84244568 124.37499377 -187.8250451 116.7353722 C-187.81655012 112.84115609 -187.81434845 108.94721806 -187.82969666 105.05301666 C-187.84359908 101.48129009 -187.83871035 97.91007837 -187.81945742 94.33838116 C-187.813954 92.44889406 -187.82792255 90.55938038 -187.84281152 88.66994393 C-187.71932799 74.24660586 -182.73759508 63.43297394 -173 52.9375 C-163.08619073 43.55478765 -151.66376595 40.17733237 -138.2734375 40.39453125 C-136.76313461 40.40089851 -136.76313461 40.40089851 -135.22232056 40.40739441 C-132.04376121 40.4240284 -128.86586386 40.46165125 -125.6875 40.5 C-123.51693632 40.51506661 -121.34636258 40.52875153 -119.17578125 40.54101562 C-113.88779948 40.57388153 -108.60019706 40.62392539 -103.3125 40.6875 C-103.01601562 40.07777344 -102.71953125 39.46804687 -102.4140625 38.83984375 C-98.89083206 31.95580129 -93.34530247 28.44089238 -86.4375 25.4375 C-83.3125 24.6875 -83.3125 24.6875 -80.89453125 24.703125 C-78.12800214 24.68677919 -75.94101693 24.57107242 -73.3125 23.6875 C-71.62167291 21.41315378 -70.70363635 19.13652253 -69.6328125 16.515625 C-64.82059235 6.2077925 -54.27713505 -1.57633578 -43.9375 -5.75 C-29.23024352 -10.139375 -12.78284537 -8.48368213 0 0 Z \" fill=\"#F9F9F9\" transform=\"translate(283.3125,39.3125)\"/>\n<path d=\"M0 0 C8.34947239 6.30552155 15.30619365 13.54358094 18.6875 23.6875 C19.533125 23.78546875 20.37875 23.8834375 21.25 23.984375 C32.24317754 25.43347568 40.21244334 28.2999339 47.5625 36.875 C48.6875 38.6875 48.6875 38.6875 48.6875 40.6875 C49.23714417 40.67861755 49.78678833 40.66973511 50.35308838 40.6605835 C56.1291655 40.57135409 61.90504352 40.51145611 67.68164062 40.46777344 C69.83081021 40.44779016 71.97992636 40.42059406 74.12890625 40.38574219 C93.00305662 40.08754464 106.06341026 41.66386423 120.4375 55 C130.6232714 65.7623245 133.14589997 77.71444774 133.07518005 92.10958862 C133.0793601 93.44610672 133.08484129 94.78262126 133.09149987 96.1191293 C133.10588536 99.76755002 133.10173154 103.41574352 133.09433305 107.06417632 C133.08958648 111.0083918 133.10212437 114.95255917 133.11235046 118.89675903 C133.12951483 126.61445284 133.13038337 134.33206515 133.12513756 142.04977308 C133.12109014 148.3251839 133.1225462 154.6005707 133.12788582 160.87598038 C133.12863424 161.77037784 133.12938266 162.66477531 133.13015376 163.58627573 C133.1316853 165.40345962 133.13322365 167.22064351 133.13476873 169.03782739 C133.14848528 186.06523868 133.14306208 203.09260397 133.13158352 220.12001421 C133.1216525 235.68271313 133.13459104 251.24529314 133.15851771 266.80797373 C133.18292575 282.80481617 133.19251236 298.80160326 133.18586498 314.79846394 C133.18237649 323.77264879 133.18458035 332.74674221 133.20211601 341.72091293 C133.21685933 349.36053749 133.21744568 357.00000623 133.2000451 364.6396278 C133.19155012 368.53384391 133.18934845 372.42778194 133.20469666 376.32198334 C133.21859908 379.89370991 133.21371035 383.46492163 133.19445742 387.03661884 C133.188954 388.92610594 133.20292255 390.81561962 133.21781152 392.70505607 C133.09432799 407.12839414 128.11259508 417.94202606 118.375 428.4375 C108.70852723 437.58612601 97.39066463 441.16142309 84.30252075 441.07518005 C83.30605652 441.08056559 82.30959228 441.08595113 81.28293216 441.09149987 C77.9699057 441.10571826 74.65728225 441.09869076 71.34423828 441.09155273 C68.95831991 441.0972595 66.57240428 441.10422495 64.18649292 441.11235046 C58.39386328 441.12840568 52.60135835 441.13038928 46.80871119 441.12513756 C42.09698969 441.12108477 37.38530015 441.12255254 32.67358017 441.12788582 C32.0012116 441.12863424 31.32884303 441.12938266 30.63609966 441.13015376 C29.26987577 441.13168535 27.90365188 441.1332237 26.53742801 441.13476873 C13.74482138 441.14847514 0.95227602 441.14306929 -11.84032919 441.13158352 C-23.52312745 441.12165407 -35.20576726 441.13459008 -46.88854109 441.15851771 C-58.90774396 441.18294739 -70.92687316 441.19250704 -82.94610035 441.18586498 C-89.6846427 441.18238121 -96.42306329 441.18454886 -103.16158676 441.20211601 C-109.49989219 441.21761504 -115.83789579 441.21359636 -122.17618942 441.19481087 C-124.49646447 441.19113318 -126.81676203 441.19420939 -129.1370163 441.20469666 C-147.79442967 441.28255902 -160.85060142 439.56065645 -175.0625 426.375 C-185.2482714 415.6126755 -187.77089997 403.66055226 -187.70018005 389.26541138 C-187.7043601 387.92889328 -187.70984129 386.59237874 -187.71649987 385.2558707 C-187.73088536 381.60744998 -187.72673154 377.95925648 -187.71933305 374.31082368 C-187.71458648 370.3666082 -187.72712437 366.42244083 -187.73735046 362.47824097 C-187.75451483 354.76054716 -187.75538337 347.04293485 -187.75013756 339.32522692 C-187.74609014 333.0498161 -187.7475462 326.7744293 -187.75288582 320.49901962 C-187.75363424 319.60462216 -187.75438266 318.71022469 -187.75515376 317.78872427 C-187.7566853 315.97154038 -187.75822365 314.15435649 -187.75976873 312.33717261 C-187.77348528 295.30976132 -187.76806208 278.28239603 -187.75658352 261.25498579 C-187.7466525 245.69228687 -187.75959104 230.12970686 -187.78351771 214.56702627 C-187.80792575 198.57018383 -187.81751236 182.57339674 -187.81086498 166.57653606 C-187.80737649 157.60235121 -187.80958035 148.62825779 -187.82711601 139.65408707 C-187.84185933 132.01446251 -187.84244568 124.37499377 -187.8250451 116.7353722 C-187.81655012 112.84115609 -187.81434845 108.94721806 -187.82969666 105.05301666 C-187.84359908 101.48129009 -187.83871035 97.91007837 -187.81945742 94.33838116 C-187.813954 92.44889406 -187.82792255 90.55938038 -187.84281152 88.66994393 C-187.71932799 74.24660586 -182.73759508 63.43297394 -173 52.9375 C-163.08619073 43.55478765 -151.66376595 40.17733237 -138.2734375 40.39453125 C-136.76313461 40.40089851 -136.76313461 40.40089851 -135.22232056 40.40739441 C-132.04376121 40.4240284 -128.86586386 40.46165125 -125.6875 40.5 C-123.51693632 40.51506661 -121.34636258 40.52875153 -119.17578125 40.54101562 C-113.88779948 40.57388153 -108.60019706 40.62392539 -103.3125 40.6875 C-103.01601562 40.07777344 -102.71953125 39.46804687 -102.4140625 38.83984375 C-98.89083206 31.95580129 -93.34530247 28.44089238 -86.4375 25.4375 C-83.3125 24.6875 -83.3125 24.6875 -80.89453125 24.703125 C-78.12800214 24.68677919 -75.94101693 24.57107242 -73.3125 23.6875 C-71.62167291 21.41315378 -70.70363635 19.13652253 -69.6328125 16.515625 C-64.82059235 6.2077925 -54.27713505 -1.57633578 -43.9375 -5.75 C-29.23024352 -10.139375 -12.78284537 -8.48368213 0 0 Z M-149.07421875 84.86328125 C-154.64159986 92.88408454 -155.60807118 99.54185298 -155.58665466 109.14797974 C-155.59189134 110.30845192 -155.59712802 111.4689241 -155.60252339 112.66456211 C-155.61491567 115.87732598 -155.61836731 119.08995406 -155.61792648 122.30273724 C-155.61957766 125.77121661 -155.63264991 129.2396564 -155.64411926 132.70811462 C-155.66694635 140.28890125 -155.67488759 147.86965984 -155.67994571 155.45047617 C-155.68320578 160.18744605 -155.68973019 164.92440784 -155.6969471 169.66137314 C-155.71651104 182.78647919 -155.73291612 195.91157772 -155.73582363 209.0366993 C-155.7360112 209.87623903 -155.73619877 210.71577877 -155.73639202 211.5807591 C-155.73675827 213.2825892 -155.73712197 214.98441929 -155.73748314 216.68624939 C-155.73766595 217.53099803 -155.73784876 218.37574667 -155.73803711 219.24609375 C-155.73821766 220.09187823 -155.73839821 220.9376627 -155.73858423 221.80907701 C-155.74212406 235.50646225 -155.76913539 249.2036901 -155.806535 262.90102078 C-155.84465887 276.97671155 -155.86398141 291.05232432 -155.86428314 305.12806785 C-155.86486684 313.02588825 -155.87330196 320.92352093 -155.90228081 328.82129288 C-155.92684952 335.54792076 -155.93404085 342.27429248 -155.91903328 349.00095315 C-155.91188628 352.42942009 -155.91262471 355.85738179 -155.93544388 359.2857914 C-155.95592744 363.01267096 -155.94533661 366.73825437 -155.92723083 370.46511841 C-155.9404308 371.53499186 -155.95363077 372.60486531 -155.96723074 373.70715916 C-155.85888485 383.51622147 -152.84614583 392.99024475 -145.98046875 400.2265625 C-138.75824208 406.55235354 -131.46672125 408.9916174 -121.88912964 408.96165466 C-121.05534165 408.96689134 -120.22155365 408.97212802 -119.36249936 408.97752339 C-116.57608998 408.99249274 -113.78986475 408.99322787 -111.00341797 408.99389648 C-109.00232128 409.00152017 -107.00122752 409.00994803 -105.00013733 409.01911926 C-99.56803629 409.04105388 -94.13599155 409.0498621 -88.70385122 409.05494571 C-85.30695652 409.05859131 -81.91007651 409.06483253 -78.51318741 409.0719471 C-66.65331628 409.09644059 -54.79348887 409.10949272 -42.93359375 409.11303711 C-31.89435057 409.11666952 -20.8553859 409.14654418 -9.81622779 409.18844169 C-0.3272408 409.22318771 9.16165411 409.23858632 18.65070426 409.23928314 C24.31290827 409.24007465 29.97482867 409.24875528 35.63696671 409.27728081 C40.96736249 409.30353426 46.29724104 409.30562589 51.6276722 409.28962517 C53.57706776 409.28781632 55.52649356 409.29445007 57.47582436 409.31044388 C70.16688374 409.40816837 82.31823753 408.8438928 92.15625 399.6328125 C96.95310288 393.53885144 100.80547904 385.69990215 100.82172108 377.8925457 C100.82840784 376.40275981 100.82840784 376.40275981 100.83522969 374.88287723 C100.83504533 373.78883457 100.83486097 372.69479191 100.83467102 371.56759644 C100.84018605 369.82755803 100.84018605 369.82755803 100.8458125 368.05236733 C100.8549406 364.82706598 100.85954932 361.60179454 100.86220181 358.37648249 C100.86610487 354.89983994 100.87568328 351.42321212 100.88441467 347.94657898 C100.90418006 339.54727181 100.91424584 331.14796343 100.92314246 322.74863881 C100.92752565 318.79290608 100.93289242 314.83717469 100.93813133 310.88144302 C100.95514445 297.73071763 100.96963815 284.57999306 100.97688007 271.42925835 C100.97878996 268.01631545 100.98071029 264.60337256 100.98266602 261.19042969 C100.98314976 260.34216178 100.9836335 259.49389386 100.9841319 258.61992086 C100.99243044 244.88154798 101.01776401 231.14326221 101.05024669 217.40492736 C101.08332681 203.29884237 101.10132973 189.19280165 101.10452431 175.08667767 C101.10668864 167.16713442 101.11542578 159.24771817 101.14098549 151.32821274 C101.16270561 144.58279364 101.17073654 137.8375324 101.16101871 131.09208231 C101.15647761 127.65192039 101.15834855 124.21208407 101.17778015 120.77196693 C101.19545131 117.03747168 101.18841506 113.30380105 101.17524719 109.56930542 C101.18621644 108.48864709 101.19718568 107.40798876 101.20848733 106.2945832 C101.12408161 96.37118457 97.73622102 87.81120741 90.6875 80.6875 C81.77171468 74.13860883 74.20339264 72.37981406 63.3125 72.5625 C62.29027344 72.57152344 61.26804687 72.58054687 60.21484375 72.58984375 C57.70548478 72.6132957 55.19661664 72.64611645 52.6875 72.6875 C52.54054688 73.43773438 52.39359375 74.18796875 52.2421875 74.9609375 C50.19490616 84.30312938 47.40298378 92.44771225 39.3125 98.125 C31.63248378 102.9429877 24.7975828 104.13250265 15.91625977 104.09155273 C14.34148361 104.10184761 14.34148361 104.10184761 12.7348938 104.11235046 C9.28275831 104.13057261 5.83107927 104.12678742 2.37890625 104.12109375 C-0.03190762 104.12565764 -2.44272019 104.13096384 -4.85353088 104.13697815 C-9.89955947 104.14590021 -14.94542972 104.14349619 -19.99145508 104.13354492 C-26.44527946 104.1220551 -32.8985567 104.14227226 -39.35230923 104.17146206 C-44.32899932 104.18984202 -49.30555872 104.18952798 -54.28227425 104.18382454 C-56.66122264 104.18367155 -59.04018001 104.18969694 -61.41909599 104.20211601 C-64.75036446 104.21705798 -68.08062739 104.2063244 -71.41186523 104.18920898 C-72.38616989 104.19887695 -73.36047455 104.20854492 -74.36430359 104.21850586 C-83.17692738 104.12409525 -90.53103287 101.10514873 -97.45703125 95.64453125 C-103.45919061 89.31383264 -105.67144126 81.01233332 -107.3125 72.6875 C-110.95805558 72.56994519 -114.60311474 72.49980188 -118.25 72.4375 C-119.27158203 72.40398437 -120.29316406 72.37046875 -121.34570312 72.3359375 C-132.31327306 72.19577686 -142.04273168 76.17916086 -149.07421875 84.86328125 Z \" fill=\"#FEB300\" transform=\"translate(283.3125,39.3125)\"/>\n<path d=\"M0 0 C1.03398926 0.29003906 1.03398926 0.29003906 2.08886719 0.5859375 C32.37484479 9.23526032 56.97999969 28.21859944 72.41015625 55.84765625 C84.75838391 80.33173419 89.59957203 109.28635285 82 136 C81.70996094 137.03833984 81.70996094 137.03833984 81.4140625 138.09765625 C76.88265141 153.95759505 70.06303717 168.62912317 59 181 C58.31421875 181.81597656 57.6284375 182.63195312 56.921875 183.47265625 C39.33880867 203.9335266 12.11001553 218.75020618 -15 221 C-19.02115126 221.16353266 -23.03827117 221.2242135 -27.0625 221.25 C-28.57034058 221.26401855 -28.57034058 221.26401855 -30.10864258 221.27832031 C-46.87446728 221.20711041 -63.12872308 216.59707633 -78 209 C-78.95777344 208.525625 -79.91554687 208.05125 -80.90234375 207.5625 C-87.60852734 204.10124395 -93.28984109 199.91381346 -99 195 C-99.82371094 194.31035156 -100.64742187 193.62070312 -101.49609375 192.91015625 C-121.88312436 175.32196916 -136.86071034 148.14788715 -139 121 C-139.50348498 109.26060364 -139.58466839 97.51352281 -137 86 C-136.731875 84.80375 -136.46375 83.6075 -136.1875 82.375 C-128.75942622 52.16749998 -109.65378508 27.59287758 -83.3125 11.3125 C-58.25787747 -2.64697431 -27.88678357 -8.09023172 0 0 Z \" fill=\"#067AFE\" transform=\"translate(283,179)\"/>\n<path d=\"M0 0 C8.34947239 6.30552155 15.30619365 13.54358094 18.6875 23.6875 C19.533125 23.78546875 20.37875 23.8834375 21.25 23.984375 C31.26118687 25.30403145 38.34948374 27.51625684 45.6875 34.6875 C47.25259852 37.05750634 48.49481996 39.15292918 49.6875 41.6875 C50.20957031 42.78964844 50.73164063 43.89179687 51.26953125 45.02734375 C53.51474174 51.14059641 53.20063953 57.50570097 53.1875 63.9375 C53.21585938 65.18402344 53.24421875 66.43054688 53.2734375 67.71484375 C53.29522715 78.14119184 50.97370082 88.31572007 43.6328125 96.15625 C37.69859969 100.82735728 29.87627056 104.79337877 22.24923706 104.83467102 C21.34097672 104.84182632 20.43271637 104.84898163 19.49693298 104.85635376 C18.00547508 104.86038712 18.00547508 104.86038712 16.48388672 104.86450195 C15.43476608 104.87107315 14.38564545 104.87764435 13.30473328 104.88441467 C9.82555064 104.90415778 6.34641123 104.91581377 2.8671875 104.92578125 C1.67862278 104.92985678 0.49005806 104.9339323 -0.73452377 104.93813133 C-7.02776669 104.95899831 -13.32098777 104.97329625 -19.61425781 104.98266602 C-26.10740967 104.99372 -32.60021785 105.02810692 -39.09324837 105.06783772 C-44.09136583 105.09401598 -49.08940165 105.10235906 -54.08758163 105.10594749 C-56.48050121 105.1108118 -58.87341718 105.12242123 -61.26626968 105.14098549 C-64.62196088 105.16539728 -67.97676626 105.16440747 -71.33251953 105.1574707 C-72.31467941 105.17028076 -73.29683929 105.18309082 -74.3087616 105.19628906 C-83.9346448 105.1240432 -92.42826883 101.49926558 -99.3125 94.6875 C-106.46033947 84.95629505 -107.69626704 76.4076317 -107.75 64.5625 C-107.78287109 63.30695313 -107.81574219 62.05140625 -107.84960938 60.7578125 C-107.90565628 50.93431778 -105.99273411 42.2457746 -100 34.25 C-94.85436663 29.34369842 -88.27370985 24.65544049 -80.89453125 24.703125 C-78.12800214 24.68677919 -75.94101693 24.57107242 -73.3125 23.6875 C-71.62167291 21.41315378 -70.70363635 19.13652253 -69.6328125 16.515625 C-64.82059235 6.2077925 -54.27713505 -1.57633578 -43.9375 -5.75 C-29.23024352 -10.139375 -12.78284537 -8.48368213 0 0 Z \" fill=\"#424242\" transform=\"translate(283.3125,39.3125)\"/>\n<path d=\"M0 0 C4.35699098 2.46622131 7.04335342 5.33670683 9.3125 9.875 C9.515625 11.828125 9.515625 11.828125 9.5625 14.125 C9.58828125 14.87265625 9.6140625 15.6203125 9.640625 16.390625 C8.70004726 23.51214221 3.26830989 29.08329353 -1 34.5625 C-2.45570426 36.45083904 -3.91010714 38.34018194 -5.36328125 40.23046875 C-6.45697021 41.65238525 -6.45697021 41.65238525 -7.57275391 43.10302734 C-10.66411764 47.15513353 -13.67962361 51.2607482 -16.6875 55.375 C-21.80862718 62.36360589 -27.00249533 69.29324867 -32.25 76.1875 C-32.91708984 77.06535156 -33.58417969 77.94320312 -34.27148438 78.84765625 C-45.79793737 93.95047563 -45.79793737 93.95047563 -53.703125 95.19140625 C-58.84251947 95.4954544 -61.82269866 93.95590724 -65.6875 90.875 C-68.41675119 88.42419714 -71.01377749 85.85286219 -73.60546875 83.2578125 C-74.34452957 82.5230368 -75.08359039 81.78826111 -75.845047 81.03121948 C-77.3998083 79.48218045 -78.95198361 77.93054202 -80.50170898 76.37646484 C-82.86901684 74.00599116 -85.24935379 71.64916792 -87.63085938 69.29296875 C-89.14403958 67.7820612 -90.65643629 66.27036848 -92.16796875 64.7578125 C-92.87737106 64.05761993 -93.58677338 63.35742737 -94.31767273 62.63601685 C-99.06197658 57.84701371 -102.29807492 53.89304438 -103.1875 47 C-102.97106975 42.0879744 -100.88355815 38.52302597 -97.6875 34.875 C-93.90228825 31.60428305 -89.76154989 30.13287756 -84.70336914 30.43457031 C-76.87768315 32.14433627 -71.00921847 39.18593143 -65.6875 44.6875 C-64.52541016 45.86989258 -64.52541016 45.86989258 -63.33984375 47.07617188 C-61.44864073 49.00239717 -59.56485951 50.9352963 -57.6875 52.875 C-54.32822231 51.75524077 -53.87835244 51.13897398 -51.89453125 48.359375 C-51.35449463 47.61284668 -50.81445801 46.86631836 -50.25805664 46.09716797 C-49.67789795 45.28135254 -49.09773926 44.46553711 -48.5 43.625 C-47.24640316 41.89206228 -45.99112938 40.16033669 -44.734375 38.4296875 C-43.74727539 37.0679541 -43.74727539 37.0679541 -42.74023438 35.67871094 C-39.30606179 30.9881736 -35.78018867 26.36847349 -32.25 21.75 C-31.60071533 20.89889648 -30.95143066 20.04779297 -30.2824707 19.17089844 C-28.4216872 16.73567529 -26.55489029 14.30515866 -24.6875 11.875 C-23.73484253 10.62456909 -23.73484253 10.62456909 -22.76293945 9.34887695 C-22.14765381 8.54667725 -21.53236816 7.74447754 -20.8984375 6.91796875 C-20.35106934 6.2014917 -19.80370117 5.48501465 -19.23974609 4.74682617 C-13.71694928 -1.91301704 -7.79493623 -2.37811614 0 0 Z \" fill=\"#F7F8FA\" transform=\"translate(302.6875,241.125)\"/>\n</svg>\n\n\n    ";
  return floatingBtn;
}
function createPanel() {
  var panel = document.createElement('div');
  panel.className = 'clipboard-panel';
  panel.innerHTML = "\n        <div class=\"panel-header\">\n            <div class=\"panel-title\">Quick Access Clips</div>\n            <button class=\"add-btn\">+ New</button>\n        </div>\n        <div class=\"clips-container\"></div>\n    ";
  return panel;
}
function createModal() {
  var modal = document.createElement('div');
  modal.className = 'add-clip-modal';
  modal.innerHTML = "\n        <h3 class=\"modal-title\" style=\"user-select: none; margin-bottom: 5px;\">Save a New Clip</h3>\n        <textarea class=\"modal-textarea\" placeholder=\"Enter text to save...\"></textarea>\n        <div class=\"modal-buttons\">\n            <button class=\"modal-btn cancel-btn\">Cancel</button>\n            <button class=\"modal-btn save-btn\">Save</button>\n        </div>\n    ";
  return modal;
}
function createModalOverlay() {
  var modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  return modalOverlay;
}
function createToast() {
  var toast = document.createElement('div');
  toast.className = 'toast';
  return toast;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/content.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_floating_button_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/floating-button.css */ "./src/styles/floating-button.css");
/* harmony import */ var _styles_panel_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/panel.css */ "./src/styles/panel.css");
/* harmony import */ var _styles_modal_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles/modal.css */ "./src/styles/modal.css");
/* harmony import */ var _styles_toast_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles/toast.css */ "./src/styles/toast.css");
/* harmony import */ var _ui_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui.js */ "./src/ui.js");
/* harmony import */ var _state_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./state.js */ "./src/state.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./events.js */ "./src/events.js");
/* harmony import */ var _drag_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./drag.js */ "./src/drag.js");








var floatingBtn = (0,_ui_js__WEBPACK_IMPORTED_MODULE_4__.createFloatingButton)();
var panel = (0,_ui_js__WEBPACK_IMPORTED_MODULE_4__.createPanel)();
var modal = (0,_ui_js__WEBPACK_IMPORTED_MODULE_4__.createModal)();
var modalOverlay = (0,_ui_js__WEBPACK_IMPORTED_MODULE_4__.createModalOverlay)();
var toast = (0,_ui_js__WEBPACK_IMPORTED_MODULE_4__.createToast)();
document.body.appendChild(floatingBtn);
document.body.appendChild(panel);
document.body.appendChild(modal);
document.body.appendChild(modalOverlay);
document.body.appendChild(toast);
(0,_state_js__WEBPACK_IMPORTED_MODULE_5__.loadClips)(function () {
  return (0,_state_js__WEBPACK_IMPORTED_MODULE_5__.renderClips)(toast);
});
(0,_events_js__WEBPACK_IMPORTED_MODULE_6__.bindEvents)(floatingBtn, panel, modal, modalOverlay, toast);
(0,_drag_js__WEBPACK_IMPORTED_MODULE_7__.enableDragging)(floatingBtn);
})();

/******/ })()
;
//# sourceMappingURL=content.bundle.js.map