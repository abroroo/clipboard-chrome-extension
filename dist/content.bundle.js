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
  var onMouseMove = function onMouseMove(e) {
    if (isDragging) {
      var dy = e.clientY - startY;

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
  floatingBtn.addEventListener('mousedown', function (e) {
    floatingBtn.classList.add('dragging');
    isDragging = true;
    startY = e.clientY;
    initialY = floatingBtn.getBoundingClientRect().top;
    document.body.style.userSelect = 'none'; // Prevent text selection
  });
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', function () {
    if (isDragging) {
      isDragging = false;
      floatingBtn.classList.remove('dragging');
      document.body.style.userSelect = ''; // Re-enable text selection
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Clean up if dragging ends
        animationFrameId = null;
      }
    }
  });
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
  floatingBtn.innerHTML = "\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"></path>\n            <rect x=\"8\" y=\"2\" width=\"8\" height=\"4\" rx=\"1\" ry=\"1\"></rect>\n        </svg>\n    ";
  return floatingBtn;
}
function createPanel() {
  var panel = document.createElement('div');
  panel.className = 'clipboard-panel';
  panel.innerHTML = "\n        <div class=\"panel-header\">\n            <div class=\"panel-title\">Go to Korean...</div>\n            <button class=\"add-btn\">+ New</button>\n        </div>\n        <div class=\"clips-container\"></div>\n    ";
  return panel;
}
function createModal() {
  var modal = document.createElement('div');
  modal.className = 'add-clip-modal';
  modal.innerHTML = "\n        <h3 style=\"user-select: none; margin-bottom: 5px;\">Add New Clip</h3>\n        <textarea class=\"modal-textarea\" placeholder=\"Enter text to save...\"></textarea>\n        <div class=\"modal-buttons\">\n            <button class=\"modal-btn cancel-btn\">Cancel</button>\n            <button class=\"modal-btn save-btn\">Save</button>\n        </div>\n    ";
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