/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

/**
 * Adds a class to the provided element
 *
 * @param el The HTMLElement to apply the class to.
 * @param className The class name to add to the element.
 */
function addClass(el: HTMLElement, className: string) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      if (!hasClass(el, className)) {
        el.className += ' ' + className;
      }
    }
  }

/**
 * Removes a class from the provided element
 *
 * @param el The HTMLElement to remove the class from.
 * @param className The class name to be removed from the element.
 */
function removeClass(el: HTMLElement, className: string) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' +
        className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}

/**
 * Checks to see if the provided class exists on the element
 *
 * @param el The HTMLElement to check.
 * @param className The class name to check for.
 */
function hasClass(el: HTMLElement, className: string) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
}

/**
 * Add multiple listeners
 *
 * @param element The HTMLElement to attach the eent listener to.
 * @param events Array with event names to attach
 * @param handler The handler function
 */
function addMultipleEventListener(element: HTMLElement, events: Array<string>, handler: any) {
    events.forEach(e => element.addEventListener(e, handler));
}


/**
 * Convert a Float32 Buffer to Int16
 * @param buffer Float 32 buffer
 * @return Int16 buffer
 */
function convertFloat32ToInt16(buffer: any) {
  let l = buffer.length;
  let buf = new Int16Array(l);
  while (l--) {
      buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
  }
  return buf.buffer;
}

/**
 * Convert a Int16 Buffer to Float32
 * @param buffer Int16 buffer
 * @return Float32 buffer
 */
function convertInt16ToFloat32(buffer: any) {
  let l = buffer.length;
  let output = new Float32Array(buffer.length - 0);
  for (let i = 0; i < l; i++) {
      let int = buffer[i];
      // If the high bit is on, then it is a negative number,
      // and actually counts backwards.
      let float = (int >= 0x8000) ? -(0x10000 - int) / 0x8000 : int / 0x7FFF;
      output[i] = float;
  }
  return output;
}

export {
  addClass,
  removeClass,
  hasClass,
  addMultipleEventListener,
  convertFloat32ToInt16,
  convertInt16ToFloat32
};
